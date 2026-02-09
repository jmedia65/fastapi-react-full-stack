/**
 * =============================================================================
 * COMPONENTS/USERFORM.TSX - User Form for React Native
 * =============================================================================
 *
 * This component is the MOBILE EQUIVALENT of frontend/src/components/UserForm.tsx
 *
 * COMPARISON: Web vs Mobile
 * ┌─────────────────────┬─────────────────────────────────────────────────────┐
 * │ Web (React)         │ Mobile (React Native)                               │
 * ├─────────────────────┼─────────────────────────────────────────────────────┤
 * │ <input>             │ <TextInput>                                         │
 * │ <button>            │ <Pressable> or <TouchableOpacity>                   │
 * │ <form>              │ <View> (no form element in RN)                      │
 * │ onSubmit            │ onPress (no form submission, just button press)     │
 * │ CSS / Bootstrap     │ StyleSheet.create()                                 │
 * │ className="..."     │ style={styles.something}                            │
 * │ e.preventDefault()  │ Not needed (no form submission to prevent)          │
 * └─────────────────────┴─────────────────────────────────────────────────────┘
 *
 * SAME PATTERNS:
 * - Props interface (TypeScript)
 * - Controlled component (value + onChange)
 * - Callbacks passed from parent
 * - Conditional rendering
 *
 * WHY PRESSABLE OVER TOUCHABLEOPACITY?
 * - Pressable is the newer, recommended API
 * - More customization options (pressed state styling)
 * - TouchableOpacity still works but is legacy
 * =============================================================================
 */

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import type { UserCreate } from "../types";

/**
 * Props interface - SAME SHAPE as web version
 *
 * The props are identical because the LOGIC is the same:
 * - Parent owns the state
 * - This component just renders the form and reports changes
 */
interface UserFormProps {
  /** Current form values - controlled by parent (app/index.tsx) */
  formData: UserCreate;

  /** Callback to update form values */
  setFormData: (data: UserCreate) => void;

  /** Submit handler - called when Create/Update button is pressed */
  onSubmit: () => void; // NOTE: No event parameter (unlike web's React.FormEvent)

  /** Cancel handler - only provided in edit mode */
  onCancel?: () => void;

  /** Whether form is in edit mode (changes button text) */
  isEditing: boolean;

  /** Whether an async operation is in progress */
  loading: boolean;
}

/**
 * UserForm Component - Native Mobile Form
 *
 * CONTROLLED COMPONENT PATTERN:
 * Same as web — values come from props, changes reported via callbacks.
 *
 * TextInput.value = formData.name (controlled)
 * TextInput.onChangeText = calls setFormData (reports changes)
 */
export default function UserForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing,
  loading,
}: UserFormProps) {
  return (
    // VIEW = Container (like <div> in web)
    // No <form> element in React Native — just Views and event handlers
    <View style={styles.container}>
      {/* NAME INPUT
          TextInput is React Native's input element.
          
          KEY DIFFERENCES FROM WEB:
          - onChangeText gives you the string directly (not e.target.value)
          - placeholder works the same
          - editable={false} instead of disabled={true}
          - autoCapitalize controls keyboard behavior
      */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={[styles.input, loading && styles.inputDisabled]}
        placeholder="Enter name"
        placeholderTextColor="#999"
        // CONTROLLED: value comes from parent state
        value={formData.name}
        // onChangeText gives the new text directly (not an event object!)
        // Web: (e) => setFormData({...formData, name: e.target.value})
        // RN:  (text) => setFormData({...formData, name: text})
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        // editable is RN's version of "disabled"
        editable={!loading}
        // Keyboard settings (RN-specific)
        autoCapitalize="words" // Capitalize each word
        autoCorrect={false}
      />

      {/* EMAIL INPUT */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, loading && styles.inputDisabled]}
        placeholder="Enter email"
        placeholderTextColor="#999"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        editable={!loading}
        // Email-specific keyboard settings
        keyboardType="email-address" // Shows @ and . on keyboard
        autoCapitalize="none" // Don't capitalize email
        autoCorrect={false}
      />

      {/* BUTTON ROW */}
      <View style={styles.buttonRow}>
        {/* SUBMIT BUTTON
            Pressable is the modern way to handle touch in React Native.
            
            PRESSABLE VS TOUCHABLEOPACITY:
            - Pressable: Newer, more flexible, recommended
            - TouchableOpacity: Legacy, still works, simpler
            
            We use a function for style to handle pressed state.
        */}
        <Pressable
          // Style function receives { pressed } to style differently when pressed
          style={({ pressed }) => [
            styles.button,
            styles.buttonPrimary,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
          onPress={onSubmit}
          disabled={loading}
        >
          {/* Show spinner when loading, otherwise show text */}
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>
              {isEditing ? "Update" : "Create"}
            </Text>
          )}
        </Pressable>

        {/* CANCEL BUTTON - Only shown when editing
            Same conditional rendering pattern as web:
            {condition && <Component />}
        */}
        {isEditing && onCancel && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonSecondary,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.buttonTextSecondary}>Cancel</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/**
 * STYLESHEET - React Native Styling
 *
 * StyleSheet.create() is the standard way to style in React Native.
 *
 * KEY DIFFERENCES FROM CSS:
 * - camelCase properties (backgroundColor, not background-color)
 * - No units — numbers are density-independent pixels (dp)
 * - Flexbox is the default layout (no need for display: flex)
 * - No cascading — styles don't inherit (except text within Text)
 * - Array syntax for multiple styles: style={[styles.a, styles.b]}
 *
 * WHY StyleSheet.create() OVER INLINE OBJECTS?
 * - Performance: Styles are validated and optimized once
 * - Type checking: IDE catches invalid properties
 * - Organization: Styles are co-located but separated from JSX
 */
const styles = StyleSheet.create({
  // Container for the entire form
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },

  // Label text above inputs
  label: {
    fontSize: 14,
    fontWeight: "600", // Semi-bold
    color: "#333",
    marginBottom: 4,
  },

  // Text input styling
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  // Disabled input state
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },

  // Row containing buttons
  buttonRow: {
    flexDirection: "row", // Horizontal layout
    gap: 12, // Space between buttons (RN 0.71+)
  },

  // Base button style
  button: {
    flex: 1, // Equal width buttons
    padding: 14,
    borderRadius: 8,
    alignItems: "center", // Center text horizontally
    justifyContent: "center", // Center text vertically
  },

  // Primary button (Create/Update)
  buttonPrimary: {
    backgroundColor: "#007AFF", // iOS blue
  },

  // Secondary button (Cancel)
  buttonSecondary: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  // Pressed state — subtle feedback
  buttonPressed: {
    opacity: 0.8,
  },

  // Disabled state
  buttonDisabled: {
    opacity: 0.5,
  },

  // Primary button text
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Secondary button text
  buttonTextSecondary: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});
