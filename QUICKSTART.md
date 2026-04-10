# Neeti AI — Quick Start

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed & running
- [Node.js 20+](https://nodejs.org/) (for local frontend dev)
- A [Supabase](https://supabase.com) project (free tier works)

## 1. Configure Environment

```bash
# Edit .env in the project root — fill in your Supabase keys:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 2. Start Everything with Docker

```bash
# From the project root:
docker compose up --build
```

This starts:
| Service          | URL / Port             |
|-----------------|------------------------|
| **API Server**   | http://localhost:8000   |
| **Frontend**     | http://localhost:3000   |
| **PostgreSQL**   | localhost:5432          |
| **Redis**        | localhost:6379          |
| **MinIO Console**| http://localhost:9001   |
| **Ollama**       | http://localhost:11434  |

## 3. Local Frontend Development (Optional)

For hot-reload during frontend development:

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173 (connects to Docker backend on :8000)
```

## 4. Verify

```bash
# Health check
curl http://localhost:8000/health

# API info
curl http://localhost:8000/api/info
```

## Architecture

```
NETII Ai_1221/
├── app/                    # FastAPI backend
│   ├── api/                # REST & WebSocket routes
│   ├── core/               # Auth, config, database
│   ├── models/             # SQLAlchemy ORM models
│   ├── schemas/            # Pydantic schemas
│   ├── services/           # AI, LiveKit, Judge0, etc.
│   ├── agents/             # 5 AI evaluation agents
│   └── workers/            # Celery background tasks
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── pages/          # Route pages
│   │   ├── components/     # Reusable UI
│   │   ├── store/          # Zustand state
│   │   └── lib/            # API client, websocket, supabase
│   └── Dockerfile
├── docker-compose.yml      # Full-stack orchestration
├── Dockerfile              # Backend container
├── Dockerfile.worker       # Celery worker container
├── requirements.txt        # Python dependencies
└── .env                    # Environment configuration
```

## User Roles

| Role        | Can Do                                              |
|------------|-----------------------------------------------------|
| **Recruiter** | Create sessions, view session codes, start/end sessions, monitor live code, view evaluations |
| **Candidate** | Join sessions via code, write code in interview room, participate in video call |
