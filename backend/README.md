# INNER AWAKENING — Backend Foundation

Production-grade modular backend foundation for **INNER AWAKENING**, a gamified fitness RPG combining computer-vision exercise tracking, real-time rank progression, 3D character customization, and multiplayer leaderboards.

---

## 1. Architecture Overview

- **Framework**: FastAPI (Python 3.12+)
- **ORM & Database**: SQLAlchemy 2.0 (Async) + PostgreSQL 16 (with SQLite async fallback for lightweight local verification)
- **Migrations**: Alembic (Async configured)
- **Validation**: Pydantic 2.x & Pydantic Settings
- **Cache & Realtime**: Redis 7
- **Containerization**: Docker & Docker Compose

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app factory, CORS, lifespan, routes
│   ├── core/
│   │   ├── config.py            # Pydantic Settings from .env
│   │   ├── database.py          # Async engine, AsyncSession, get_db dependency
│   │   └── security.py          # Password hashing, JWT auth utilities
│   ├── api/
│   │   └── v1/
│   │       ├── api.py           # V1 route aggregator
│   │       └── endpoints/
│   │           └── health.py    # Health check endpoints
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic request/response schemas
│   ├── services/                # Business logic layer
│   └── repositories/            # Database access layer
├── alembic/                     # Database migrations
├── tests/                       # Pytest test suite
├── Dockerfile                   # Optimized multi-stage Docker build
├── docker-compose.yml           # FastAPI + PostgreSQL + Redis stack
├── requirements.txt             # Python dependencies
└── .env.example                 # Environment variables template
```

---

## 2. Quickstart

### Option A: Local Development (Python Virtual Environment)

1. **Activate Virtual Environment**:
   ```bash
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Run Application**:
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Verify Health Endpoint**:
   ```bash
   curl http://localhost:8000/health
   # Response: {"status": "ok", "service": "inner-awakening-backend"}
   ```

5. **Open Interactive API Docs**:
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### Option B: Docker Compose (Full Stack with PostgreSQL & Redis)

1. **Start Services**:
   ```bash
   cd backend
   docker compose up --build -d
   ```

2. **Check Container Status**:
   ```bash
   docker compose ps
   ```

3. **View Logs**:
   ```bash
   docker compose logs -f backend
   ```

4. **Stop Services**:
   ```bash
   docker compose down
   ```

---

## 3. Database Migrations (Alembic)

```bash
cd backend

# Create a new revision
alembic revision --autogenerate -m "Initial tables"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

---

## 4. Running Automated Tests

```bash
cd backend
pytest tests/ -v
```
