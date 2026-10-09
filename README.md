# Scheme Saathi

A full-stack web platform that helps Indian citizens discover government schemes they are eligible for, track their applications, keep their documents in one place, and avoid scams.

---

## Features

- **Authentication**: JWT-based signup/login with `user` and `admin` roles
- **Profile and eligibility matching**: users enter date of birth, income, state, occupation, category and disability status. The platform matches them against each scheme's eligibility rules.
- **AI-assisted profile fill**: users describe themselves in free text and Gemini extracts the structured fields. The user reviews and edits before saving.
- **Scheme discovery**: search and filter by state, occupation and category
- **Scheme details**: overview, benefits, eligibility criteria, required documents, application process, important info and an official application link
- **Application tracking**: save schemes and move them through `Saved → Applied → Under Review → Approved / Rejected`
- **Reminders**: set a reminder date per application. A daily cron job sends an email via Brevo.
- **Document vault**: upload each document type once (Cloudinary). The scheme page shows a checklist of which required documents are uploaded and which are missing.
- **Scam reporting and verified badges**: users report suspicious schemes, and admins review reports and mark legitimate schemes as verified
- **Admin panel**: scheme CRUD, verified toggle, report moderation
- **Admin analytics**: user, scheme, profile and document counts, applications and reports by status, and the most-saved schemes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, lucide-react |
| Backend | Node.js, Express (ES modules) |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcrypt |
| File storage | Cloudinary (Multer + multer-storage-cloudinary) |
| AI extraction | Google Gemini API (`@google/generative-ai`) |
| Email | Brevo (`@getbrevo/brevo`) |
| Scheduling | node-cron |

---

## Architecture

```
┌──────────────────────┐        HTTPS / JSON        ┌───────────────────────────┐
│  React frontend      │ ─────────────────────────▶ │  Express API              │
│  (Vite, port 5173)   │ ◀───────────────────────── │  (port 5000)              │
│  AuthContext (JWT)   │                            │  routes → controllers     │
└──────────────────────┘                            │  middleware: protect,     │
                                                    │  isAdmin                  │
                                                    └─────┬──────┬──────┬──────┘
                                                          │      │      │
                                         ┌────────────────┘      │      └─────────────────┐
                                         ▼                       ▼                        ▼
                                 ┌───────────────┐      ┌────────────────┐      ┌───────────────────┐
                                 │ MongoDB Atlas │      │  Cloudinary    │      │ Gemini API        │
                                 │ (Mongoose)    │      │  (documents)   │      │ (profile extract) │
                                 └───────────────┘      └────────────────┘      └───────────────────┘
                                         ▲
                                         │ daily 8:00 AM
                                 ┌───────┴───────┐        ┌───────────────┐
                                 │ node-cron job │ ─────▶ │ Brevo (email) │
                                 └───────────────┘        └───────────────┘
```

### Request flow (typical authenticated call)

1. The frontend reads the JWT from `AuthContext` (persisted in `localStorage`) and sends `Authorization: Bearer <token>`.
2. The `protect` middleware verifies the token and sets `req.user`.
3. Admin-only routes additionally pass through `isAdmin`.
4. The controller reads or writes MongoDB and returns JSON.

### Data model

| Model | Key fields |
|---|---|
| `User` | name, email (unique), password (hashed), role |
| `Profile` | userId (unique), dateOfBirth, income, state, occupation, category, disabilityStatus |
| `Scheme` | schemeName, description, provider, eligibility fields, documentsRequired, benefits, applicationUrl, applicationProcess, importantInfo, verified |
| `Application` | userId, schemeId, status, reminderDate, reminderSentAt, notes. Unique on (userId, schemeId). |
| `Document` | userId, docType, fileUrl, publicId. Unique on (userId, docType). |
| `Report` | userId, schemeId, reason, details, status. Unique on (userId, schemeId). |

Uniqueness is enforced with compound indexes at the database level. Duplicate attempts return HTTP 409.

### Project structure

```
Scheme_Saathi/
├── backend/
│   ├── config/         config.js (env loading), cloudinary.js, db.js
│   ├── controllers/    auth, scheme, profile, application, document, report, analytics
│   ├── cron/           reminderCron.js
│   ├── middlewares/    authMiddleware.js (protect), adminMiddleware.js (isAdmin)
│   ├── models/         User, Profile, Scheme, Application, Document, Report
│   ├── routes/         one file per resource
│   ├── utils/          email.js (Brevo)
│   └── index.js
└── frontend/
    └── src/
        ├── api/        fetch wrappers per resource
        ├── components/ Navbar, ProtectedRoute
        ├── context/    AuthContext
        └── pages/      Landing, Login, Signup, Dashboard, Discovery, SchemeDetails,
                        Profile, Documents, AdminPanel, Analytics
```

---

## API Reference

All routes are prefixed with `/api`. 🔒 = requires login, 👑 = requires admin.

**Auth** (`/auth`)
- `POST /auth/login` returns a JWT

**Schemes** (`/schemes`)
- `GET /schemes` list all
- `GET /schemes/eligible` 🔒 schemes matching the logged-in user's profile
- `GET /schemes/:id` single scheme
- `POST /schemes` 👑 create
- `PATCH /schemes/:id` 👑 update (including `verified`)
- `DELETE /schemes/:id` 👑 delete

**Profile** (`/profile`)
- `GET /profile/me` 🔒
- `PUT /profile/me` 🔒 create or update
- `POST /profile/extract` 🔒 extract profile fields from free text (Gemini)

**Applications** (`/applications`)
- `POST /applications` 🔒 save a scheme (409 if already saved)
- `GET /applications/me` 🔒
- `PATCH /applications/:id` 🔒 owner only: status, reminderDate, notes
- `DELETE /applications/:id` 🔒 owner only
- `POST /applications/trigger-reminders` 👑 run the reminder check manually

**Documents** (`/documents`)
- `POST /documents` 🔒 multipart: `docType` and file field `document`. Re-uploading the same docType replaces the old file.
- `GET /documents/me` 🔒
- `DELETE /documents/:id` 🔒 owner only

**Reports** (`/reports`)
- `POST /reports` 🔒 (409 if already reported)
- `GET /reports` 👑
- `PATCH /reports/:id` 👑 set status: Pending / Reviewed / Dismissed

**Analytics** (`/analytics`)
- `GET /analytics` 👑

---

## Local Setup

### Prerequisites
- Node.js 20+
- A MongoDB Atlas cluster
- Free accounts: Cloudinary, Google AI Studio (Gemini), Brevo

### 1. Clone and install
```bash
git clone <your-repo-url>
cd Scheme_Saathi

cd backend && npm install
cd ../frontend && npm install
```

### 2. Backend environment variables
Create `backend/.env`:
```
PORT=5000
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a long random string>

CLOUDINARY_CLOUD_NAME=<from Cloudinary dashboard>
CLOUDINARY_API_KEY=<from Cloudinary dashboard>
CLOUDINARY_API_SECRET=<from Cloudinary dashboard>

GEMINI_API_KEY=<from Google AI Studio>

BREVO_API_KEY=<from Brevo → SMTP & API → API Keys & MCP>
BREVO_SENDER_EMAIL=<the email you signed up to Brevo with>
```

Never commit `.env`. Confirm it is listed in `.gitignore`.

### 3. Run
```bash
# terminal 1
cd backend && npm run dev     # http://localhost:5000

# terminal 2
cd frontend && npm run dev    # http://localhost:5173
```

### 4. Create an admin user
Sign up through the UI, then set `role: "admin"` on that user document in MongoDB Atlas. Log out and back in so the new JWT carries the admin role.

---

## Operational Notes

- **Cloudinary**: PDF and ZIP delivery is restricted by default on new accounts. Enable it under *Settings → Security*, otherwise uploaded PDFs will not open.
- **Gemini model names change**: if extraction fails with a "model not found" error, update the model string in `profileController.js`.
- **Reminder cron**: runs daily at 8:00 AM server time. `reminderSentAt` prevents duplicate sends and is reset when a reminder date changes. A failed email is retried on the next run.
- **Brevo free tier**: 300 emails/day. API keys auto-expire after 90 days of inactivity.

---

## Known Limitations

- Document checklist matching uses case-insensitive exact text, so "Aadhaar Card" and "Aadhar Card" will not match. A fixed list of document types would fix this.
- Date of birth from AI extraction is approximated as Jan 1 of the birth year and must be verified by the user.
- The `/admin` and `/admin/analytics` routes are protected on the backend by `isAdmin`, but the frontend `ProtectedRoute` only checks that the user is logged in, not their role.
- Gemini's free tier may use inputs to improve Google's models. Use a paid tier before handling real users' personal data.
- Scheme data is entered manually by admins. There is no automated import.

---

## Roadmap

- Deployment (Render for the API, Vercel for the frontend)
- Toast notifications to replace inline status messages
- Role-aware frontend route guard
- Standardised document types (dropdown instead of free text)