/**
 * =============================================================================
 * APP.TSX - Main Application Component (Smart/Container Component)
 * =============================================================================
 *
 * This is the "brain" of your application. It:
 * 1. OWNS all state (users, formData, loading, error)
 * 2. HANDLES all business logic (CRUD operations)
 * 3. COORDINATES child components (UserForm, UserList)
 *
 * PATTERN: "Smart/Container Component"
 * - App.tsx is "smart" - it manages state and talks to the API
 * - UserForm/UserList are "dumb" - they just receive props and render UI
 * - This separation makes components reusable and testable
 *
 * STATE FLOW:
 * App.tsx (state owner)
 *    ├── UserForm (receives formData, setFormData, handlers as props)
 *    └── UserList (receives users, handlers as props)
 *
 * BACKEND CONNECTION:
 * This component calls functions from api/users.ts, which call the FastAPI backend.
 * The CRUD operations here map to backend/routers/users.py endpoints.
 * =============================================================================
 */

import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import type { User, UserCreate } from "./types";
import * as userApi from "./api/users"; // Import all API functions as a namespace
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

function App() {
  // ===========================================================================
  // STATE DECLARATIONS
  // ===========================================================================
  // useState is React's way to add "memory" to components.
  // When state changes, React re-renders the component.
  //
  // PATTERN: State should live in the lowest common ancestor of components that need it.
  // Both UserForm and UserList need access to users/loading, so state lives here in App.

  /**
   * users: Array of all users fetched from the API
   * - Populated by loadUsers() on mount
   * - Updated after every create/update/delete operation
   * - Passed to UserList for rendering
   */
  const [users, setUsers] = useState<User[]>([]);

  /**
   * formData: Current form values for create/update operations
   * - Bound to form inputs via value={formData.name}
   * - Updated by setFormData when user types
   * - Sent to API on form submit
   * - Reset to empty after successful submit
   */
  const [formData, setFormData] = useState<UserCreate>({ name: "", email: "" });

  /**
   * editingId: Tracks which user is being edited (null = creating new user)
   * - null: Form is in "create" mode
   * - number: Form is in "edit" mode for user with this ID
   * - Used to toggle between handleCreate and handleUpdate
   */
  const [editingId, setEditingId] = useState<number | null>(null);

  /**
   * loading: Indicates async operation in progress
   * - true: Show spinner, disable form inputs
   * - Prevents double-submits and shows feedback
   * - Set true at start of operation, false in finally block
   */
  const [loading, setLoading] = useState(false);

  /**
   * error: Stores error message to display (null = no error)
   * - Set when API calls fail
   * - Displayed in Alert component
   * - Cleared when user dismisses or before next operation
   */
  const [error, setError] = useState<string | null>(null);

  // ===========================================================================
  // API OPERATIONS (CRUD)
  // ===========================================================================
  // Each function wraps an API call with:
  // 1. try/catch for error handling
  // 2. loading state management
  // 3. UI updates after success

  /**
   * loadUsers - Fetch all users from the API
   *
   * WHEN CALLED:
   * - On component mount (via useEffect)
   * - After successful create/update/delete (to refresh the list)
   *
   * BACKEND: GET /api/users → backend/routers/users.py → get_users()
   */
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const data = await userApi.getUsers(); // api/users.ts → fetch()
      setUsers(data); // Update state → React re-renders UserList
    } catch (err) {
      // Type-safe error message extraction
      // err could be Error object or something else (unknown type)
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      // finally ALWAYS runs, even if there's an error
      // This ensures loading is reset in all cases
      setLoading(false);
    }
  };

  // ===========================================================================
  // EFFECT: Load users on mount
  // ===========================================================================
  /**
   * useEffect runs side effects (API calls, subscriptions, timers)
   *
   * useEffect(fn, []) with empty deps array = runs ONCE on mount
   * Like componentDidMount in class components
   *
   * WHY useEffect for API calls?
   * - Rendering should be pure (no side effects)
   * - API calls are side effects
   * - useEffect separates "what to render" from "what to fetch"
   */
  useEffect(() => {
    loadUsers();
  }, []); // Empty array = only run once when component mounts

  // ===========================================================================
  // CREATE OPERATION
  // ===========================================================================
  /**
   * handleCreate - Create a new user from form data
   *
   * TRIGGERED BY: Form submit when editingId is null (create mode)
   * BACKEND: POST /api/users → backend/routers/users.py → create_user()
   *
   * @param e - Form event (we prevent default to stop page reload)
   */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop browser from reloading the page on form submit
    console.log("2. App.tsx handleCreate: Received submit event.");
    console.log("Form data:", formData);
    try {
      setLoading(true);
      setError(null);
      console.log("3. App.tsx: About to call userApi.createUser()");
      await userApi.createUser(formData); // Send POST request
      console.log("10. App.tsx: API call successful, resetting form");
      setFormData({ name: "", email: "" }); // Reset form after success
      await loadUsers(); // Refresh the user list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================================
  // UPDATE OPERATION
  // ===========================================================================
  /**
   * handleUpdate - Update an existing user
   *
   * TRIGGERED BY: Form submit when editingId is set (edit mode)
   * BACKEND: PUT /api/users/{id} → backend/routers/users.py → update_user()
   *
   * @param e - Form event
   */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return; // Guard: shouldn't happen, but TypeScript wants us to check
    try {
      setLoading(true);
      setError(null);
      await userApi.updateUser(editingId, formData); // Send PUT request with user ID
      setEditingId(null); // Exit edit mode
      setFormData({ name: "", email: "" }); // Reset form
      await loadUsers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================================
  // DELETE OPERATION
  // ===========================================================================
  /**
   * handleDelete - Delete a user by ID
   *
   * TRIGGERED BY: Delete button click in UserList
   * BACKEND: DELETE /api/users/{id} → backend/routers/users.py → delete_user()
   *
   * @param id - The user ID to delete
   */
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await userApi.deleteUser(id); // Send DELETE request
      await loadUsers(); // Refresh the list (removed user won't appear)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================================
  // UI HELPERS
  // ===========================================================================

  /**
   * startEdit - Enter edit mode for a user
   *
   * TRIGGERED BY: Edit button click in UserList
   * EFFECT: Populates form with user data, switches to edit mode
   *
   * @param user - The user object to edit
   */
  const startEdit = (user: User) => {
    setEditingId(user.id); // Enter edit mode
    setFormData({ name: user.name, email: user.email }); // Fill form with current values
  };

  /**
   * cancelEdit - Exit edit mode without saving
   *
   * TRIGGERED BY: Cancel button click in UserForm
   * EFFECT: Clears form, returns to create mode
   */
  const cancelEdit = () => {
    setEditingId(null); // Exit edit mode
    setFormData({ name: "", email: "" }); // Clear form
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================
  /**
   * JSX returned here describes what the UI should look like.
   * React-Bootstrap components provide pre-styled Bootstrap elements.
   *
   * LAYOUT:
   * Container → centers content with max-width
   * Row/Col → Bootstrap grid system
   *
   * CONDITIONAL RENDERING:
   * {error && <Alert>} = only show Alert if error is truthy
   * {loading && <Spinner>} = only show Spinner if loading is true
   */
  return (
    <Container className="py-4">
      <h1 className="mb-4">User CRUD</h1>

      {/* ERROR DISPLAY
          Shows dismissible alert when error state is set.
          onClose clears the error, hiding the alert.
      */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Row>
        {/* FORM SECTION
            UserForm is a "presentational" component - it just renders what we give it.
            All state and handlers are passed down as props.
        */}
        <Col xs={12} className="mb-4">
          <h5>{editingId ? "Edit User" : "Add User"}</h5>
          {loading && <Spinner size="sm" className="mb-2" />}
          <UserForm
            formData={formData} // Current form values
            setFormData={setFormData} // Function to update form values
            onSubmit={editingId ? handleUpdate : handleCreate} // Submit handler (create or update)
            onCancel={editingId ? cancelEdit : undefined} // Cancel only shown in edit mode
            isEditing={!!editingId} // !! converts to boolean: null→false, number→true
            loading={loading} // Disable inputs while loading
          />
        </Col>

        {/* LIST SECTION
            UserList displays all users with Edit/Delete buttons.
            It calls back to App when buttons are clicked.
        */}
        <Col xs={12}>
          <h5>Users</h5>
          <UserList
            users={users} // Array of users to display
            onEdit={startEdit} // Called when Edit is clicked
            onDelete={handleDelete} // Called when Delete is clicked
            loading={loading} // Disable buttons while loading
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
