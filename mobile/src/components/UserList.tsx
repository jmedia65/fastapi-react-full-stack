/**
 * =============================================================================
 * COMPONENTS/USERLIST.TSX - User List for React Native
 * =============================================================================
 *
 * This component is the MOBILE EQUIVALENT of frontend/src/components/UserList.tsx
 *
 * COMPARISON: Web vs Mobile
 * ┌─────────────────────┬─────────────────────────────────────────────────────┐
 * │ Web (React)         │ Mobile (React Native)                               │
 * ├─────────────────────┼─────────────────────────────────────────────────────┤
 * │ <ul> + <li>         │ <View> + .map() (same pattern!)                     │
 * │ users.map(...)      │ users.map(...)                                      │
 * │ key={user.id}       │ key={user.id}                                       │
 * │ <button>            │ <Pressable>                                         │
 * │ style={{ color }}   │ style={styles.something}                            │
 * └─────────────────────┴─────────────────────────────────────────────────────┘
 *
 * WHY .map() INSTEAD OF FLATLIST HERE?
 *
 * FlatList is great for LARGE lists (100+ items) because it "virtualizes" —
 * only renders items visible on screen.
 *
 * BUT: FlatList cannot be nested inside ScrollView (same scroll direction)!
 * React Native will warn: "VirtualizedLists should never be nested..."
 *
 * SOLUTION:
 * - If parent (index.tsx) uses ScrollView → use .map() here
 * - If this were a standalone screen → use FlatList
 * - For large lists → make parent use FlatList with ListHeaderComponent
 *
 * For this learning app with <100 users, .map() is perfectly fine!
 *
 * SAME PATTERNS:
 * - Props interface
 * - Callbacks from parent
 * - Conditional rendering (empty state)
 * =============================================================================
 */

import { View, Text, Pressable, StyleSheet } from "react-native";
import type { User } from "../types";

/**
 * Props interface - Same shape as web version
 */
interface UserListProps {
  /** Array of users to display */
  users: User[];

  /** Called when Edit is pressed - receives full user object */
  onEdit: (user: User) => void;

  /** Called when Delete is pressed - receives just the ID */
  onDelete: (id: number) => void;

  /** Loading state - disables buttons during operations */
  loading: boolean;
}

/**
 * UserList Component - Native Mobile List
 *
 * Uses FlatList for optimized list rendering.
 */
export default function UserList({
  users,
  onEdit,
  onDelete,
  loading,
}: UserListProps) {
  // EARLY RETURN: Empty state
  // Same pattern as web — handle edge case first
  if (users.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No users yet. Create one above!</Text>
      </View>
    );
  }

  return (
    /**
     * SIMPLE VIEW + .map() PATTERN
     *
     * This is the SAME pattern as web React:
     * - Container element (View instead of ul/div)
     * - .map() to iterate
     * - key prop for React reconciliation
     *
     * We use .map() instead of FlatList because:
     * - Parent (index.tsx) uses ScrollView for overall scrolling
     * - FlatList nested in ScrollView causes warnings and breaks
     * - For small lists (<100 items), .map() performs fine
     */
    <View style={styles.listContainer}>
      {users.map((user, index) => (
        // Fragment with key for the card + optional separator
        <View key={user.id}>
          {/* Separator between items (not before first) */}
          {index > 0 && <View style={styles.separator} />}

          {/* User Card */}
          <View style={styles.userCard}>
            {/* User info section */}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>

            {/* Action buttons */}
            <View style={styles.buttonGroup}>
              {/* EDIT BUTTON */}
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.editButton,
                  pressed && styles.buttonPressed,
                  loading && styles.buttonDisabled,
                ]}
                onPress={() => onEdit(user)} // Pass full user object
                disabled={loading}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>

              {/* DELETE BUTTON */}
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.deleteButton,
                  pressed && styles.buttonPressed,
                  loading && styles.buttonDisabled,
                ]}
                onPress={() => onDelete(user.id)} // Pass just the ID
                disabled={loading}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * STYLESHEET - Mobile-specific styles
 *
 * Note the use of "cards" instead of list items — more mobile-native feel.
 */
const styles = StyleSheet.create({
  // Empty state container
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },

  // Empty state text
  emptyText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },

  // Main list container
  listContainer: {
    // No padding here — parent ScrollView handles it
  },

  // Each user "card"
  userCard: {
    flexDirection: "row", // Horizontal: info on left, buttons on right
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Android shadow
    elevation: 2,
  },

  // User info (name + email) container
  userInfo: {
    flex: 1, // Take remaining space
    marginRight: 12, // Space before buttons
  },

  // User name
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },

  // User email
  userEmail: {
    fontSize: 14,
    color: "#666",
  },

  // Button group (Edit + Delete)
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },

  // Base action button style
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },

  // Edit button specific
  editButton: {
    backgroundColor: "#fff",
    borderColor: "#007AFF",
  },

  // Edit button text
  editButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },

  // Delete button specific
  deleteButton: {
    backgroundColor: "#fff",
    borderColor: "#FF3B30", // iOS red
  },

  // Delete button text
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "500",
  },

  // Pressed state
  buttonPressed: {
    opacity: 0.7,
  },

  // Disabled state
  buttonDisabled: {
    opacity: 0.5,
  },

  // Space between items
  separator: {
    height: 12,
  },
});
