# CareerAI 🤖
### AI-Powered Interview Preparation Platform

> Upload your resume, target a company, and get personalized ATS scoring, weakness analysis, and interview questions — powered by a multi-agent AI architecture.

**Live Demo:** [your-netlify-url.netlify.app](https://your-netlify-url.netlify.app)

---

## 📸 What It Does

1. **Upload Resume** — PDF upload with automatic text extraction
2. **Target a Company** — specify Google, Microsoft, Amazon, or any company
3. **Add Job Description** *(optional)* — paste the actual JD for more targeted analysis
4. **Get AI Analysis** — 4 specialized AI agents analyze your resume in sequence:
   - 📄 Resume parsing and profile extraction
   - 📊 ATS scoring with matched/missing keywords
   - 🔍 Weakness analysis with actionable advice
   - ❓ Personalized interview questions targeting your weak areas
5. **Resume History** — access previous uploads and re-analyze without re-uploading
6. **Welcome Email** — automatic email notification on signup

---

## 🏗️ Architecture

### Multi-Agent AI System


User Request
↓
┌─────────────────────────────────────────┐
│ ORCHESTRATOR │
│ coordinates all agents │
└─────────────────────────────────────────┘
↓ ↓ ↓ ↓
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Agent 1 │ │ Agent 2 │ │ Agent 3 │ │ Agent 4 │
│ Resume │→ │ ATS │→ │Weakness │→ │Question │
│ Analyzer │ │ Scorer │ │ Analyzer │ │Generator │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
↓
Combined Result → Controller → Angular Frontend


Each agent receives the previous agent's output as context — producing increasingly targeted and accurate results.

### System Architecture

┌─────────────────────┐ HTTPS ┌─────────────────────┐
│ Angular Frontend │ ────────────→ │ Express.js Backend │
│ (Netlify) │ │ (Render) │
└─────────────────────┘ └──────────┬──────────┘
│
┌─────────────────────────┼──────────────────────┐
↓ ↓ ↓
┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐
│ MongoDB Atlas │ │ Groq AI API │ │ Resend Email │
│ (Database) │ │ (Llama3 Model) │ │ (Email) │
└─────────────────┘ └─────────────────┘ └────────────────┘


---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database + ODM |
| JWT (jsonwebtoken) | Stateless authentication |
| bcryptjs | Password hashing |
| multer | PDF file upload handling |
| pdf-parse | PDF text extraction |
| Groq SDK (Llama3) | AI model for analysis |
| Resend | Transactional email |
| express-validator | Input validation |

### Frontend
| Technology | Purpose |
|---|---|
| Angular 21 | SPA framework |
| TypeScript | Type safety |
| Angular Signals | Reactive state management |
| FormsModule | Template-driven forms |
| HttpClient | API communication |

### DevOps
| Technology | Purpose |
|---|---|
| Render | Backend hosting |
| Netlify | Frontend hosting |
| MongoDB Atlas | Cloud database |
| GitHub | Version control |

---

## 📁 Project Structure

CareerAI/
├── client/ # Angular Frontend
│ └── src/app/
│ ├── pages/
│ │ ├── dashboard/ # Main app screen
│ │ └── login/ # Auth screen
│ ├── services/
│ │ ├── api.ts # All HTTP calls
│ │ ├── auth-guard.ts # Route protection
│ │ └── theme.ts # Dark/light mode
│ └── components/ # Shared components
│
└── server/ # Node.js Backend
├── config/
│ ├── db.js # MongoDB connection
│ └── multer.js # File upload config
├── controllers/
│ ├── authController.js # HTTP layer for auth
│ ├── resumeController.js # HTTP layer for resume
│ └── analysisController.js # HTTP layer for AI analysis
├── middlewares/
│ ├── authMiddleware.js # JWT verification
│ └── validators.js # Input validation rules
├── models/
│ ├── User.js # User schema
│ └── Resume.js # Resume schema
├── routes/
│ ├── authRoutes.js # /api/auth/*
│ ├── resumeRoutes.js # /api/resume/*
│ └── analysisRoutes.js # /api/analysis/*
├── services/
│ ├── authService.js # Auth business logic
│ ├── emailService.js # Email sending
│ ├── aiService.js # AI service entry point
│ └── agents/
│ ├── orchestrator.js # Coordinates all agents
│ ├── resumeAnalyzerAgent.js
│ ├── atsScorerAgent.js
│ ├── weaknessAnalyzerAgent.js
│ └── questionGeneratorAgent.js
└── server.js # Entry point


---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/resume/upload` | Upload PDF resume | Yes |
| GET | `/api/resume` | Get all user resumes | Yes |
| POST | `/api/analysis/analyze` | AI analyze resume | Yes |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Groq API key (free)
- Resend API key (free)

### Backend Setup

```bash
git clone https://github.com/devraj62891/careerai.git
cd careerai/server
npm install
npm run dev
```

### Frontend Setup

```bash
cd careerai/client
npm install
ng serve
```

### Environment Variables

Create `server/.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/CareerAI
PORT=3000
JWT_SECRET=your-super-secret-key
GROQ_API_KEY=your-groq-api-key
RESEND_API_KEY=your-resend-api-key
```

---

## 🔒 Security Features

- Password hashing with bcrypt (cost factor 10)
- JWT authentication — stateless, expires in 1 day
- Input validation — email format, password strength
- Data ownership — all queries scoped by user ID
- File validation — MIME type checking, 5MB size limit
- Secrets in environment variables — never committed to Git

---

## 🧠 Key Technical Decisions

**Why multi-agent instead of one big prompt?**
Each specialized agent focuses deeply on one task. The question generator receives the full profile, ATS results, AND weakness analysis — producing targeted questions that address known gaps rather than generic ones.

**Why Groq instead of OpenAI?**
Groq's free tier provides sufficient capacity with no credit card required. The architecture is provider-agnostic — switching to Claude or GPT-4 requires changing only `aiService.js`.

**Why memory storage for PDF uploads?**
The PDF only needs to exist long enough for text extraction. Memory storage is faster and keeps the server stateless — no disk writes for data we immediately discard.

**Why JWT instead of sessions?**
JWT is stateless — no server-side storage required. Scales horizontally without sticky sessions.

---

## 📈 Planned Features

- [ ] Mock Interview Chat (with LangChain.js conversation memory)
- [ ] Dashboard analytics (ATS score history over time)
- [ ] Export analysis as PDF report

---

## 👨‍💻 Author

**Devraj Sharma** — Full Stack Developer | Cognizant
- GitHub: [@devraj62891](https://github.com/devraj62891)

---

## 📄 License

MIT License