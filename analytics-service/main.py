"""
FinSight - FastAPI Analytics Service
----------------------------------------
Exposes 4 endpoints that Node.js backend will call:

1. POST /predict-category    -> categorize a single transaction description
2. POST /analytics/trend      -> monthly spend totals from transaction list
3. POST /analytics/prediction -> predicted next month's spend
4. POST /analytics/anomalies  -> flag unusual transactions

Run: uvicorn main:app --reload --port 8000
Docs: http://localhost:8000/docs  (FastAPI auto-generates this - very useful for testing)
"""

import pickle
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sklearn.linear_model import LinearRegression


# ============================================================
# APP SETUP
# ============================================================

app = FastAPI(title="FinSight Analytics Service")

# Allow Node.js backend (running on a different port) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your actual frontend/backend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained categorization model once at startup (not on every request - faster)
try:
    with open("categorizer_model.pkl", "rb") as f:
        model = pickle.load(f)
    with open("vectorizer.pkl", "rb") as f:
        vectorizer = pickle.load(f)
    print("Categorization model loaded successfully.")
except FileNotFoundError:
    model, vectorizer = None, None
    print("WARNING: Model files not found. Run analytics.py first to train and save the model.")


# ============================================================
# REQUEST/RESPONSE SCHEMAS (Pydantic - FastAPI validates automatically)
# ============================================================

class CategoryRequest(BaseModel):
    description: str


class CategoryResponse(BaseModel):
    description: str
    predicted_category: str


class Transaction(BaseModel):
    description: str
    amount: float
    date: str  # format: "YYYY-MM-DD"


class TransactionList(BaseModel):
    transactions: List[Transaction]


# ============================================================
# ENDPOINT 1: Categorize a single transaction
# ============================================================

@app.post("/predict-category", response_model=CategoryResponse)
def predict_category(request: CategoryRequest):
    if model is None or vectorizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Train the model first.")

    vec = vectorizer.transform([request.description])
    prediction = model.predict(vec)[0]

    return CategoryResponse(description=request.description, predicted_category=prediction)


# ============================================================
# ENDPOINT 2: Monthly spend trend
# ============================================================

@app.post("/analytics/trend")
def get_spend_trend(payload: TransactionList):
    if len(payload.transactions) == 0:
        raise HTTPException(status_code=400, detail="No transactions provided.")

    df = pd.DataFrame([t.model_dump() for t in payload.transactions])
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.to_period('M').astype(str)

    monthly_totals = df.groupby('month')['amount'].sum().reset_index()

    return {"trend": monthly_totals.to_dict(orient="records")}


# ============================================================
# ENDPOINT 3: Predict next month's spend
# ============================================================

@app.post("/analytics/prediction")
def predict_next_month(payload: TransactionList):
    df = pd.DataFrame([t.model_dump() for t in payload.transactions])
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.to_period('M')

    monthly_totals = df.groupby('month')['amount'].sum().reset_index()
    monthly_totals['month_index'] = range(len(monthly_totals))

    if len(monthly_totals) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 months of data to predict a trend.")

    X = monthly_totals[['month_index']]
    y = monthly_totals['amount']

    reg = LinearRegression()
    reg.fit(X, y)

    next_index = pd.DataFrame({'month_index': [len(monthly_totals)]})
    predicted = reg.predict(next_index)[0]

    return {"predicted_next_month_spend": round(float(predicted), 2)}


# ============================================================
# ENDPOINT 4: Anomaly detection
# ============================================================

@app.post("/analytics/anomalies")
def get_anomalies(payload: TransactionList):
    df = pd.DataFrame([t.model_dump() for t in payload.transactions])

    mean_amount = df['amount'].mean()
    std_amount = df['amount'].std()
    threshold = mean_amount + 2 * std_amount

    df['is_anomaly'] = df['amount'] > threshold
    anomalies = df[df['is_anomaly']].sort_values('amount', ascending=False)

    return {
        "threshold": round(float(threshold), 2),
        "anomaly_count": len(anomalies),
        "anomalies": anomalies[['description', 'amount', 'date']].to_dict(orient="records")
    }


# ============================================================
# HEALTH CHECK (useful to confirm the service is running)
# ============================================================

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}