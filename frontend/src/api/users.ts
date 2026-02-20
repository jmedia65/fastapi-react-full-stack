/**
 * =============================================================================
 * API/USERS.TS - API Client for User Operations
 * =============================================================================
 *
 * This file contains ALL functions that communicate with the backend API.
 * It's the ONLY place in the frontend that uses fetch() for user operations.
 *
 * PATTERN: "API Client" or "Service Layer"
 * - Components never call fetch() directly
 * - All API calls go through this file
 * - Easy to swap implementations (fetch → axios, mock for tests)
 *
 * BACKEND CONNECTION:
 * Each function here calls a specific endpoint in backend/routers/users.py
 *
 * | Function      | HTTP Method | Backend Endpoint         |
 * |---------------|-------------|--------------------------|
 * | getUsers()    | GET         | /api/users               |
 * | getUser(id)   | GET         | /api/users/{id}          |
 * | createUser()  | POST        | /api/users               |
 * | updateUser()  | PUT         | /api/users/{id}          |
 * | deleteUser()  | DELETE      | /api/users/{id}          |
 *
 * ERROR HANDLING:
 * All functions throw errors on failure. The calling component (App.tsx)
 * catches these in try/catch blocks and displays them to the user.
 * =============================================================================
 */

import type { User, UserCreate } from "../types";

/**
 * API_BASE - Base URL for all user API calls
 *
 * ENVIRONMENT VARIABLE: Reads from .env file via Vite
 *   - .env contains: VITE_API_BASE_URL=http://localhost:8000
 *   - Vite exposes env vars prefixed with VITE_ via import.meta.env
 *
 * WHY NOT HARDCODE?
 *   - Development: http://localhost:8000
 *   - Production: https://api.myapp.com
 *   - Different values per environment, same code
 *
 * BACKEND: This URL points to the FastAPI server defined in backend/main.py
 */
const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/users`;

/**
 * getUsers - Fetch all users from the API
 *
 * HTTP: GET /api/users
 * BACKEND: Calls get_users() in backend/routers/users.py
 * REACT: Called by loadUsers() in App.tsx on mount and after mutations
 *
 * @returns Promise<User[]> - Array of all users
 * @throws Error if the request fails (network error, server error, etc.)
 */
export const getUsers = async (): Promise<User[]> => {
  // fetch() returns a Response object, not the data directly
  const res = await fetch(API_BASE);

  // res.ok is true for status 200-299, false for 400+, 500+
  // Backend returns 200 OK with JSON array of users
  if (!res.ok) throw new Error("Failed to fetch users");

  // res.json() parses the JSON response body
  // TypeScript trusts our Promise<User[]> return type
  return res.json();
};

/**
 * getUser - Fetch a single user by ID
 *
 * HTTP: GET /api/users/{id}
 * BACKEND: Calls get_user(user_id) in backend/routers/users.py
 *
 * @param id - The user's ID (from user.id)
 * @returns Promise<User> - The user object
 * @throws Error if user not found (404) or request fails
 */
export const getUser = async (id: number): Promise<User> => {
  // Template literal builds URL: /api/users/123
  const res = await fetch(`${API_BASE}/${id}`);

  // Backend returns 404 if user doesn't exist (see routers/users.py)
  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
};

/**
 * createUser - Create a new user
 *
 * HTTP: POST /api/users
 * BACKEND: Calls create_user(user) in backend/routers/users.py
 * REACT: Called by handleCreate() in App.tsx when form is submitted
 *
 * @param user - UserCreate object (name, email - no id)
 * @returns Promise<User> - The created user WITH server-generated id
 * @throws Error if validation fails (422) or request fails
 *
 * FLOW:
 * 1. User fills form → formData = { name: "John", email: "john@example.com" }
 * 2. Form submit → handleCreate() → createUser(formData)
 * 3. fetch() sends POST with JSON body
 * 4. Backend validates, creates user, returns User with id
 * 5. App.tsx calls loadUsers() to refresh the list
 */
export const createUser = async (user: UserCreate): Promise<User> => {
  console.log("4. api/users.ts createUser: Making fetch request", user);
  console.log("Steps 5 to 8 happen in the backend");
  const res = await fetch(API_BASE, {
    method: "POST", // Default is GET; must specify for create
    headers: {
      // Tell the server we're sending JSON (not form data, XML, etc.)
      // Backend's Pydantic model expects JSON
      "Content-Type": "application/json",
    },
    // Convert JS object to JSON string
    // { name: "John", email: "john@example.com" } → '{"name":"John","email":"john@example.com"}'
    body: JSON.stringify(user),
  });
  const data = await res.json();
  console.log("9. api/users.ts createUser: Response received", data);

  // Backend returns 201 Created on success, 422 on validation failure
  if (!res.ok) throw new Error("Failed to create user");

  // Backend returns the created user WITH the new id
  // return res.json();
  return data;
};

/**
 * updateUser - Update an existing user
 *
 * HTTP: PUT /api/users/{id}
 * BACKEND: Calls update_user(user_id, user) in backend/routers/users.py
 * REACT: Called by handleUpdate() in App.tsx when editing form is submitted
 *
 * @param id - The user's ID to update
 * @param user - UserCreate object with new values
 * @returns Promise<User> - The updated user
 * @throws Error if user not found (404), validation fails (422), or request fails
 *
 * WHY PUT (not PATCH)?
 * - PUT = replace entire resource (send all fields)
 * - PATCH = partial update (send only changed fields)
 * - We're replacing all fields, so PUT is correct
 */
export const updateUser = async (
  id: number,
  user: UserCreate,
): Promise<User> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  // Backend returns 404 if user doesn't exist
  if (!res.ok) throw new Error("Failed to update user");

  return res.json();
};

/**
 * deleteUser - Delete a user by ID
 *
 * HTTP: DELETE /api/users/{id}
 * BACKEND: Calls delete_user(user_id) in backend/routers/users.py
 * REACT: Called by handleDelete() in App.tsx when Delete button is clicked
 *
 * @param id - The user's ID to delete
 * @returns Promise<void> - Nothing (204 No Content)
 * @throws Error if user not found (404) or request fails
 *
 * NOTE: Returns void because backend returns 204 No Content (empty body)
 * We don't call res.json() because there's no body to parse
 */
export const deleteUser = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });

  // Backend returns 204 on success, 404 if user doesn't exist
  if (!res.ok) throw new Error("Failed to delete user");

  // No return - void function, empty response body
};
