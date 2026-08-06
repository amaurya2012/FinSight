# 💰 FinSight — Personal Finance Analytics Dashboard

FinSight is a full-stack personal finance tracker that goes beyond simple expense logging. It uses machine learning to automatically categorize transactions, predict next month's spending, and flag unusual expenses — turning raw transaction data into actionable financial insight.

Built as a data-science-forward portfolio project combining a **React frontend**, a **Node.js/Express API layer**, and a **Python/FastAPI machine learning microservice**.

---

## ✨ Features

- **Auto-Categorization** — Transaction descriptions (e.g. *"Swiggy dinner order"*) are automatically classified into spending categories using a TF-IDF + Naive Bayes model.
- **Spend Prediction** — A linear regression model forecasts next month's estimated spend based on historical monthly trends.
- **Anomaly Detection** — Statistically flags unusually large transactions (mean + 2 standard deviations) so unexpected expenses don't go unnoticed.
- **Interactive Dashboard** — Visual breakdown of spending by category, trend over time, and budget tracking.
- **Budgets** — Set monthly spending limits per category and track progress.
- **Wallet Selector** — Manage and switch between multiple accounts/wallets.
- **Notifications** — In-app alerts for budget limits and flagged anomalies.
- **AI Chat Assistant** — Conversational interface for querying spending data.
- **Data Export** — Export transaction history and reports.
- **Secure by Design** — Row Level Security (RLS) enforced at the database level so users can only ever access their own data.

---

## 🏗️ Architecture

```
┌─────────────────────┐
│   React Frontend     │  Vite + React + Tailwind CSS
│   (finsight-frontend)│  Dashboard, Transactions, Budgets, Insights UI
└──────────┬───────────┘
           │ REST API calls
           ▼
┌─────────────────────┐
│  Node.js Backend      │  Express.js
│  (finsight-backend)   │  Auth headers, CRUD routes, orchestration
└──────────┬───────────┘
           │                      │
           ▼                      ▼
┌─────────────────────┐  ┌──────────────────────┐
│  Supabase (PostgreSQL)│  │ FastAPI ML Service     │
│  Database + RLS       │  │ (analytics-service)    │
│  Auth                 │  │ Categorization,        │
└─────────────────────┘  │ Prediction, Anomalies  │
                          └──────────────────────┘
```

**Why a separate ML microservice?** Keeping the machine learning logic in a dedicated FastAPI service (rather than shelling out to Python from Node) mirrors how real production systems separate concerns — the Node backend handles auth, business logic, and orchestration, while FastAPI focuses purely on model inference. This also makes the ML service independently deployable and testable.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend API | Node.js, Express.js |
| ML Service | Python, FastAPI, scikit-learn, pandas |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| ML Techniques | TF-IDF Vectorization, Multinomial Naive Bayes, Linear Regression, Statistical Anomaly Detection |

---

## 📁 Project Structure

```
FinSight Analytics/
├── analytics-service/          # Python ML microservice
│   ├── analytics.py            # Model training: categorization, prediction, anomaly detection
│   ├── main.py                 # FastAPI app exposing ML endpoints
│   ├── categorizer_model.pkl   # Trained Naive Bayes model
│   ├── vectorizer.pkl          # Fitted TF-IDF vectorizer
│   ├── mock_transactions.csv   # Training data
│   └── venv/
│
├── finsight-backend/           # Node.js/Express API
│   ├── config/
│   │   └── supabase.js         # Supabase client configuration
│   ├── controllers/
│   │   ├── analytics.controller.js
│   │   ├── budgets.controller.js
│   │   ├── categories.controller.js
│   │   └── transactions.controller.js
│   ├── routes/
│   │   ├── analytics.routes.js
│   │   ├── budgets.routes.js
│   │   ├── categories.routes.js
│   │   └── transactions.routes.js
│   ├── server.js
│   ├── test.http               # API test requests (REST Client)
│   └── .env
│
└── finsight-frontend/          # React UI
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx        # Main overview: spend summary, charts
    │   │   ├── Transactions.jsx     # Transaction list & entry
    │   │   ├── Budgets.jsx          # Budget setting & tracking
    │   │   ├── Insights.jsx         # Trend, prediction & anomaly views
    │   │   ├── Sidebar.jsx          # Navigation
    │   │   ├── WalletSelector.jsx   # Multi-wallet switcher
    │   │   ├── NotificationCenter.jsx
    │   │   ├── AIChatModel.jsx      # Conversational query assistant
    │   │   ├── ExportButton.jsx     # Data export
    │   │   └── ThemeToggle.jsx
    │   ├── App.jsx
    │   ├── index.css            # Design tokens (colors, fonts)
    │   └── main.jsx
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- A Supabase project (free tier works)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd finsight-analytics
```

### 2. Set up the ML service (FastAPI)
```bash
cd analytics-service
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install fastapi uvicorn pandas scikit-learn
python analytics.py          # trains and saves the model
uvicorn main:app --reload --port 8000
```
Runs at `http://localhost:8000` — visit `/docs` for interactive API testing.

### 3. Set up the backend (Node.js)
```bash
cd finsight-backend
npm install
```

Create a `.env` file:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
FASTAPI_URL=http://localhost:8000
PORT=5000
```

```bash
node server.js
```
Runs at `http://localhost:5000`.

### 4. Set up the frontend (React)
```bash
cd finsight-frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `finsight_profiles` | User profile info (linked to Supabase Auth) |
| `finsight_categories` | Spending categories (Food, Rent, Bills, etc.) |
| `finsight_transactions` | Individual income/expense records |
| `finsight_budgets` | Monthly budget limits per category |

All tables have **Row Level Security (RLS)** enabled, ensuring each user can only read/write their own records. The backend uses the Supabase `service_role` key (a trusted server context) and enforces the same isolation in application code via `user_id` filtering on every query.

---

## 🔌 API Endpoints

### Node.js Backend (`/api`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET/POST | `/api/categories` | List / create categories |
| DELETE | `/api/categories/:id` | Delete a category |
| GET/POST | `/api/transactions` | List / create transactions (auto-categorized) |
| PUT/DELETE | `/api/transactions/:id` | Update / delete a transaction |
| GET/POST | `/api/budgets` | List / create budgets |
| PUT | `/api/budgets/:id` | Update a budget |
| GET | `/api/analytics/trend` | Monthly spend trend |
| GET | `/api/analytics/prediction` | Next month's predicted spend |
| GET | `/api/analytics/anomalies` | Flagged unusual transactions |

### FastAPI ML Service
| Method | Endpoint | Description |
|---|---|---|
| POST | `/predict-category` | Categorize a single transaction description |
| POST | `/analytics/trend` | Compute monthly totals from a transaction list |
| POST | `/analytics/prediction` | Predict next month's spend |
| POST | `/analytics/anomalies` | Detect anomalous transactions |
| GET | `/health` | Service health check |

---

## 🧠 Machine Learning Details

**Categorization Model**
- Algorithm: Multinomial Naive Bayes over TF-IDF vectorized transaction descriptions (unigrams + bigrams)
- Accuracy: ~98–100% on held-out test data (mock training set)

**Spend Prediction**
- Algorithm: Linear Regression fit on monthly aggregated spend totals
- Limitation: Predictions can be skewed when the most recent month has incomplete data, since it's treated as a full data point in the trend

**Anomaly Detection**
- Method: Statistical thresholding — a transaction is flagged if `amount > mean + 2 × standard deviation`
- Limitation: With small sample sizes, recurring large expenses (e.g. rent) can inflate the threshold, reducing sensitivity. A category-aware threshold is a planned improvement.

---

## 🔮 Future Improvements

- Category-aware anomaly detection (separate thresholds per category)
- Exclude in-progress months from trend-based predictions
- Recurring transaction detection (auto-flag subscriptions, rent)
- Mobile-responsive UI polish
- CSV/bank statement import

---

## 👩‍💻 Author

Built by Ajeyata Maurya — B.Tech CSE (Data Science)