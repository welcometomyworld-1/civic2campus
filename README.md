# Civic2Campus — AI-Powered Civic Innovation Ecosystem 🚀
> **Government of Jharkhand • Statewide Higher Education & Innovation Matrix 2026**  
> *Connecting Grassroots Problems with University Research Labs, Student Squads, Industry CSR Co-Funding, and Government Administration.*

---

## 🌟 Overview

**Civic2Campus** is a state-level civic innovation platform designed to transform grassroots civic and infrastructure challenges into verified, research-backed technological innovations. 

Leveraging **Semantic AI Priority Scoring**, **Interactive Three.js 3D Geospatial Telemetry**, and **Role-Based Workspaces**, Civic2Campus bridges citizens, 42+ higher education institutions, corporate CSR partners, and district administration across all 24 districts of Jharkhand.

---

## 🏗️ System Architecture

```
                                  ┌────────────────────────────────┐
                                  │   Grassroots Citizen Intake    │
                                  │  (Geotagged Proof + Telemetry) │
                                  └───────────────┬────────────────┘
                                                  │
                                                  ▼
                                  ┌────────────────────────────────┐
                                  │    AI Semantic Parsing Engine  │
                                  │  (Vector Score 0-100 & Cluster)│
                                  └───────────────┬────────────────┘
                                                  │
              ┌───────────────────────────────────┼───────────────────────────────────┐
              ▼                                   ▼                                   ▼
┌───────────────────────────┐       ┌───────────────────────────┐       ┌───────────────────────────┐
│   University Research     │       │   Corporate CSR Partners  │       │   Government Command      │
│   Faculty & Student Squads│◄─────►│   Funding & Tech Support  │◄─────►│   Statewide Administration│
│   (BIT, IIT-ISM, BAU, NIT)│       │   (Tata Steel, WaterTech) │       │   (DC, Jal Jeevan Mission)│
└─────────────┬─────────────┘       └─────────────┬─────────────┘       └─────────────┬─────────────┘
              │                                   │                                   │
              └───────────────────────────────────┼───────────────────────────────────┘
                                                  ▼
                                  ┌────────────────────────────────┐
                                  │   Verified Field Deployment    │
                                  │ (2.8M+ Citizens Impacted • IoT)│
                                  └────────────────────────────────┘
```

---

## 🚀 Key Modules & Hubs Implemented

### 1. 🏢 Industry Dashboard (6 Functional Hubs)
- **💰 CSR Funding Hub (`/industry/funding`):** Track CSR budget allocations, commit grants to active civic projects, review grant milestones, and disburse seed capital.
- **🛠️ Tech Support Hub (`/industry/support`):** Provide specialized engineering mentorship, offer testing equipment/IoT hardware kits, and review technical roadmaps.
- **💡 Solutions Hub (`/industry/solutions`):** Browse verified student prototypes, sponsor lab testing kits, and fast-track field deployment.
- **🗺️ Innovation Map Hub (`/industry/innovation-map`):** Filter CSR investment hotspots across all 24 Jharkhand districts.
- **📊 Impact Hub (`/industry/impact`):** Monitor verified beneficiary households, clean water telemetry uptime, and carbon offset analytics.
- **🏢 Industry Profile Hub (`/industry/profile`):** Manage corporate profile, representative credentials, CSR compliance tags, and focus domains.

---

### 2. 🎓 University Dashboard (6 Functional Hubs)
- **🤝 Active Collaborations Hub (`/university/collaborations`):** Assemble multidisciplinary student engineering squads, assign faculty guides, and partner with industry sponsors.
- **💡 Solutions Hub (`/university/solutions`):** Submit verified prototypes, track intellectual property/patent filings, and earn state academic NIRF social credits.
- **🗺️ Innovation Map Hub (`/university/innovation-map`):** Real-time district problem feed sorted by engineering disciplines (IoT, Agritech, Water Remediation, Telehealth).
- **📊 Impact Hub (`/university/impact`):** Track publication citations, prototype field reliability, and student researcher skill badges.
- **🔔 Notifications Hub (`/university/notifications`):** Real-time alerts for project matches, CSR grant approvals, and district magistrate verifications.
- **🎓 University Profile Hub (`/university/profile`):** Showcase institution accreditations (NIRF, NAAC), research lab infrastructure, and faculty rosters.

---

### 3. 🏛️ Government Command Center (4 Functional Hubs)
- **🚨 Statewide Surveillance (`/government/surveillance`):** Live intake telemetry, district urgency heatmaps, and unresolved problem queues.
- **🗺️ Statewide 3D Innovation Map (`/government/innovation-map`):** Interactive geospatial visualization of problem clusters, research nodes, and pilot installations.
- **📊 State Analytics (`/government/analytics`):** Cross-district resolution velocity, fund absorption rates, and demographic impact metrics.
- **📑 Reports & Audit Logs (`/government/reports`):** Synchronized reporting with Jal Jeevan Mission, Swachh Bharat, and NIRF state education league tables.

---

### 4. 🏆 Jharkhand University Innovation & Social Impact Rankings 2026
- Real-time leaderboard benchmarking universities across:
  - **Verified Community Problem Resolution Velocity**
  - **Student Engineering Squad Prototypes**
  - **CSR Co-Funding & Grant Absorption**
  - **NIRF Social Credit Accreditation**
- Interactive Search, Tier Filter (IIT/NIT/BIT, Agri & Health, State Public), and Dossier Modal for institutional research deep dives.

---

### 5. 🗺️ Interactive Three.js 3D WebGL District Map & Network
- **3D District Map:** Custom 3D interactive terrain of Jharkhand highlighting district hotspots (Gumla, Ranchi, Dhanbad, East Singhbhum, etc.) with zoom, rotate, and inspector drawer.
- **3D Civic Network:** Dynamic particle node network representing live interconnected data signals between citizens, labs, and CSR sponsors.

---

### 6. 🧠 AI Match Engine & Semantic Intelligence Studio
- Real-time semantic analysis translating raw citizen descriptions into multi-vector priority scores (0–100).
- Automatic extraction of domains, subdomains, affected population metrics, duplicate problem clusters, and best institutional research lab recommendations.

---

### 7. 🔐 Role-Based Authentication (RBAC) & 1-Click Demo Profiles
- **JWT Authentication** with password hashing (`bcrypt`), CSRF protection, and role-based route guards.
- **Instant 1-Click Demo Accounts:**
  - **Citizen:** `citizen@civic2campus.org`
  - **University:** `university@bitmesra.ac.in`
  - **Industry:** `csr@tatasteel.com`
  - **Government:** `dc@ranchi.gov.in`
  - **Admin:** `admin@civic2campus.gov.in`

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **3D & Visualizations** | Three.js + WebGL Canvas + Lucide Icons |
| **Styling & Design System** | Tailwind CSS + Accessible WCAG AA Tokens + Glassmorphism |
| **Backend Framework** | Python 3.11 + FastAPI (Async REST API) |
| **Database** | MongoDB Atlas / Local MongoDB (Motor Async Connection Pooling) |
| **Authentication & Security**| PyJWT + Bcrypt Password Hashing + Pydantic v2 Validation |
| **Testing** | Pytest + Pytest-Asyncio (30+ Integration Tests) + Vite Build |

---

## ⚡ Step-by-Step Setup & Running Guide

### Prerequisites
- **Node.js** (v18 or v20+)
- **Python** (v3.11 recommended)
- **MongoDB** (MongoDB Atlas connection string or local MongoDB instance on port 27017)

---

### 1. Backend Setup (FastAPI + MongoDB)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
py -3.11 -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install all backend dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env and verify MONGODB_URI and JWT_SECRET
copy .env.example .env

# (Optional) Seed realistic demo data across all districts & roles
python scripts/seed.py

# Start backend development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend API will be available at: **`http://localhost:8000`**  
Interactive Swagger API Documentation: **`http://localhost:8000/docs`**

---

### 2. Frontend Setup (React + Vite + TypeScript)

```bash
# In the root civic2campus directory:
npm install

# Start Vite development server
npm run dev
```
Frontend Web App will be available at: **`http://localhost:3000`** (or `http://localhost:5173`).

---

## 🧪 Automated Testing & Verification

### Run Backend Unit & Integration Tests
```bash
cd backend
py -3.11 -m pytest tests/ -v
```
*Executes all 30 test suites validating Auth, AI Engine, Matching, Squads, Solution Hubs, Collaborations, and Maps.*

### Run Frontend TypeScript & Production Build Validation
```bash
npm run build
```
*Validates type safety, CSS bundle compilation, and assets without errors.*

---

## 🎨 Design & Usability Heuristics Compliance
- **Standardized Type Scale:** Strict 8-step typography scale (`text-xs` to `text-6xl`) with 0 arbitrary unreadable fonts.
- **Harmonious Color Palette:** High-contrast WCAG AA accessible text colors (`text-stone-900`, `text-stone-600`, `text-blue-600`, `text-emerald-800`, `text-rose-600`).
- **Consistent Corner Radii:** System tokens (`rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`).
- **Clear CTA Hierarchy:** Primary solid fill, secondary outline, and tertiary ghost pills.
- **Semantic Outline:** Strict heading hierarchy ($H1 \to H2 \to H3$) preserving accessibility for screen readers.

---

## 📜 License
Developed for the **Jharkhand Civic Innovation Network 2026**. Designed to empower citizens, students, faculty, and industry leaders through purposeful innovation.
