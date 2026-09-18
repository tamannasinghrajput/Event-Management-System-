# SRM Events 2K26 🎓

A modern, full-stack event management platform for SRM University featuring event listings, club directories, hackathon registrations, and user authentication.

![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)

## ✨ Features

- 🎪 **Event Management** - Browse technical, cultural, and sports events
- 🏆 **Hackathons** - Featured hackathons with registration
- 👥 **Clubs Directory** - 22+ student organizations
- 🔐 **User Authentication** - JWT-based login and registration
- 📝 **Event Registration** - Register for events with confirmation
- 📱 **Responsive Design** - Mobile-first, modern UI
- 🌙 **Dark Theme** - Beautiful dark mode with animations

## 🚀 Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (Build tool)
- TailwindCSS (Styling)
- Radix UI / shadcn (Components)
- React Router DOM (Routing)

### Backend
- Node.js + Express
- JWT Authentication
- bcryptjs (Password hashing)
- JSON file storage

## 📁 Project Structure

```
srm-events-2k26/
├── frontend/                      # React + Vite frontend
│   ├── index.html                 # HTML entry point
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── tsconfig.json              # TypeScript config
│   ├── components.json            # shadcn/ui config
│   ├── public/
│   │   └── assets/
│   │       └── images/            # Static images
│   └── src/
│       ├── App.tsx                # Main app with routing
│       ├── main.tsx               # Entry point
│       ├── components/
│       │   ├── layout/            # Layout components (Navbar)
│       │   ├── forms/             # Form components (RegistrationForm)
│       │   └── ui/                # shadcn UI primitives
│       ├── contexts/              # React contexts (Auth)
│       ├── data/                  # Static data (events)
│       ├── hooks/                 # Custom hooks
│       ├── lib/                   # Utilities
│       ├── pages/                 # Route pages (Login)
│       ├── sections/              # Page sections (Hero, Events, etc.)
│       ├── services/              # API service layer
│       └── types/                 # TypeScript type definitions
│
├── backend/                       # Express.js backend
│   ├── package.json               # Backend dependencies
│   ├── .env.example               # Environment variables template
│   └── src/
│       ├── server.js              # Express server entry point
│       ├── routes/                # API route handlers
│       │   ├── auth.js            # Authentication routes
│       │   ├── clubs.js           # Clubs routes
│       │   ├── events.js          # Events routes
│       │   └── registrations.js   # Registration routes
│       └── data/                  # JSON file storage
│           ├── users.json         # User data
│           └── registrations.json # Registration data
│
├── .gitignore
├── package.json                   # Root scripts for convenience
└── README.md
```

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Clone and Setup

```bash
git clone https://github.com/Harsh010801/srm-events-2k26.git
cd srm-events-2k26
```

### Install All Dependencies (from root)

```bash
npm run install:all
```

Or install individually:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

## 🏃 Running the Project

### From Root (Convenience Scripts)

```bash
# Start backend server
npm run dev:backend

# Start frontend dev server (in a new terminal)
npm run dev:frontend
```

### Or Directly

```bash
# Backend (Terminal 1)
cd backend
npm run dev
```
Backend runs at `http://localhost:5000`

```bash
# Frontend (Terminal 2)
cd frontend
npm run dev
```
Frontend runs at `http://localhost:5173`

## 🔑 Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| student@srmist.edu.in | student123 | Student |
| admin@srmist.edu.in | admin123 | Admin |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get event by ID |
| GET | `/api/clubs` | Get all clubs |
| POST | `/api/registrations` | Event registration |
| GET | `/api/registrations` | Get registrations |

## 🛠️ Build for Production

```bash
# From root
npm run build

# Or from frontend directory
cd frontend
npm run build
```

## 📄 License

MIT License

## 👨‍💻 Author

**Harsh Yadav**
- SRM University
- [GitHub](https://github.com/Harsh010801)
