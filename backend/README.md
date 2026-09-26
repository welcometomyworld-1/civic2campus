# Civic2Campus Backend — FastAPI + MongoDB Atlas 🚀

Civic2Campus connects:
**Citizens → AI Engine → Universities → Industry → Solutions → Impact**

A high-performance asynchronous REST API backend built with **Python 3.11**, **FastAPI**, **Pydantic v2**, and **MongoDB Atlas** (using Motor async connection pooling).

---

## 🏗️ Architecture

```
        React 19 / Vite Frontend (http://localhost:3000)
                     │
                     │ REST / JSON (JWT Protected)
                     ▼
             Python FastAPI Backend (http://localhost:8000)
                     │
       ┌─────────────┴─────────────┐
       │                           │
  Backend AI Engine          MongoDB Atlas (Async Motor)
(Gemini / R&D Briefs)    (Users, Problems, Matches, Squads,
       │                  Collaborations, Projects, Solutions,
       │                  Map Telemetry, Notifications, Audits)
       └─────────────┬─────────────┘
                     │
                Civic2Campus
```

---

## 🚀 Quickstart Guide

### 1. Navigate to Backend & Create Virtual Environment
```bash
cd backend

# Windows:
py -3.11 -m venv venv
venv\Scripts\activate

# macOS / Linux:
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
copy .env.example .env    # On Windows
# cp .env.example .env    # On Linux/macOS
```

Verify your `.env` settings:
```env
MONGODB_URI=mongodb+srv://sk8789682127_db_user:WN5cxUyNDWcwtPyo@cluster0.mongodb.net/civic2campus?retryWrites=true&w=majority
DB_NAME=civic2campus
JWT_SECRET=civic2campus_development_jwt_secret_key_2026_super_secure_auth
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_URL=http://localhost:3000
AI_API_KEY=
UPLOAD_DIR=uploads
```

### 4. Seed Realistic Prototype Data (Optional)
```bash
python scripts/seed.py
```

### 5. Start Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Server runs at **`http://localhost:8000`**.

---

## 📖 Interactive API Documentation
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI JSON:** [http://localhost:8000/api/openapi.json](http://localhost:8000/api/openapi.json)

---

## 🧪 Automated Testing
Run the complete test suite with 30 unit and integration tests:
```bash
py -3.11 -m pytest tests/ -v
```

---

## 🔑 Pre-Configured Demo Accounts

| Role | Email | Password | Persona |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@civic2campus.org` | `Citizen123!` | Rohan Verma (Namkum, Ranchi) |
| **University** | `university@bitmesra.ac.in` | `University123!` | Dr. Alok Verma (BIT Mesra) |
| **Industry** | `csr@tatasteel.com` | `Industry123!` | Tata Steel CSR Lead (Jamshedpur) |
| **Government** | `dc@ranchi.gov.in` | `Gov123!` | District Administration (Ranchi) |
| **Admin** | `admin@civic2campus.gov.in` | `Admin123!` | Statewide Platform Administrator |

---

## 📂 Backend Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── admin.py           # Admin controls & audit logs
│   │       ├── ai.py              # Semantic vector extraction
│   │       ├── auth.py            # User registration & JWT login
│   │       ├── collaborations.py  # Institutional partnerships
│   │       ├── dashboards.py      # Aggregated metrics for 4 roles
│   │       ├── industry_hubs.py   # CSR funding, tech support, solutions
│   │       ├── map.py             # Statewide 3D telemetry
│   │       ├── matching.py        # AI lab recommendations
│   │       ├── notifications.py   # Live notification stream
│   │       ├── problems.py        # Citizen problem intake
│   │       ├── projects.py        # Student squad milestones
│   │       ├── search.py          # Global search across entities
│   │       ├── solutions.py       # Prototypes & NIRF credits
│   │       ├── squads.py          # Engineering teams
│   │       └── university_hubs.py # University collaborations & profiles
│   ├── config/
│   ├── database/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── utils/
├── scripts/                       # Database seeding scripts
├── tests/                         # Pytest test suite (30 tests)
├── requirements.txt               # Grouped Python dependencies
├── pytest.ini
└── README.md
```
