# 🎓 SRM Events 2K26 — University Event Management Platform

> **A full-stack, production-ready event management system built for SRM Institute of Science and Technology, designed to digitize the entire lifecycle of campus events — from discovery to registration to administration.**

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Problem Statement](#-problem-statement)
3. [Solution & Key Features](#-solution--key-features)
4. [System Architecture](#-system-architecture)
5. [Technology Stack](#-technology-stack)
6. [Frontend Architecture](#-frontend-architecture)
7. [Backend Architecture](#-backend-architecture)
8. [Authentication & Security](#-authentication--security)
9. [API Reference](#-api-reference)
10. [Design System](#-design-system)
11. [Project Structure](#-project-structure)
12. [How to Run](#-how-to-run)
13. [Team & Credits](#-team--credits)

---

## 🎯 Project Overview

**SRM Events 2K26** is a modern, full-stack web application purpose-built for managing student events at SRM University. The platform serves three distinct user personas:

| Persona | Capabilities |
|---------|-------------|
| **Visitor** | Browse events, explore clubs, view event details |
| **Student** | Register for events, track registrations, manage profile |
| **Admin** | Create/edit/delete events, view all registrations, manage users |

The application features a stunning, responsive UI with both Light and Dark mode support, real-time registration counters, an intelligent filtering engine, and a secure RESTful backend API.

---

## 🔍 Problem Statement

University campuses like SRM host **hundreds of events** every semester across technical, cultural, sports, and professional categories. The current process suffers from:

- **Fragmented Communication** — Event info scattered across WhatsApp groups, notice boards, and emails
- **Manual Registration** — Paper forms and Google Forms with no centralized tracking
- **No Visibility** — Students miss events because they don't know what's happening
- **Administrative Overhead** — Organizers manually track participants in spreadsheets
- **Zero Analytics** — No data-driven insights on event participation or trends

---

## 💡 Solution & Key Features

### For Students
- 🔎 **Smart Discovery** — Browse, search, and filter events by category, club, date, and status
- 📝 **One-Click Registration** — Register for any event directly from the platform
- 📊 **Dashboard** — Personal dashboard to track all registered events
- 🌓 **Theme Toggle** — Switch between Light and Dark modes for comfortable viewing

### For Administrators
- ➕ **Event CRUD** — Create, read, update, and delete events from an admin panel
- 👥 **Registration Management** — View all registrations across all events
- 📈 **Real-Time Counters** — Live seat availability and registration counts
- 🔒 **Role-Based Access** — Admin-only endpoints protected by JWT middleware

### For Everyone
- 🏫 **25+ Clubs** — Complete directory of all SRM student organizations
- 🎨 **Premium UI/UX** — Modern Bento Grid layouts, smooth animations, glassmorphism effects
- 📱 **Fully Responsive** — Optimized for desktop, tablet, and mobile devices
- ⚡ **Fast Performance** — Vite-powered build with optimized bundle splitting

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              React 19 + TypeScript                │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌───────────┐ │   │
│  │  │  Hero  │ │ Events │ │ Clubs  │ │ Dashboard │ │   │
│  │  └────────┘ └────────┘ └────────┘ └───────────┘ │   │
│  │  ┌─────────────────────────────────────────────┐ │   │
│  │  │  Context API (Auth + Theme State Mgmt)      │ │   │
│  │  └─────────────────────────────────────────────┘ │   │
│  │  ┌─────────────────────────────────────────────┐ │   │
│  │  │  API Service Layer (fetch wrapper)          │ │   │
│  │  └──────────────────┬──────────────────────────┘ │   │
│  └─────────────────────┼────────────────────────────┘   │
│                        │ HTTP (REST)                      │
└────────────────────────┼─────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 SERVER (Node.js + Express)                │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Express.js REST API                 │    │
│  │  ┌──────┐ ┌───────┐ ┌──────┐ ┌──────────────┐  │    │
│  │  │ Auth │ │Events │ │Clubs │ │Registrations │  │    │
│  │  └──┬───┘ └───┬───┘ └──┬───┘ └──────┬───────┘  │    │
│  │     │         │        │             │          │    │
│  │  ┌──┴─────────┴────────┴─────────────┴───────┐  │    │
│  │  │     Middleware (CORS, Auth, Admin Guard)   │  │    │
│  │  └────────────────────┬──────────────────────┘  │    │
│  └───────────────────────┼──────────────────────────┘    │
│                          │                               │
│  ┌───────────────────────┼──────────────────────────┐    │
│  │               JSON File Storage                   │    │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────────┐   │    │
│  │  │users.json│ │events.json│ │registrations.json│   │    │
│  │  └──────────┘ └──────────┘ └────────────────┘   │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Action** → React component dispatches an action (e.g., click "Register")
2. **API Service** → The centralized `api.ts` service sends an HTTP request to the Express server
3. **Middleware** → Express validates CORS, parses JSON body, and authenticates JWT tokens
4. **Route Handler** → The appropriate route processes the request and interacts with JSON data files
5. **Response** → Server sends JSON response back to the client
6. **State Update** → React state (Context API) is updated, triggering a UI re-render

---

## 🛠 Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.0 | Core UI library with hooks-based architecture |
| **TypeScript** | 5.9.3 | Static typing for reliability and developer experience |
| **Vite** | 7.2.4 | Lightning-fast build tool with Hot Module Replacement (HMR) |
| **Tailwind CSS** | 3.4.19 | Utility-first CSS framework for rapid styling |
| **React Router DOM** | 7.13.0 | Client-side routing with protected routes |
| **Radix UI** | Latest | Accessible, unstyled headless UI primitives |
| **Shadcn/ui** | Custom | Beautifully designed component library built on Radix |
| **Lucide React** | 0.562.0 | Modern, consistent icon library (500+ icons) |
| **Recharts** | 2.15.4 | Composable charting library for admin dashboards |
| **React Hook Form** | 7.70.0 | Performant form management with validation |
| **Zod** | 4.3.5 | TypeScript-first schema validation |
| **Sonner** | 2.0.7 | Elegant toast notification system |
| **date-fns** | 4.1.0 | Modern date utility library |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | Server-side JavaScript runtime |
| **Express.js** | 4.18.2 | Minimal, fast web framework for REST APIs |
| **bcryptjs** | 2.4.3 | Password hashing with salt rounds |
| **jsonwebtoken** | 9.0.2 | JWT-based authentication tokens |
| **uuid** | 9.0.0 | Universally unique identifier generation |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing middleware |

### Dev Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code quality and linting |
| **PostCSS + Autoprefixer** | CSS processing and cross-browser compatibility |
| **tailwindcss-animate** | Animation utility classes |
| **Git + GitHub** | Version control and collaboration |

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
App.tsx
├── ThemeProvider (Light/Dark mode context)
│   └── AuthProvider (User session context)
│       └── BrowserRouter
│           ├── Landing Page (/)
│           │   ├── Navbar
│           │   ├── Hero Section
│           │   ├── Events Section
│           │   ├── Hackathons Section
│           │   ├── Clubs Section
│           │   ├── Registration CTA
│           │   └── Footer
│           ├── Login (/login)
│           ├── Register (/register)
│           ├── Student Dashboard (/dashboard)
│           └── Admin Dashboard (/admin)
```

### Key Design Patterns

#### 1. Context API for Global State
Two React contexts power the application's global state:

- **`AuthContext`** — Manages user authentication state, login/logout actions, and JWT token persistence in `localStorage`.
- **`ThemeContext`** — Manages light/dark theme toggle with `data-theme` attribute on the root `<html>` element, persisted in `localStorage`.

#### 2. Service Layer Pattern
All backend communication is centralized in `frontend/src/services/api.ts`, which provides:
- `authApi` — Login, register, get current user
- `eventsApi` — Fetch events with filters
- `clubsApi` — Fetch clubs by category
- `registrationsApi` — Register, view, cancel registrations
- `adminApi` — CRUD operations for events, view all registrations/users

#### 3. Section-Based Architecture
The landing page is composed of self-contained section components, each managing its own state, animations, and data:
- `Hero.tsx` — Animated hero with marquee, statistics, and call-to-action
- `Events.tsx` — Full event discovery engine with multi-filter search
- `Hackathons.tsx` — Dedicated hackathon showcase with timeline
- `Clubs.tsx` — Bento Grid layout with 25+ student organizations
- `RegistrationCTA.tsx` — Quick registration with spinning badge animation
- `Footer.tsx` — Links, social media, and campus information

#### 4. Scroll-Based Animations
Each section uses `IntersectionObserver` to trigger CSS `scroll-animate` classes, creating smooth fade-in and slide-up effects as the user scrolls through the page.

---

## ⚙ Backend Architecture

### Server Configuration
The Express server runs on **port 5000** with the following middleware stack:

```
Request → CORS → JSON Parser → Route Handler → Error Handler → Response
```

### Route Modules

#### `/api/auth` — Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Create new student account |
| `POST` | `/login` | ❌ | Authenticate and receive JWT |
| `GET` | `/me` | ✅ | Get current user profile |
| `GET` | `/users` | 🔒 Admin | List all registered users |

#### `/api/events` — Event Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ❌ | List all events (with optional filters) |
| `GET` | `/:id` | ❌ | Get single event details |
| `POST` | `/` | 🔒 Admin | Create a new event |
| `PUT` | `/:id` | 🔒 Admin | Update an existing event |
| `DELETE` | `/:id` | 🔒 Admin | Delete an event |

#### `/api/clubs` — Club Directory
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ❌ | List all clubs (with optional category filter) |

#### `/api/registrations` — Event Registration
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ❌ | Register for an event |
| `GET` | `/` | ❌ | Get registrations (filterable by email/regNumber) |
| `GET` | `/my-registrations` | ✅ | Get authenticated user's registrations |
| `GET` | `/all` | 🔒 Admin | Get all registrations across all events |
| `DELETE` | `/:id` | ✅ | Cancel a registration (owner or admin) |

### Data Persistence
The backend uses **file-based JSON storage** for simplicity and portability:

| File | Purpose |
|------|---------|
| `users.json` | User accounts with hashed passwords |
| `events.json` | Event listings with metadata |
| `registrations.json` | Event registration records |

> 💡 This design choice makes the project easy to set up without any database installation. For production, this can be swapped with MongoDB or PostgreSQL.

---

## 🔐 Authentication & Security

### Authentication Flow

```
1. User submits credentials (email + password)
        │
        ▼
2. Server validates credentials
   - Finds user by email in users.json
   - Compares bcrypt-hashed password
        │
        ▼
3. Server generates JWT token
   - Payload: { id, email }
   - Expiry: 7 days
   - Signed with secret key
        │
        ▼
4. Client stores token in localStorage
   - Key: 'srm_token'
        │
        ▼
5. Subsequent requests include:
   Authorization: Bearer <token>
        │
        ▼
6. Server middleware validates token
   on every protected route
```

### Security Measures
- **Password Hashing** — All passwords are hashed using `bcryptjs` with 10 salt rounds before storage
- **JWT Authentication** — Stateless token-based auth with 7-day expiration
- **Role-Based Access Control (RBAC)** — Admin middleware guards sensitive endpoints
- **CORS Protection** — Only whitelisted origins (`localhost:5173`, `localhost:3000`) can access the API
- **Input Validation** — Required field checks on all POST/PUT endpoints
- **Duplicate Prevention** — Registration uniqueness enforced by email and registration number

---

## 📡 API Reference

### Sample Request: Register for an Event

**Request:**
```http
POST /api/registrations
Content-Type: application/json

{
  "name": "Harsh Yadav",
  "email": "harsh@srmist.edu.in",
  "phone": "9876543210",
  "regNumber": "RA2211003010001",
  "department": "Computer Science",
  "year": "3rd Year",
  "eventId": "fest-2",
  "eventTitle": "Hack Horizons 2026"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "registration": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Harsh Yadav",
    "email": "harsh@srmist.edu.in",
    "eventId": "fest-2",
    "eventTitle": "Hack Horizons 2026",
    "status": "confirmed",
    "registeredAt": "2026-04-26T12:00:00.000Z"
  }
}
```

### Sample Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@srmist.edu.in",
  "password": "admin123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "name": "Admin",
    "email": "admin@srmist.edu.in",
    "role": "admin",
    "regNumber": "ADMIN001"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 🎨 Design System

### Color Palette

#### Light Mode
| Token | Hex | Usage |
|-------|-----|-------|
| Cream | `#F5F0EB` | Primary background |
| Lime | `#CDFF00` | Accent, buttons, highlights |
| Dark | `#1A1A1A` | Text, card backgrounds |
| White | `#FFFFFF` | Card surfaces |

#### Dark Mode
| Token | Hex | Usage |
|-------|-----|-------|
| Black | `#0A0A0A` | Primary background |
| Blue | `#2B71F8` | Accent, borders, gradients |
| Neon Lime | `#CDFF00` | Headings, badges (high-contrast accents) |
| White | `#FFFFFF` | Primary text |

### Typography
- **Headlines** — Serif font family (`font-serif`), bold weight
- **Body** — System sans-serif stack via Tailwind defaults
- **Gradient Text** — CSS `background-clip: text` with dynamic color shifts per theme

### Key UI Components (53 Shadcn/ui components)
The project includes a comprehensive component library from Shadcn/ui:

| Component | Use Case |
|-----------|----------|
| `Button` | Actions, CTAs, form submissions |
| `Dialog` | Event details modal, registration form |
| `Select` | Category, club, and date filters |
| `Badge` | Tags, categories, status indicators |
| `Card` | Event cards, dashboard stats |
| `Input` | Search bars, form fields |
| `Table` | Admin registration data |
| `Tabs` | Dashboard navigation |
| `Tooltip` | Contextual help |
| `Accordion` | FAQ sections |
| `Calendar` | Date picker for events |

### Animation System
- **Scroll Animations** — `IntersectionObserver`-driven fade-in effects
- **Hover Effects** — Scale transforms, shadow reveals, color transitions
- **Loading States** — Skeleton screens and spinners
- **Theme Transition** — Smooth CSS variable interpolation on theme toggle
- **Spinning Badge** — SVG text path rotation animation in Registration CTA

---

## 📁 Project Structure

```
SRM-EVENT-MANAGEMENT/
│
├── 📦 package.json                    # Root workspace scripts
│
├── 🖥 frontend/                       # React + TypeScript client
│   ├── public/
│   │   └── assets/images/             # 15 AI-generated event images
│   ├── src/
│   │   ├── App.tsx                    # Root component with routing
│   │   ├── main.tsx                   # Entry point (React DOM render)
│   │   ├── index.css                  # Global styles + theme overrides
│   │   ├── components/
│   │   │   ├── ui/                    # 53 Shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   └── ... (50 more)
│   │   │   ├── forms/
│   │   │   │   └── RegistrationForm.tsx
│   │   │   └── layout/
│   │   │       └── Navbar.tsx         # Nav with theme toggle
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx         # Authentication state
│   │   │   └── ThemeContext.tsx        # Light/Dark mode state
│   │   ├── data/
│   │   │   └── events.ts             # Static event & club data
│   │   ├── hooks/
│   │   │   └── use-mobile.ts          # Mobile breakpoint hook
│   │   ├── pages/
│   │   │   ├── Login.tsx              # Student/Admin login
│   │   │   ├── Register.tsx           # Account registration
│   │   │   ├── StudentDashboard.tsx   # Student portal
│   │   │   └── AdminDashboard.tsx     # Admin control panel
│   │   ├── sections/
│   │   │   ├── Hero.tsx               # Landing hero section
│   │   │   ├── Events.tsx             # Event discovery engine
│   │   │   ├── Hackathons.tsx         # Hackathon showcase
│   │   │   ├── Clubs.tsx              # Bento Grid club directory
│   │   │   ├── RegistrationCTA.tsx    # Quick registration CTA
│   │   │   └── Footer.tsx             # Site footer
│   │   ├── services/
│   │   │   └── api.ts                 # Centralized API service layer
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript interfaces
│   │   └── lib/
│   │       └── utils.ts               # Utility functions (cn, etc.)
│   ├── tailwind.config.js             # Tailwind + design tokens
│   ├── tsconfig.json                  # TypeScript configuration
│   └── vite.config.ts                 # Vite build configuration
│
├── ⚙ backend/                        # Node.js + Express server
│   └── src/
│       ├── server.js                  # Express app entry point
│       ├── routes/
│       │   ├── auth.js                # Authentication endpoints
│       │   ├── events.js              # Event CRUD endpoints
│       │   ├── clubs.js               # Club directory endpoint
│       │   └── registrations.js       # Registration endpoints
│       └── data/
│           ├── users.json             # User accounts (hashed passwords)
│           ├── events.json            # Event data store
│           └── registrations.json     # Registration records
│
└── 📄 README.md                       # Project documentation
```

---

## 🚀 How to Run

### Prerequisites
- **Node.js** 18 or higher
- **npm** (comes with Node.js)
- **Git**

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Harsh010801/SRM-EVENT-MANAGEMENT-.git
cd SRM-EVENT-MANAGEMENT-

# 2. Install all dependencies
cd frontend && npm install
cd ../backend && npm install
cd ..

# 3. Start the backend server (Port 5000)
cd backend && npm run dev

# 4. In a new terminal, start the frontend (Port 5173)
cd frontend && npm run dev
```

### Access the Application
| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Frontend (React App) |
| `http://localhost:5000` | Backend API |
| `http://localhost:5000/api/health` | API Health Check |

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Student** | `student@srmist.edu.in` | `student123` |
| **Admin** | `admin@srmist.edu.in` | `admin123` |

---

## 🧑‍💻 Team & Credits

| Name | Role | Registration Number |
|------|------|---------------------|
| **Harsh Yadav** | Full-Stack Developer & Project Lead | RA2211003010001 |

### Course Information
- **Subject:** Software Engineering & Project Management (SEPM)
- **Institution:** SRM Institute of Science and Technology, Kattankulathur
- **Academic Year:** 2025–2026

---

## 📊 Project Metrics

| Metric | Value |
|--------|-------|
| **Total Files** | 70+ |
| **Frontend Components** | 53 UI + 6 Sections + 4 Pages |
| **Backend Endpoints** | 13 REST API routes |
| **Events Listed** | 15+ real SRM events |
| **Clubs Catalogued** | 25+ student organizations |
| **AI-Generated Images** | 15 context-specific assets |
| **Lines of Code** | 5,000+ |
| **Themes** | Light + Dark mode |

---

## 📜 License

This project is licensed under the **MIT License**. See `package.json` for details.

---

> Built with ❤️ for SRM University | Powered by React, Express, and modern web technologies
