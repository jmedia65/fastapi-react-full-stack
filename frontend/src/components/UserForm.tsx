/**
 * =============================================================================
 * COMPONENTS/USERFORM.TSX - User Form Component (Presentational/Dumb Component)
 * =============================================================================
 *
 * This component renders a form for creating or editing users.
 * It's a "presentational" or "dumb" component - it has NO internal state.
 *
 * PATTERN: "Controlled Component"
 * - Form inputs get their values from props (not internal state)
 * - Changes are reported to parent via callbacks
 * - Parent (App.tsx) controls the form state
 *
 * WHY THIS PATTERN?
 * - Single source of truth (state lives in App.tsx)
 * - Form is reusable - could be used for create AND edit
 * - Easy to test - just pass props and check rendered output
 *
 * PROPS FLOW:
 * App.tsx owns: formData, setFormData, handleCreate/handleUpdate
 *    ↓ passes as props
 * UserForm renders form, calls setFormData on change, onSubmit on submit
 *
 * REACT-BOOTSTRAP COMPONENTS USED:
 * - Form: Wrapper for semantic HTML form
 * - Form.Group: Groups label + input together
 * - Form.Label: Accessible label for input
 * - Form.Control: Styled input element
 * - Button: Styled button with variants
 * - Stack: Flexbox helper for button layout
 * =============================================================================
 */

import { Form, Button, Stack } from "react-bootstrap";
import type { UserCreate } from "../types";

/**
 * Props interface - defines what App.tsx must pass to this component
 *
 * TypeScript interfaces for props:
 * 1. DOCUMENT what the component needs
 * 2. TYPE CHECK at compile time (catch missing props)
 * 3. AUTOCOMPLETE in IDE when using the component
 */
interface UserFormProps {
  /** Current form values - controlled by parent */
  formData: UserCreate;

  /** Callback to update form values - called on every keystroke */
  setFormData: (data: UserCreate) => void;

  /** Form submission handler - either handleCreate or handleUpdate */
  onSubmit: (e: React.FormEvent) => void;

  /** Cancel handler - only provided in edit mode */
  onCancel?: () => void; // ? makes it optional

  /** Whether form is in edit mode (changes button text) */
  isEditing: boolean;

  /** Whether an async operation is in progress (disables form) */
  loading: boolean;
}

/**
 * UserForm Component
 *
 * DESTRUCTURING: Instead of (props) and props.formData, we destructure:
 * ({ formData, setFormData, ... }) extracts each prop into its own variable
 */
function UserForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing,
  loading,
}: UserFormProps) {
  return (
    // FORM ELEMENT
    // onSubmit is called when form is submitted (Enter key or button click)
    // The handler (handleCreate or handleUpdate) is passed from App.tsx
    // <Form onSubmit={onSubmit}>
    <Form
      onSubmit={(e) => {
        console.log("1. UserForm: Form submitted");
        onSubmit(e);
      }}
    >
      {/* NAME INPUT GROUP
          Form.Group adds proper spacing (mb-3 = margin-bottom: 1rem)
          Form.Label is associated with input for accessibility
      */}
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          // CONTROLLED INPUT: value comes from props (React state)
          // This is the "single source of truth" pattern
          value={formData.name}
          // onChange fires on every keystroke
          // We spread existing formData (...formData) and override just 'name'
          // This preserves the email value while updating name
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          // Disable when loading to prevent changes during API call
          disabled={loading}
          // HTML5 validation - browser shows error if empty on submit
          required
        />
      </Form.Group>

      {/* EMAIL INPUT GROUP
          Same pattern as name, but type="email" for validation
      */}
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email" // Browser validates email format
          placeholder="Enter email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={loading}
          required
        />
      </Form.Group>

      {/* BUTTON ROW
          Stack with direction="horizontal" creates a flexbox row
          gap={2} adds spacing between buttons
      */}
      <Stack direction="horizontal" gap={2}>
        {/* SUBMIT BUTTON
            variant="primary" = blue Bootstrap button
            type="submit" makes it trigger form onSubmit
            Button text changes based on edit mode
        */}
        <Button variant="primary" type="submit" disabled={loading}>
          {isEditing ? "Update" : "Create"}
        </Button>

        {/* CANCEL BUTTON - Only shown in edit mode
            CONDITIONAL RENDERING: {condition && <JSX>}
            - If isEditing AND onCancel exist, render the button
            - Short-circuit evaluation: falsy && anything = falsy (nothing rendered)
        */}
        {isEditing && onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </Stack>
    </Form>
  );
}

// DEFAULT EXPORT - allows: import UserForm from './UserForm'
// (vs named export which would be: import { UserForm } from './UserForm')
export default UserForm;
