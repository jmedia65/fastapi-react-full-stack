"""
=============================================================================
ROUTERS/USERS.PY - User CRUD Endpoints
=============================================================================

This file defines all API endpoints for the "users" resource.
It implements the standard REST CRUD operations:

| Operation | HTTP Method | Endpoint         | Frontend Function      |
|-----------|-------------|------------------|------------------------|
| Create    | POST        | /api/users       | createUser()           |
| Read All  | GET         | /api/users       | getUsers()             |
| Read One  | GET         | /api/users/{id}  | getUser()              |
| Update    | PUT         | /api/users/{id}  | updateUser()           |
| Delete    | DELETE      | /api/users/{id}  | deleteUser()           |

FRONTEND CONNECTION:
Each endpoint here has a matching function in frontend/src/api/users.ts
The frontend calls these endpoints using fetch().

KEY CONCEPTS:
1. APIRouter groups related endpoints
2. Path parameters like {user_id} are extracted automatically
3. Request body is validated against Pydantic models
4. response_model controls what gets returned to the client
5. HTTPException returns error responses (404, 400, etc.)
=============================================================================
"""

from fastapi import APIRouter, HTTPException
from models import User, UserCreate
import database as db

# -----------------------------------------------------------------------------
# CREATE THE ROUTER
# -----------------------------------------------------------------------------
# APIRouter is like a "mini FastAPI app" that gets mounted to the main app.
# In main.py, this router is mounted at /api/users
router = APIRouter()


# -----------------------------------------------------------------------------
# GET /api/users - List all users (READ)
# -----------------------------------------------------------------------------
# FRONTEND: Called by getUsers() in frontend/src/api/users.ts
# REACT: Used in loadUsers() in App.tsx to populate the user list
#
# response_model=list[User] does two things:
# 1. VALIDATION: Ensures response matches the User model
# 2. DOCUMENTATION: Shows response schema in /docs
#
# HTTP Response: 200 OK with JSON array
# Example: [{"id": 1, "name": "John", "email": "john@example.com"}]
@router.get("/", response_model=list[User])
def get_users():
    # dict.values() returns all users, list() converts to array for JSON
    return list(db.users_db.values())


# -----------------------------------------------------------------------------
# GET /api/users/{user_id} - Get single user (READ)
# -----------------------------------------------------------------------------
# FRONTEND: Called by getUser(id) in frontend/src/api/users.ts
#
# PATH PARAMETER: {user_id} in the URL becomes a function argument
# FastAPI automatically converts "123" (string) to 123 (int)
#
# HTTP Responses:
#   200 OK - User found, returns user data
#   404 Not Found - User doesn't exist
@router.get("/{user_id}", response_model=User)
def get_user(user_id: int):
    # Check if user exists; if not, return 404
    if user_id not in db.users_db:
        # HTTPException stops execution and returns error response
        # Frontend catches this in the try/catch block
        raise HTTPException(status_code=404, detail="User not found")
    return db.users_db[user_id]


# -----------------------------------------------------------------------------
# POST /api/users - Create new user (CREATE)
# -----------------------------------------------------------------------------
# FRONTEND: Called by createUser(user) in frontend/src/api/users.ts
# REACT: Triggered by handleCreate() when form is submitted
#
# REQUEST BODY: FastAPI automatically parses JSON body into UserCreate model
# If validation fails (bad email, missing fields), returns 422 Unprocessable Entity
#
# status_code=201 indicates "Created" (not default 200 "OK")
# This is REST convention for successful creation
#
# HTTP Responses:
#   201 Created - User created successfully, returns new user with ID
#   422 Unprocessable Entity - Validation failed (bad email, missing fields)
@router.post("/", response_model=User, status_code=201)
def create_user(user: UserCreate):
    print("=" * 50)
    print("5. BACKEND: create_user() endpoint hit")
    print(f"   Received data: {user}")
    print(f"   Will assign ID: {db.user_id_counter}")
    # Access the global counter to assign new ID
    # In SQL: INSERT INTO users (name, email) VALUES (...) RETURNING id
    global user_id_counter  # Needed to modify module-level variable

    # Create user dict with server-generated ID
    # user.dict() converts Pydantic model to dictionary
    # ** unpacks: {"name": "John", "email": "john@example.com"}
    new_user = {"id": db.user_id_counter, **user.model_dump()}
    print(f"6. BACKEND: Created user dict: {new_user}")

    # Store in "database"
    db.users_db[db.user_id_counter] = new_user
    print(f"7. BACKEND: Stored in database. DB now has {len(db.users_db)} user(s)")

    # Increment for next user
    db.user_id_counter += 1

    # Return created user (with ID) - frontend uses this to update UI
    print(f"8. BACKEND: Returning new_user to frontend")
    print("=" * 50)
    return new_user


# -----------------------------------------------------------------------------
# PUT /api/users/{user_id} - Update existing user (UPDATE)
# -----------------------------------------------------------------------------
# FRONTEND: Called by updateUser(id, user) in frontend/src/api/users.ts
# REACT: Triggered by handleUpdate() when editing form is submitted
#
# COMBINES: Path parameter (user_id) + Request body (user: UserCreate)
# FastAPI handles both automatically
#
# HTTP Responses:
#   200 OK - User updated successfully, returns updated user
#   404 Not Found - User doesn't exist
#   422 Unprocessable Entity - Validation failed
@router.put("/{user_id}", response_model=User)
def update_user(user_id: int, user: UserCreate):
    # Can't update a user that doesn't exist
    if user_id not in db.users_db:
        raise HTTPException(status_code=404, detail="User not found")

    # Replace entire user record (keeping the same ID)
    # In SQL: UPDATE users SET name=?, email=? WHERE id=?
    db.users_db[user_id] = {"id": user_id, **user.model_dump()}

    return db.users_db[user_id]


# -----------------------------------------------------------------------------
# DELETE /api/users/{user_id} - Delete user (DELETE)
# -----------------------------------------------------------------------------
# FRONTEND: Called by deleteUser(id) in frontend/src/api/users.ts
# REACT: Triggered by handleDelete() when Delete button is clicked
#
# status_code=204 means "No Content" - success but nothing to return
# This is REST convention for successful deletion
#
# HTTP Responses:
#   204 No Content - User deleted successfully (empty response body)
#   404 Not Found - User doesn't exist
@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int):
    if user_id not in db.users_db:
        raise HTTPException(status_code=404, detail="User not found")

    # Remove from "database"
    # In SQL: DELETE FROM users WHERE id=?
    del db.users_db[user_id]
    # No return statement = empty response body (204 No Content)
