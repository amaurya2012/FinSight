"""
FinSight - Full Analytics Module
----------------------------------
3 core ML/stats features:
1. Transaction Auto-Categorization (TF-IDF + Naive Bayes)
2. Spend Prediction (Linear Regression on monthly trend)
3. Anomaly Detection (statistical threshold - mean + 2*std)

Run: python analytics.py
"""

import pandas as pd
import numpy as np
import random
import pickle
from datetime import datetime, timedelta
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


# ============================================================
# PART 1: CATEGORIZATION
# ============================================================

def generate_mock_transactions(save_path="mock_transactions.csv", days=180):
    """Generates mock transactions with descriptions, categories, amounts AND dates
    (dates needed for prediction + anomaly detection)"""
    data_templates = {
        "Food": ["Swiggy Order", "Zomato Delivery", "Dominos Pizza", "Starbucks Coffee",
                 "McDonalds", "Local Restaurant", "Grocery Store BigBasket", "Cafe Coffee Day"],
        "Rent": ["Monthly Rent Payment", "House Rent", "Flat Rent Transfer"],
        "Shopping": ["Amazon Purchase", "Myntra Order", "Flipkart Shopping", "Zara Store",
                     "H&M Purchase", "Nykaa Order"],
        "Bills": ["Electricity Bill", "Water Bill Payment", "Internet Bill Jio",
                  "Mobile Recharge Airtel", "Gas Bill Payment"],
        "Transport": ["Uber Ride", "Ola Cab", "Metro Card Recharge", "Petrol Pump",
                      "Rapido Bike"],
        "Entertainment": ["Netflix Subscription", "Spotify Premium", "Movie Ticket BookMyShow",
                          "PVR Cinemas", "Amazon Prime Video"],
        "Healthcare": ["Pharmacy Medicine", "Doctor Consultation", "Apollo Pharmacy",
                       "Hospital Bill", "Medical Checkup"],
        "Others": ["ATM Withdrawal", "Bank Transfer", "Miscellaneous Payment", "Gift Purchase"]
    }

    rows = []
    start_date = datetime.now() - timedelta(days=days)

    for category, descriptions in data_templates.items():
        for desc in descriptions:
            for _ in range(15):
                amount = round(random.uniform(50, 5000), 2)
                random_day = random.randint(0, days)
                date = start_date + timedelta(days=random_day)
                rows.append({
                    "description": desc,
                    "category": category,
                    "amount": amount,
                    "date": date.strftime("%Y-%m-%d")
                })

    # Inject a few anomalies (unusually large transactions) for testing
    anomaly_descriptions = ["Emergency Hospital Bill", "Laptop Purchase Amazon", "Flight Ticket Booking"]
    for desc in anomaly_descriptions:
        amount = round(random.uniform(20000, 50000), 2)  # much larger than normal
        random_day = random.randint(0, days)
        date = start_date + timedelta(days=random_day)
        rows.append({
            "description": desc,
            "category": "Others",
            "amount": amount,
            "date": date.strftime("%Y-%m-%d")
        })

    df = pd.DataFrame(rows)
    df = df.sample(frac=1).reset_index(drop=True)
    df.to_csv(save_path, index=False)
    print(f"[Data] Generated {len(df)} transactions (incl. {len(anomaly_descriptions)} anomalies) -> {save_path}")
    return df


def train_categorizer(df):
    X, y = df['description'], df['category']
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    vectorizer = TfidfVectorizer(lowercase=True, stop_words='english', ngram_range=(1, 2))
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    model = MultinomialNB()
    model.fit(X_train_vec, y_train)

    accuracy = accuracy_score(y_test, model.predict(X_test_vec))
    print(f"\n[Categorizer] Accuracy: {accuracy * 100:.2f}%")

    return model, vectorizer


def predict_category(description: str, model, vectorizer) -> str:
    vec = vectorizer.transform([description])
    return model.predict(vec)[0]


# ============================================================
# PART 2: SPEND PREDICTION (next month's estimated spend)
# ============================================================

def predict_next_month_spend(df):
    """Groups transactions by month, fits linear regression, predicts next month."""
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.to_period('M')

    monthly_totals = df.groupby('month')['amount'].sum().reset_index()
    monthly_totals['month_index'] = range(len(monthly_totals))

    if len(monthly_totals) < 2:
        print("[Prediction] Not enough months of data to predict trend.")
        return None

    X = monthly_totals[['month_index']]
    y = monthly_totals['amount']

    reg = LinearRegression()
    reg.fit(X, y)

    next_month_index = [[len(monthly_totals)]]
    predicted_spend = reg.predict(next_month_index)[0]

    print(f"\n[Prediction] Monthly totals so far:")
    print(monthly_totals[['month', 'amount']].to_string(index=False))
    print(f"\n[Prediction] Predicted next month's spend: Rs.{predicted_spend:,.2f}")

    return predicted_spend


# ============================================================
# PART 3: ANOMALY DETECTION (mean + 2*std threshold)
# ============================================================

def detect_anomalies(df):
    """Flags transactions where amount > mean + 2*std_dev as anomalies."""
    mean_amount = df['amount'].mean()
    std_amount = df['amount'].std()
    threshold = mean_amount + 2 * std_amount

    df['is_anomaly'] = df['amount'] > threshold
    anomalies = df[df['is_anomaly']].sort_values('amount', ascending=False)

    print(f"\n[Anomaly Detection] Mean: Rs.{mean_amount:,.2f}, Std: Rs.{std_amount:,.2f}, Threshold: Rs.{threshold:,.2f}")
    print(f"[Anomaly Detection] Found {len(anomalies)} anomalous transactions:")
    if len(anomalies) > 0:
        print(anomalies[['description', 'amount', 'date']].to_string(index=False))

    return anomalies


# ============================================================
# SAVE MODEL
# ============================================================

def save_model(model, vectorizer, model_path="categorizer_model.pkl", vec_path="vectorizer.pkl"):
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
    with open(vec_path, "wb") as f:
        pickle.dump(vectorizer, f)
    print(f"\n[Save] Model saved -> {model_path}, {vec_path}")


# ============================================================
# MAIN - run everything end-to-end
# ============================================================

if __name__ == "__main__":
    # 1. Generate data
    df = generate_mock_transactions()

    # 2. Train categorizer
    model, vectorizer = train_categorizer(df)
    save_model(model, vectorizer)

    # 3. Test categorization on new descriptions
    print("\n--- Testing categorization on new transactions ---")
    test_transactions = ["Swiggy dinner order", "Uber to office", "Netflix monthly subscription"]
    for t in test_transactions:
        print(f"'{t}' -> {predict_category(t, model, vectorizer)}")

    # 4. Predict next month's spend
    predict_next_month_spend(df)

    # 5. Detect anomalies
    detect_anomalies(df)