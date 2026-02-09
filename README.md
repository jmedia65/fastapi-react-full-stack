# FastAPI + React + React Native: Full-Stack CRUD from Zero to Production

A hands-on tutorial that teaches you the **production-grade patterns** of building full-stack applications with FastAPI (Python), React (TypeScript), and React Native (Expo). Every file is heavily commented to explain not just _what_ the code does, but _why_ it's done that way.

**One API, Multiple Clients** — the same backend powers both web and mobile apps.

## What You'll Learn

- **Backend**: Build a REST API with FastAPI, Pydantic validation, and proper error handling
- **Web Frontend**: Create a React app with TypeScript, controlled components, and API integration
- **Mobile App**: Build a React Native app with Expo that consumes the same API
- **Full-Stack Patterns**: Connect frontend to backend with CORS, environment variables, and type safety
- **Production Practices**: Error handling, loading states, separation of concerns, and clean architecture
- **CRUD Operations**: Implement Create, Read, Update, Delete — the foundation of most apps

## Tech Stack

| Layer             | Technology                                                                  | Purpose                                                 |
| ----------------- | --------------------------------------------------------------------------- | ------------------------------------------------------- |
| Backend           | [FastAPI](https://fastapi.tiangolo.com/)                                    | Modern Python web framework with automatic OpenAPI docs |
| Validation        | [Pydantic](https://docs.pydantic.dev/)                                      | Data validation and serialization                       |
| Web Frontend      | [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Type-safe UI components                                 |
| Web Styling       | [React-Bootstrap](https://react-bootstrap.github.io/)                       | Pre-built Bootstrap 5 components                        |
| Web Build Tool    | [Vite](https://vitejs.dev/)                                                 | Fast frontend development server                        |
| Mobile App        | [Expo](https://expo.dev/) + [React Native](https://reactnative.dev/)        | Cross-platform mobile development                       |
| Mobile Navigation | [Expo Router](https://docs.expo.dev/router/introduction/)                   | File-based routing for React Native                     |
| Package Manager   | [uv](https://docs.astral.sh/uv/) (Python) / npm (Node)                      | Dependency management                                   |

## Prerequisites

Before you start, make sure you have these installed:

| Tool    | Version | Installation                                                                                                                                             |
| ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Python  | 3.11+   | [python.org](https://www.python.org/downloads/)                                                                                                          |
| uv      | Latest  | [docs.astral.sh/uv](https://docs.astral.sh/uv/getting-started/installation/)                                                                             |
| Node.js | 18+     | [nodejs.org](https://nodejs.org/)                                                                                                                        |
| npm     | 9+      | Comes with Node.js                                                                                                                                       |
| Expo Go | Latest  | [App Store](https://apps.apple.com/app/expo-go/id982107779) / [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (for mobile) |

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/learn-fastapi-react.git
cd learn-fastapi-react
```

### 2. Start the backend

```bash
cd backend
uv sync                      # Install Python dependencies
uv run fastapi dev main.py   # Start FastAPI dev server
```

The API will be running at **http://localhost:8000**  
Interactive docs at **http://localhost:8000/docs**

### 3. Start the web frontend (new terminal)

```bash
cd frontend
cp .env.example .env         # Create environment file
npm install                  # Install Node dependencies
npm run dev                  # Start Vite dev server
```

The web app will be running at **http://localhost:5173**

### 4. Start the mobile app (optional, new terminal)

Mobile devices can't access `localhost` — you need a tunnel or local IP.

**Option A: Using ngrok (works anywhere)**

```bash
# Terminal 1: Start ngrok tunnel
ngrok http 8000
# Copy the https URL (e.g., https://abc123.ngrok-free.app)
```

```bash
# Terminal 2: Start mobile app
cd mobile
cp .env.example .env
# Edit .env and set EXPO_PUBLIC_API_BASE_URL to your ngrok URL
npm install
npx expo start
```

**Option B: Using local IP (same WiFi only)**

```bash
cd mobile
cp .env.example .env
# Edit .env and set EXPO_PUBLIC_API_BASE_URL=http://YOUR_LOCAL_IP:8000
npm install
npx expo start
```

Scan the QR code with Expo Go app on your phone.

### 5. Try it out!

1. Open **http://localhost:5173** in your browser (web)
2. Scan QR code with Expo Go (mobile)
3. Create a user — it appears on BOTH web and mobile!
4. Check **http://localhost:8000/docs** to see the API documentation

## Project Structure

```
learn-fastapi-react/
├── backend/                    # FastAPI backend
│   ├── main.py                 # App entry point, CORS config
│   ├── models.py               # Pydantic models (data shapes)
│   ├── database.py             # Data storage layer
│   └── routers/
│       └── users.py            # CRUD endpoints
│
├── frontend/                   # React web frontend
│   ├── src/
│   │   ├── main.tsx            # React entry point
│   │   ├── App.tsx             # Main component (state + logic)
│   │   ├── types.ts            # TypeScript interfaces
│   │   ├── api/
│   │   │   └── users.ts        # API client functions
│   │   └── components/
│   │       ├── UserForm.tsx    # Form component
│   │       └── UserList.tsx    # List component
│   ├── .env.example            # Environment template
│   └── .env                    # Your local config (git-ignored)
│
├── mobile/                     # React Native mobile app (Expo)
│   ├── app/
│   │   ├── _layout.tsx         # Root layout (navigation)
│   │   └── index.tsx           # Home screen (state + logic)
│   ├── src/
│   │   ├── types.ts            # TypeScript interfaces (same as web!)
│   │   ├── api/
│   │   │   └── users.ts        # API client (same pattern as web!)
│   │   └── components/
│   │       ├── UserForm.tsx    # Native form component
│   │       └── UserList.tsx    # Native list component
│   ├── .env.example            # Environment template
│   └── .env                    # Your local config (git-ignored)
│
└── README.md                   # You are here!
```

## How to Use This Tutorial

This isn't a "copy-paste and hope it works" tutorial. It's designed for you to **read and understand the code**.

### The Learning Approach

1. **Every file is heavily commented** — explaining patterns, decisions, and connections between frontend and backend
2. **Follow the reading order below** — it's structured to build understanding layer by layer
3. **Open files side by side** — when a frontend file references a backend endpoint, open both and trace the flow
4. **Experiment** — break things, add console.logs, change values, see what happens

### Key Questions to Ask Yourself

- "Why is this code here and not somewhere else?"
- "What would break if I removed this?"
- "How does this frontend code connect to the backend?"

## Recommended Reading Order

### Backend (start here to understand the API)

1. `backend/models.py` — Data shapes (Pydantic)
2. `backend/database.py` — Storage layer
3. `backend/routers/users.py` — CRUD endpoints
4. `backend/main.py` — App setup & CORS

### Web Frontend (understand how React consumes the API)

1. `frontend/src/types.ts` — TypeScript interfaces (mirrors backend models)
2. `frontend/src/api/users.ts` — API client (calls backend)
3. `frontend/src/main.tsx` — Entry point
4. `frontend/src/App.tsx` — Main component (state + logic)
5. `frontend/src/components/UserForm.tsx` — Form component
6. `frontend/src/components/UserList.tsx` — List component

### Mobile App (see how the same patterns apply to React Native)

1. `mobile/src/types.ts` — Same interfaces as web!
2. `mobile/src/api/users.ts` — Same API client pattern
3. `mobile/app/_layout.tsx` — Expo Router layout (like React Router)
4. `mobile/app/index.tsx` — Main screen (compare to frontend/src/App.tsx)
5. `mobile/src/components/UserForm.tsx` — Native form (TextInput vs input)
6. `mobile/src/components/UserList.tsx` — Native list (View + map vs ul/li)

## Key Patterns Covered in Comments

| Pattern                        | Where                                                |
| ------------------------------ | ---------------------------------------------------- |
| Pydantic validation            | backend/models.py                                    |
| REST CRUD endpoints            | backend/routers/users.py                             |
| CORS configuration             | backend/main.py                                      |
| API client layer               | frontend/src/api/users.ts, mobile/src/api/users.ts   |
| Controlled components          | frontend/src/components/UserForm.tsx                 |
| List rendering with keys       | frontend/src/components/UserList.tsx                 |
| Smart/dumb component split     | App.tsx vs components/                               |
| try/catch/finally              | frontend/src/App.tsx, mobile/app/index.tsx           |
| React Native primitives        | mobile/src/components/\*.tsx (View, Text, TextInput) |
| StyleSheet.create()            | mobile/src/components/\*.tsx                         |
| Expo Router file-based routing | mobile/app/\_layout.tsx, mobile/app/index.tsx        |
| Environment variables          | .env files (VITE* prefix vs EXPO_PUBLIC* prefix)     |

## What Makes This Production-Grade?

This tutorial goes beyond "it works" to "it works correctly":

| Practice                   | Implementation                                                                   |
| -------------------------- | -------------------------------------------------------------------------------- |
| **Error Handling**         | try/catch/finally on all async operations, user-friendly error messages          |
| **Loading States**         | Loading indicators, disabled buttons during operations (prevents double-submits) |
| **Environment Variables**  | API URL configured via `.env`, not hardcoded                                     |
| **Type Safety**            | TypeScript interfaces mirror Pydantic models — errors caught at compile time     |
| **Separation of Concerns** | API layer separate from components, smart/dumb component pattern                 |
| **Input Validation**       | Pydantic validates on backend, HTML5 + required attributes on frontend           |

## Next Steps

Once you understand this codebase, here's where to go next:

| Topic                | What to Add                                         | Resources                                                                     |
| -------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Real Database**    | Replace in-memory dict with PostgreSQL + SQLAlchemy | [FastAPI SQL Databases](https://fastapi.tiangolo.com/tutorial/sql-databases/) |
| **Authentication**   | Add JWT tokens, protected routes                    | [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)           |
| **React Router**     | Multiple pages, navigation                          | [React Router](https://reactrouter.com/)                                      |
| **State Management** | For complex apps: Zustand, Redux, or TanStack Query | [TanStack Query](https://tanstack.com/query)                                  |
| **Testing**          | pytest (backend), Vitest (frontend)                 | [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)             |
| **Deployment**       | Docker, Railway, Vercel                             | [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)                |

## License

MIT License — do whatever you want with this code. Learn from it, modify it, use it in your projects. No attribution required (but appreciated!).

---

**Happy coding!** If this helped you, consider starring the repo ⭐
