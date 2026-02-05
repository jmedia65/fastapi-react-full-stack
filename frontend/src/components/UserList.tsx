/**
 * =============================================================================
 * COMPONENTS/USERLIST.TSX - User List Component (Presentational/Dumb Component)
 * =============================================================================
 *
 * This component renders a list of users with Edit and Delete buttons.
 * Like UserForm, it's a "presentational" component with no internal state.
 *
 * PATTERN: "List Rendering with Array.map()"
 * - users.map() transforms an array of data into an array of JSX elements
 * - Each item needs a unique 'key' prop for React's reconciliation algorithm
 *
 * WHY USE key PROP?
 * - React uses keys to track which items changed, added, or removed
 * - Without keys, React re-renders the entire list on any change
 * - Keys should be stable, unique identifiers (user.id is perfect)
 * - NEVER use array index as key if items can be reordered/deleted
 *
 * CALLBACK PATTERN:
 * - Parent (App.tsx) passes handler functions as props
 * - This component calls them when buttons are clicked
 * - The handlers run in the parent context (where state lives)
 *
 * REACT-BOOTSTRAP COMPONENTS USED:
 * - ListGroup: Styled list container
 * - ListGroup.Item: Individual list item with hover states
 * - Button: Action buttons with variants and sizes
 * - Stack: Flexbox helper for button layout
 * =============================================================================
 */

import { ListGroup, Button, Stack } from "react-bootstrap";
import type { User } from "../types";

/**
 * Props interface for UserList
 *
 * PATTERN: Props describe:
 * 1. DATA to display (users array)
 * 2. CALLBACKS for user actions (onEdit, onDelete)
 * 3. UI STATE that affects rendering (loading)
 */
interface UserListProps {
  /** Array of users to display - comes from App.tsx state */
  users: User[];

  /** Called when Edit button is clicked - receives the user object */
  onEdit: (user: User) => void;

  /** Called when Delete button is clicked - receives just the ID */
  onDelete: (id: number) => void;

  /** Whether an async operation is in progress - disables buttons */
  loading: boolean;
}

/**
 * UserList Component
 *
 * RENDERS: A list of users with Edit/Delete actions
 * DATA SOURCE: users array from App.tsx (fetched from backend)
 */
function UserList({ users, onEdit, onDelete, loading }: UserListProps) {
  // EARLY RETURN PATTERN
  // Handle empty state first - cleaner than wrapping everything in if/else
  if (users.length === 0) {
    // text-muted is a Bootstrap class for gray text
    return <p className="text-muted">No users yet. Create one above!</p>;
  }

  return (
    // LISTGROUP: Bootstrap component for rendering lists
    // Adds borders, hover states, and proper spacing
    <ListGroup>
      {/*
        ARRAY.MAP() - The heart of list rendering in React

        users.map(callback) calls the callback for each user
        Each call returns a JSX element
        Result: array of <ListGroup.Item> elements

        Visual flow:
        users = [{id:1, name:"John"}, {id:2, name:"Jane"}]
           ↓ .map()
        [<ListGroup.Item key={1}>John</ListGroup.Item>,
         <ListGroup.Item key={2}>Jane</ListGroup.Item>]
      */}
      {users.map((user) => (
        // KEY PROP: React's way to track list items
        // Must be unique among siblings, stable across re-renders
        // user.id is perfect - comes from backend, guaranteed unique
        <ListGroup.Item
          key={user.id}
          // Bootstrap utility classes for layout:
          // d-flex: display: flex
          // justify-content-between: space items to opposite ends
          // align-items-center: vertically center items
          className="d-flex justify-content-between align-items-center"
        >
          {/* USER INFO SECTION
              <div> groups name and email together on the left
          */}
          <div>
            {/* <strong> for emphasis (bold) */}
            <strong>{user.name}</strong>
            {/* <br /> line break between name and email */}
            <br />
            {/* <small> for smaller text, text-muted for gray color */}
            <small className="text-muted">{user.email}</small>
          </div>

          {/* BUTTON SECTION
              Stack groups Edit and Delete buttons on the right
          */}
          <Stack direction="horizontal" gap={2}>
            {/* EDIT BUTTON
                variant="outline-primary": bordered button, no fill
                size="sm": smaller button
                onClick: calls onEdit with the full user object
                  → App.tsx receives this, calls startEdit(user)
                  → Form populates with user data
            */}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onEdit(user)}
              disabled={loading}
            >
              Edit
            </Button>

            {/* DELETE BUTTON
                variant="outline-danger": red bordered button
                onClick: calls onDelete with just the user ID
                  → App.tsx receives this, calls handleDelete(id)
                  → API called, list refreshed
            */}
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(user.id)}
              disabled={loading}
            >
              Delete
            </Button>
          </Stack>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default UserList;
