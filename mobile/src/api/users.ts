/**
 * =============================================================================
 * API/USERS.TS - API Client for React Native
 * =============================================================================
 *
 * This file is nearly IDENTICAL to frontend/src/api/users.ts — and that's the
 * power of using fetch()! The Fetch API works the same in:
 * - Web browsers (React)
 * - React Native (mobile)
 * - Node.js (with node-fetch or native fetch in v18+)
 *
 * WHAT'S THE SAME:
 * - fetch() syntax
 * - JSON handling
 * - async/await pattern
 * - Error handling
 *
 * WHAT'S DIFFERENT:
 * - Environment variable prefix: EXPO_PUBLIC_ instead of VITE_
 * - The API URL points to ngrok (or your machine's IP), not localhost
 *
 * WHY NGROK?
 * Mobile devices can't access "localhost" — that refers to the device itself.
 * Options:
 *   a) Use your computer's local IP (192.168.x.x) — works on same WiFi
 *   b) Use ngrok to tunnel — works anywhere, even on cellular
 *
 * BACKEND CONNECTION:
 * Each function calls a specific endpoint in backend/routers/users.py
 * The backend doesn't know (or care) whether it's a web browser or mobile app
 * calling — it just receives HTTP requests and returns JSON.
 * =============================================================================
 */

import type { User, UserCreate } from "../types";

/**
 * API_BASE - Base URL for all API calls
 *
 * EXPO ENVIRONMENT VARIABLES:
 * - Expo uses EXPO_PUBLIC_ prefix (like Vite uses VITE_)
 * - Accessed via process.env.EXPO_PUBLIC_*
 * - Set in .env file at mobile/ root
 *
 * IMPORTANT: When using ngrok, the URL changes each session (unless paid plan)
 * You'll need to update .env when you restart ngrok.
 */
const API_BASE = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users`;

/**
 * getUsers - Fetch all users from the API
 *
 * HTTP: GET /api/users
 * BACKEND: Calls get_users() in backend/routers/users.py
 *
 * IDENTICAL to frontend/src/api/users.ts — same endpoint, same response.
 *
 * @returns Promise<User[]> - Array of all users
 * @throws Error if the request fails
 */
export const getUsers = async (): Promise<User[]> => {
  // fetch() works the same in React Native as in browsers!
  // Trailing slash avoids 307 redirect from FastAPI
  const res = await fetch(`${API_BASE}/`);

  // Check for HTTP errors (4xx, 5xx)
  if (!res.ok) throw new Error("Failed to fetch users");

  // Parse JSON response
  return res.json();
};

/**
 * getUser - Fetch a single user by ID
 *
 * HTTP: GET /api/users/{id}
 * BACKEND: Calls get_user(user_id) in backend/routers/users.py
 *
 * @param id - The user's ID
 * @returns Promise<User> - The user object
 * @throws Error if user not found (404) or request fails
 */
export const getUser = async (id: number): Promise<User> => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

/**
 * createUser - Create a new user
 *
 * HTTP: POST /api/users
 * BACKEND: Calls create_user(user) in backend/routers/users.py
 *
 * MOBILE UI FLOW:
 * 1. User fills TextInput fields in UserForm component
 * 2. Taps "Create" button
 * 3. handleCreate() calls this function
 * 4. API creates user, returns user with ID
 * 5. UI refreshes list
 *
 * @param user - UserCreate object (name, email)
 * @returns Promise<User> - The created user WITH server-generated id
 * @throws Error if validation fails (422) or request fails
 */
export const createUser = async (user: UserCreate): Promise<User> => {
  // NOTE: Trailing slash is REQUIRED! FastAPI redirects /api/users → /api/users/
  // with a 307 redirect, but POST bodies don't survive redirects.
  const res = await fetch(`${API_BASE}/`, {
    method: "POST",
    headers: {
      // IMPORTANT: Tell server we're sending JSON
      // Without this, server might not parse the body correctly
      "Content-Type": "application/json",
    },
    // Convert JS object to JSON string
    body: JSON.stringify(user),
  });

  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
};

/**
 * updateUser - Update an existing user
 *
 * HTTP: PUT /api/users/{id}
 * BACKEND: Calls update_user(user_id, user) in backend/routers/users.py
 *
 * @param id - The user's ID to update
 * @param user - UserCreate object with new values
 * @returns Promise<User> - The updated user
 * @throws Error if user not found (404), validation fails (422), or request fails
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

  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
};

/**
 * deleteUser - Delete a user by ID
 *
 * HTTP: DELETE /api/users/{id}
 * BACKEND: Calls delete_user(user_id) in backend/routers/users.py
 *
 * @param id - The user's ID to delete
 * @returns Promise<void> - Nothing (204 No Content)
 * @throws Error if user not found (404) or request fails
 */
export const deleteUser = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
  // No return — 204 means empty response body
};
