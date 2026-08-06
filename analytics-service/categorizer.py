"""
FinSight - Transaction Auto-Categorization Module
----------------------------------------------------
Ye single file 3 kaam karta hai:
1. Mock transaction data generate karta hai
2. TF-IDF + Naive Bayes model train karta hai
3. Model ko save karta hai + prediction function deta hai

Run: python categorizer.py
"""

import pandas as pd
import random
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


# -------------------------------------------------
# STEP 1: Generate mock transaction data
# -------------------------------------------------
def generate_mock_data(save_path="mock_transactions.csv"):
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
    for category, descriptions in data_templates.items():
        for desc in descriptions:
            for _ in range(15):  # 15 samples per description
                amount = round(random.uniform(50, 5000), 2)
                rows.append({"description": desc, "category": category, "amount": amount})

    df = pd.DataFrame(rows)
    df = df.sample(frac=1).reset_index(drop=True)  # shuffle
    df.to_csv(save_path, index=False)
    print(f"[1/3] Generated {len(df)} sample transactions -> {save_path}")
    print(df['category'].value_counts())
    return df


# -------------------------------------------------
# STEP 2: Train the model
# -------------------------------------------------
def train_model(df):
    X = df['description']
    y = df['category']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    vectorizer = TfidfVectorizer(lowercase=True, stop_words='english', ngram_range=(1, 2))
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    model = MultinomialNB()
    model.fit(X_train_vec, y_train)

    y_pred = model.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"\n[2/3] Model trained. Accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_test, y_pred, zero_division=0))

    return model, vectorizer, accuracy


# -------------------------------------------------
# STEP 3: Save model + vectorizer
# -------------------------------------------------
def save_model(model, vectorizer, model_path="categorizer_model.pkl", vec_path="vectorizer.pkl"):
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
    with open(vec_path, "wb") as f:
        pickle.dump(vectorizer, f)
    print(f"\n[3/3] Model saved -> {model_path}, {vec_path}")


# -------------------------------------------------
# Prediction function (FastAPI service isko import karega)
# -------------------------------------------------
def predict_category(description: str, model, vectorizer) -> str:
    vec = vectorizer.transform([description])
    prediction = model.predict(vec)[0]
    return prediction


def load_model(model_path="categorizer_model.pkl", vec_path="vectorizer.pkl"):
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    with open(vec_path, "rb") as f:
        vectorizer = pickle.load(f)
    return model, vectorizer


# -------------------------------------------------
# Main - run everything end-to-end
# -------------------------------------------------
if __name__ == "__main__":
    df = generate_mock_data()
    model, vectorizer, accuracy = train_model(df)
    save_model(model, vectorizer)

    # Test predictions on new/unseen transaction descriptions
    print("\n--- Testing on new transactions ---")
    test_transactions = [
        "Swiggy dinner order",
        "Uber to office",
        "Netflix monthly subscription",
        "Paid electricity bill",
        "Bought new shoes from Amazon",
        "Doctor visit for fever"
    ]
    for t in test_transactions:
        pred = predict_category(t, model, vectorizer)
        print(f"'{t}' -> {pred}")