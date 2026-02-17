# Todo App - AI-Powered Task Manager (Phase III)

A modern, full-stack AI-powered Todo application with natural language task management through conversational AI. Built with Next.js, FastAPI, OpenAI Agents SDK, and PostgreSQL (Neon).

## 🤖 **Phase III: AI Chat Integration**

Phase III transforms the traditional form-based todo app into an intelligent conversational task manager powered by OpenAI's GPT-4 and the Model Context Protocol (MCP).

### **What's New in Phase III:**
- 🤖 **AI Chat Interface**: Manage tasks through natural language conversation
- 💬 **Persistent Conversations**: Full chat history with conversation switching
- 🔧 **MCP Tools**: 5 stateless tools (add, list, complete, update, delete tasks)
- 🎨 **Modern Figma UI**: Beautiful gradient backgrounds and card-based design
- 🏗️ **Constitutional Architecture**: Fully stateless backend with 8-step execution cycle

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11 or 3.12
- **PostgreSQL** database (Neon recommended)
- **OpenAI API Key** (required for Phase III AI features) - Get one at https://platform.openai.com/api-keys

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd from-phase-2
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file with required configuration
# DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
# BETTER_AUTH_SECRET=your-secret-key-here
# OPENAI_API_KEY=sk-your-openai-api-key-here
# OPENAI_MODEL=gpt-4-turbo-preview

# Run database migrations (if needed)
cd migrations
python run_migration.py 001_fix_users_table_nullable_fields.sql
cd ..

# Start backend server
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run on: **http://localhost:8000**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Start frontend server
npm run dev
```

Frontend will run on: **http://localhost:3000**

## 📋 Features

### 🤖 AI Chat Features (Phase III - NEW!)
- ✅ **Natural Language Task Management**: "remind me to buy groceries", "show my tasks", "complete task 5"
- ✅ **Persistent Conversations**: Full chat history with conversation switching
- ✅ **Stateless Architecture**: 8-step execution cycle per constitutional requirements
- ✅ **MCP Tools Integration**: 5 stateless tools for task operations
- ✅ **AI-Powered Understanding**: GPT-4 powered natural language processing
- ✅ **Conversation History Loading**: Resume previous conversations seamlessly
- ✅ **Rate Limiting**: 100 requests/hour/user to prevent abuse

### Authentication
- ✅ User registration with email/password
- ✅ Secure login with JWT tokens
- ✅ Password hashing (bcrypt)
- ✅ Protected routes
- ✅ Multi-user support (each user sees only their tasks)
- ✅ String-based user IDs (constitution-compliant)

### Task Management
- ✅ Create tasks via AI chat or traditional forms
- ✅ Mark tasks as complete/incomplete
- ✅ Update task details through conversation
- ✅ Delete tasks with natural language
- ✅ List and filter tasks intelligently
- ✅ Task persistence with constitution-compliant schema

### UI/UX
- ✅ Modern Figma-based design system
- ✅ Gradient backgrounds and card-based layouts
- ✅ Responsive design (mobile-first)
- ✅ Real-time message updates
- ✅ Loading states and typing indicators
- ✅ Error handling with user-friendly messages
- ✅ Conversation list sidebar
- ✅ Settings and calendar pages

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14+ (React 18)
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Language:** TypeScript

### Backend
- **Framework:** FastAPI
- **ORM:** SQLModel
- **Database:** PostgreSQL (Neon)
- **Authentication:** JWT (python-jose)
- **AI Integration:** OpenAI Agents SDK (GPT-4)
- **Tool Protocol:** Model Context Protocol (MCP)
- **Language:** Python 3.11+

### Database
- **Provider:** Neon (PostgreSQL)
- **Tables:** users, tasks
- **Features:** UUID primary keys, timestamps, foreign keys

## 📁 Project Structure

```
from-phase-2/
├── .agents/              # AI agent configurations
├── .claude/              # Claude Code settings
├── .qwen/                # Qwen AI configurations
├── .spec-kit/            # Spec-Kit configurations
├── backend/              # FastAPI backend
│   ├── migrations/       # Database migrations
│   ├── src/
│   │   ├── api/          # API endpoints (auth, tasks)
│   │   ├── models/       # SQLModel definitions
│   │   ├── middleware/   # Auth middleware
│   │   └── main.py       # FastAPI app
│   ├── requirements.txt
│   └── .env              # Database connection (not in git)
├── frontend/             # Next.js frontend
│   ├── src/
│   │   ├── app/          # Pages (dashboard, login, register)
│   │   ├── components/   # React components (tasks)
│   │   └── lib/          # API client, types
│   ├── package.json
│   └── .env.local        # Backend URL (not in git)
├── specs/                # Specifications
│   ├── features/         # Feature specs
│   ├── api/              # API specs
│   ├── database/         # Database specs
│   └── ui/               # UI specs
├── history/              # Project history
├── plans/                # Planning documents
├── tasks/                # Task tracking
└── README.md             # This file
```

## 🔧 Configuration

### Backend Environment (.env)

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters
```

### Frontend Environment (.env.local)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## 🗄️ Database Schema

### Users Table
- `id` (UUID, primary key)
- `email` (string, unique)
- `first_name` (string, nullable)
- `last_name` (string, nullable)
- `password_hash` (string)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Tasks Table
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users.id)
- `title` (string, max 255)
- `description` (text, nullable)
- `completed` (boolean, default false)
- `priority` (string: low/medium/high)
- `due_date` (datetime, nullable)
- `category` (string, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-12T12:00:00",
  "database": "connected"
}
```

### Test Registration
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Full UI Test Flow
1. Open http://localhost:3000
2. Click "Get Started"
3. Register with email/password
4. Create a new task
5. Test complete/edit/delete
6. Test filters
7. Logout and login again

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## 🔐 Security

- Passwords are hashed using SHA-256
- JWT tokens for authentication
- CORS configured for localhost:3000
- Database connections use SSL
- Environment variables for sensitive data
- SQL injection protection via SQLModel

## 🐛 Troubleshooting

### Backend won't start
- Check Python version: `python --version` (should be 3.11+)
- Verify DATABASE_URL in .env
- Install dependencies: `pip install -r requirements.txt`

### Frontend won't start
- Check Node version: `node --version` (should be 18+)
- Install dependencies: `npm install`
- Verify NEXT_PUBLIC_BACKEND_URL in .env.local

### Database connection errors
- Verify DATABASE_URL format
- Check Neon project is active
- Test connection: `psql "your-database-url"`

### 401 Unauthorized errors
- Clear browser localStorage
- Re-register/login
- Check JWT token in browser DevTools → Application → Local Storage

### Tasks not loading
- Check backend is running on port 8000
- Check browser console for errors
- Verify auth token exists in localStorage

## 🚢 Deployment

**Quick Deploy**: See `DEPLOYMENT_CHECKLIST.md` for step-by-step guide (5-10 minutes)

### Current Deployment Status

✅ **Backend**: Deployed at https://sheeba0321-hackathon-2-phase-2.hf.space (Hugging Face Spaces)
⏳ **Frontend**: Ready to deploy to Vercel
✅ **Database**: Neon PostgreSQL (serverless)

### Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com/new
2. Import: `SheebaZaim/Hackathon-2-phase-2`
3. Configure:
   - Root Directory: `frontend` ⚠️ **CRITICAL**
   - Environment Variable: `NEXT_PUBLIC_BACKEND_URL=https://sheeba0321-hackathon-2-phase-2.hf.space`
4. Deploy

**Detailed Guides**:
- Quick Reference: `DEPLOYMENT_CHECKLIST.md`
- Full Guide: `VERCEL_DEPLOYMENT_GUIDE.md`
- Verification: `./verify-deployment.sh`
- Backend Fix: `backend/DEPLOYMENT_FIX.md`

### Backend (Already Deployed)
- Platform: Hugging Face Spaces
- URL: https://sheeba0321-hackathon-2-phase-2.hf.space
- Port: 7860
- Configuration: See `backend/DEPLOYMENT_FIX.md`

### Database (Already Deployed)
- Provider: Neon PostgreSQL
- Type: Serverless (auto-scales)
- Connection: SSL required

## 📖 Documentation

- **Specifications:** `/specs` - Feature and API specifications
- **Status Files:** Root directory - CURRENT_STATUS.md, FIXES_APPLIED.md, etc.
- **Plans:** `/plans` - Implementation plans
- **History:** `/history` - Project development history

## 🤝 Contributing

1. Read specifications in `/specs`
2. Check current status in status files
3. Follow existing code structure
4. Test before committing
5. Update relevant documentation

## 📄 License

MIT License - See LICENSE file for details

## 👥 Authors

- Your Name/Team

## 🙏 Acknowledgments

- Built with Next.js, FastAPI, and Neon
- Spec-driven development using GitHub Spec-Kit
- AI-assisted development with Claude Code

---

**Need help?** Check status files in root directory or specifications in `/specs`

**Quick Commands:**
```bash
# Start backend

cd backend && python -m uvicorn src.main:app --reload

# Start frontend twice
cd frontend && npm run dev

# Run migrations
cd backend/migrations && python run_migration.py <migration-file.sql>
```
