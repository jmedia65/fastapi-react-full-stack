"""
=============================================================================
MAIN.PY - FastAPI Application Entry Point
=============================================================================

This is where your FastAPI application is created and configured.
Think of it as the "front door" of your backend.

KEY CONCEPTS:
1. FastAPI() creates the application instance
2. Middleware handles cross-cutting concerns (like CORS)
3. Routers organize endpoints into logical groups

PRODUCTION PATTERN:
- Keep main.py minimal - just app setup and configuration
- Business logic lives in routers/ and services/
- This file should rarely change once set up

RUN THIS SERVER:
    cd backend
    uv run fastapi dev main.py

Then visit: http://localhost:8000/docs for interactive API documentation
=============================================================================
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users

# -----------------------------------------------------------------------------
# CREATE THE FASTAPI APPLICATION
# -----------------------------------------------------------------------------
# FastAPI() creates your app instance. All configuration hangs off this object.
# In production, you might pass: title="My API", version="1.0.0", docs_url="/api/docs"
app = FastAPI()

# -----------------------------------------------------------------------------
# CORS (Cross-Origin Resource Sharing) MIDDLEWARE
# -----------------------------------------------------------------------------
# WHAT: CORS controls which websites can call your API from a browser
# WHY:  Browsers block requests from different origins by default (security)
#
# Without this, your React app at localhost:5173 CANNOT call your API at localhost:8000
# The browser will block it with: "CORS policy: No 'Access-Control-Allow-Origin' header"
#
# PRODUCTION NOTES:
# - Never use allow_origins=["*"] in production (allows any website to call your API)
# - List your actual frontend domains: ["https://myapp.com", "https://www.myapp.com"]
# - allow_credentials=True is needed if you use cookies/auth headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default dev server port
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers (Content-Type, Authorization, etc.)
)

# -----------------------------------------------------------------------------
# REGISTER ROUTERS
# -----------------------------------------------------------------------------
# Routers group related endpoints together. This keeps main.py clean.
#
# include_router() mounts the router at a URL prefix:
#   - prefix="/api/users" means all routes in users.router start with /api/users
#   - tags=["users"] groups these endpoints together in /docs
#
# The users router defines:
#   GET    /api/users       → list all users    (see routers/users.py)
#   GET    /api/users/{id}  → get one user
#   POST   /api/users       → create user
#   PUT    /api/users/{id}  → update user
#   DELETE /api/users/{id}  → delete user
#
# PATTERN: One router per "resource" (users, products, orders, etc.)
app.include_router(users.router, prefix="/api/users", tags=["users"])
