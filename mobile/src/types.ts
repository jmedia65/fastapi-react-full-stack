/**
 * =============================================================================
 * TYPES.TS - TypeScript Type Definitions for React Native
 * =============================================================================
 *
 * This file is IDENTICAL to frontend/src/types.ts — and that's intentional!
 *
 * CROSS-PLATFORM PATTERN:
 * When you have multiple clients (web, mobile, desktop) consuming the same API,
 * the type definitions should match across all of them. Options:
 *
 * 1. COPY (what we're doing here) - Simple, but requires manual sync
 * 2. SHARED PACKAGE - Create an npm package with shared types
 * 3. CODE GENERATION - Generate types from OpenAPI/Swagger spec
 *
 * For learning, copying is fine. In production, consider a shared package.
 *
 * BACKEND CONNECTION:
 * These interfaces MUST match the Pydantic models in backend/models.py
 *
 * | TypeScript (here)     | Python (backend/models.py) | React Web (frontend/src/types.ts) |
 * |-----------------------|----------------------------|-----------------------------------|
 * | interface User        | class User(BaseModel)      | interface User                    |
 * | interface UserCreate  | class UserCreate(BaseModel)| interface UserCreate              |
 *
 * =============================================================================
 */

/**
 * User - Complete user entity as returned by the API
 *
 * SAME SHAPE whether you're on:
 * - React Web (frontend/)
 * - React Native (mobile/)
 * - Any other client
 *
 * The API doesn't care what client is calling — it returns the same JSON.
 */
export interface User {
  id: number; // Server-generated, auto-incrementing
  name: string;
  email: string;
}

/**
 * UserCreate - Data required to create or update a user
 *
 * Used when:
 * - Sending POST /api/users (create)
 * - Sending PUT /api/users/{id} (update)
 *
 * NO id field — the server assigns IDs, not the client.
 */
export interface UserCreate {
  name: string;
  email: string;
}
