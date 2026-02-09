/**
 * =============================================================================
 * APP/INDEX.TSX - Main Screen (Smart/Container Component)
 * =============================================================================
 *
 * This is the MOBILE EQUIVALENT of frontend/src/App.tsx
 *
 * EXPO ROUTER FILE-BASED ROUTING:
 * - app/index.tsx = Home screen ("/")
 * - app/about.tsx = About screen ("/about")
 * - app/users/[id].tsx = Dynamic route ("/users/123")
 *
 * This file is in app/ because Expo Router uses file-based routing.
 * The web version uses a single App.tsx rendered at the root.
 *
 * COMPARISON: Web vs Mobile
 * ┌─────────────────────┬─────────────────────────────────────────────────────┐
 * │ Web (React)         │ Mobile (React Native)                               │
 * ├─────────────────────┼─────────────────────────────────────────────────────┤
 * │ Container (Bootstrap)│ SafeAreaView (respects notch/status bar)           │
 * │ Alert (Bootstrap)   │ Alert.alert() (native modal)                        │
 * │ Spinner (Bootstrap) │ ActivityIndicator (native)                          │
 * │ Row/Col (Bootstrap) │ View with flex (Flexbox)                            │
 * │ e.preventDefault()  │ Not needed (no form submission)                     │
 * └─────────────────────┴─────────────────────────────────────────────────────┘
 *
 * SAME PATTERNS:
 * - useState for state management
 * - useEffect for data fetching on mount
 * - try/catch/finally for error handling
 * - Smart/dumb component pattern
 * - Props passed to children
 * =============================================================================
 */

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
// USE THIS SafeAreaView — the react-native one is deprecated!
import { SafeAreaView } from "react-native-safe-area-context";

// Import types and API client — same as web!
import type { User, UserCreate } from "../src/types";
import * as userApi from "../src/api/users";

// Import components — mobile versions
import UserForm from "../src/components/UserForm";
import UserList from "../src/components/UserList";

/**
 * Index Component - Main Screen
 *
 * This is the "smart" component that:
 * 1. Owns all state
 * 2. Handles API calls
 * 3. Coordinates child components
 *
 * IDENTICAL LOGIC to frontend/src/App.tsx, different UI primitives.
 */
export default function Index() {
  // ===========================================================================
  // STATE DECLARATIONS
  // ===========================================================================
  // These are EXACTLY the same as the web version!
  // useState works identically in React and React Native.

  /** All users fetched from API */
  const [users, setUsers] = useState<User[]>([]);

  /** Current form values */
  const [formData, setFormData] = useState<UserCreate>({ name: "", email: "" });

  /** ID of user being edited (null = create mode) */
  const [editingId, setEditingId] = useState<number | null>(null);

  /** Loading state for async operations */
  const [loading, setLoading] = useState(false);

  /** Error message to display (null = no error) */
  const [error, setError] = useState<string | null>(null);

  // ===========================================================================
  // API OPERATIONS (CRUD)
  // ===========================================================================
  // These functions are IDENTICAL to the web version.
  // The only difference is how errors are displayed (Alert vs Bootstrap Alert).

  /**
   * loadUsers - Fetch all users from the API
   *
   * SAME as web version — try/catch/finally pattern.
   */
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getUsers();
      setUsers(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load users";
      setError(message);
      // MOBILE-SPECIFIC: Show native alert for errors
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================================
  // EFFECT: Load users on mount
  // ===========================================================================
  /**
   * useEffect with empty deps = runs once on mount
   * IDENTICAL to web version.
   */
  useEffect(() => {
    loadUsers();
  }, []);

  // ===========================================================================
  // CREATE OPERATION
  // ===========================================================================
  /**
   * handleCreate - Create a new user
   *
   * DIFFERENCE FROM WEB:
   * - No event parameter (no form submission to prevent)
   * - Alert.alert() instead of Bootstrap Alert for errors
   */
  const handleCreate = async () => {
    // Validate (basic — could be more robust)
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert("Validation Error", "Name and email are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await userApi.createUser(formData);
      setFormData({ name: "", email: "" }); // Reset form
      await loadUsers(); // Refresh list
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create user";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================================
  // UPDATE OPERATION
  // ===========================================================================
  /**
   * handleUpdate - Update an existing user
   */
  const handleUpdate = async () => {
    if (!editingId) return;

    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert("Validation Error", "Name and email are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await userApi.updateUser(editingId, formData);
      setEditingId(null); // Exit edit mode
      setFormData({ name: "", email: "" }); // Reset form
      await loadUsers(); // Refresh list
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update user";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================================
  // DELETE OPERATION
  // ===========================================================================
  /**
   * handleDelete - Delete a user
   *
   * MOBILE-SPECIFIC: Confirmation dialog before delete
   * This is a better UX on mobile where accidental taps are common.
   */
  const handleDelete = async (id: number) => {
    // MOBILE PATTERN: Confirm before destructive action
    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            setError(null);
            await userApi.deleteUser(id);
            await loadUsers();
          } catch (err) {
            const message =
              err instanceof Error ? err.message : "Failed to delete user";
            setError(message);
            Alert.alert("Error", message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // ===========================================================================
  // UI HELPERS
  // ===========================================================================

  /** Enter edit mode - populate form with user data */
  const startEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email });
  };

  /** Exit edit mode - clear form */
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", email: "" });
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================
  return (
    /**
     * SAFEAREAVIEW: Respects device safe areas (notch, status bar, home indicator)
     * This is CRITICAL on modern phones — content won't be hidden under the notch.
     */
    <SafeAreaView style={styles.safeArea}>
      {/**
       * KEYBOARDAVOIDINGVIEW: Moves content up when keyboard opens
       * Without this, the keyboard would cover the input fields!
       *
       * behavior differs by platform:
       * - iOS: "padding" works best
       * - Android: "height" or undefined (Android handles it natively)
       */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/**
         * SCROLLVIEW: Makes content scrollable
         * Unlike web, mobile screens are small — content often needs to scroll.
         */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          // Hide keyboard when scrolling (mobile UX pattern)
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <Text style={styles.title}>User CRUD</Text>
          <Text style={styles.subtitle}>
            {editingId ? "Edit User" : "Add User"}
          </Text>

          {/* LOADING INDICATOR
              Shows at top when loading */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}

          {/* ERROR DISPLAY
              Unlike web (dismissible Alert), we show inline error
              and also use Alert.alert for immediate feedback */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* FORM SECTION
              Same props as web version! */}
          <UserForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={editingId ? handleUpdate : handleCreate}
            onCancel={editingId ? cancelEdit : undefined}
            isEditing={!!editingId}
            loading={loading}
          />

          {/* LIST SECTION HEADER */}
          <Text style={styles.sectionTitle}>Users</Text>

          {/* USER LIST
              Same props as web version! */}
          <UserList
            users={users}
            onEdit={startEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * STYLESHEET
 *
 * Mobile-specific considerations:
 * - Larger touch targets (min 44pt)
 * - Appropriate padding for thumb zones
 * - Colors that work in both light and dark (we're using light mode)
 */
const styles = StyleSheet.create({
  // SafeAreaView wrapper
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  // Main container
  container: {
    flex: 1,
  },

  // ScrollView styling
  scrollView: {
    flex: 1,
  },

  // ScrollView inner content
  scrollContent: {
    padding: 16,
    paddingBottom: 32, // Extra padding at bottom
  },

  // Main title
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },

  // Subtitle (Add User / Edit User)
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
  },

  // Section title (Users list header)
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 24,
    marginBottom: 12,
  },

  // Loading indicator container
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    marginBottom: 16,
  },

  // Loading text
  loadingText: {
    marginLeft: 8,
    color: "#1976d2",
    fontSize: 14,
  },

  // Error container
  errorContainer: {
    padding: 12,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    marginBottom: 16,
  },

  // Error text
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
});
