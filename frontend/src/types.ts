/**
 * =============================================================================
 * TYPES.TS - TypeScript Type Definitions
 * =============================================================================
 *
 * This file defines the SHAPE of data used throughout the frontend.
 * TypeScript interfaces provide:
 *   1. AUTOCOMPLETE - IDE knows what properties are available
 *   2. TYPE CHECKING - Catch errors at compile time, not runtime
 *   3. DOCUMENTATION - Self-documenting code
 *
 * BACKEND CONNECTION:
 * These interfaces MUST match the Pydantic models in backend/models.py
 * If you change the backend models, update these interfaces!
 *
 * | TypeScript (here)     | Python (backend/models.py) |
 * |-----------------------|----------------------------|
 * | interface User        | class User(BaseModel)      |
 * | interface UserCreate  | class UserCreate(BaseModel)|
 *
 * NAMING CONVENTION:
 * - User = full entity with ID (what API returns)
 * - UserCreate = data for creating/updating (what we send TO API)
 * =============================================================================
 */

/**
 * User - Complete user entity as returned by the API
 *
 * Used when:
 * - Displaying users in UserList component
 * - Storing users in state: useState<User[]>([])
 * - Receiving data from GET /api/users
 *
 * BACKEND: Matches backend/models.py → class User
 */
export interface User {
  id: number; // Server-generated, never sent BY client
  name: string;
  email: string;
}

/**
 * UserCreate - Data required to create or update a user
 *
 * Used when:
 * - Form data in UserForm component
 * - Sending POST /api/users (create)
 * - Sending PUT /api/users/{id} (update)
 *
 * WHY SEPARATE FROM User?
 * - Client doesn't send 'id' when creating (server generates it)
 * - Same shape is used for both create AND update operations
 *
 * BACKEND: Matches backend/models.py → class UserCreate
 */
export interface UserCreate {
  name: string;
  email: string;
}
