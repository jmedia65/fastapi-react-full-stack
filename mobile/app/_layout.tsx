/**
 * =============================================================================
 * APP/_LAYOUT.TSX - Root Layout Component
 * =============================================================================
 *
 * EXPO ROUTER'S LAYOUT SYSTEM:
 * In Expo Router, _layout.tsx files define the "wrapper" for routes at that
 * directory level. Think of it like a template that wraps all pages.
 *
 * FILE STRUCTURE & ROUTING:
 * app/
 * ├── _layout.tsx      ← THIS FILE (wraps all routes)
 * ├── index.tsx        ← "/" route (home screen)
 * ├── about.tsx        ← "/about" route (if we had one)
 * └── users/
 *     ├── _layout.tsx  ← wraps all /users/* routes
 *     └── [id].tsx     ← "/users/123" dynamic route
 *
 * COMPARISON WITH WEB:
 * ┌─────────────────────┬─────────────────────────────────────────────────────┐
 * │ Web (React Router)  │ Mobile (Expo Router)                                │
 * ├─────────────────────┼─────────────────────────────────────────────────────┤
 * │ BrowserRouter       │ Stack (native navigation)                           │
 * │ Route element       │ File in app/ directory                              │
 * │ Layout component    │ _layout.tsx file                                    │
 * │ Outlet              │ Stack.Screen (automatic)                            │
 * │ useNavigate()       │ useRouter() / Link component                        │
 * └─────────────────────┴─────────────────────────────────────────────────────┘
 *
 * STACK NAVIGATION:
 * Stack is like a deck of cards — screens stack on top of each other.
 * - Push: Add a screen on top
 * - Pop: Remove the top screen (go back)
 *
 * This is the most common navigation pattern for simple apps.
 * Other options: Tabs, Drawer, etc.
 * =============================================================================
 */

import { Stack } from "expo-router";

/**
 * RootLayout - The root wrapper for all screens
 *
 * This component:
 * 1. Defines the navigation structure (Stack)
 * 2. Configures screen options (headers, animations)
 * 3. Can provide global context (themes, state, etc.)
 *
 * For a simple single-screen app, this is minimal.
 * For larger apps, you'd add:
 * - Theme providers
 * - Auth context
 * - Global state
 */
export default function RootLayout() {
  return (
    /**
     * Stack Navigator
     *
     * screenOptions: Applied to ALL screens in this Stack
     * You can override these per-screen in the Screen component
     *
     * Common options:
     * - headerShown: Show/hide the header bar
     * - headerTitle: Title text in header
     * - headerStyle: Style the header background
     * - headerTintColor: Color for header text/icons
     * - presentation: "modal" | "card" (animation style)
     * - animation: Customize transition animation
     */
    <Stack
      screenOptions={{
        // Header configuration
        headerStyle: {
          backgroundColor: "#007AFF", // iOS blue — matches our button color
        },
        headerTintColor: "#fff", // White text/icons
        headerTitleStyle: {
          fontWeight: "bold",
        },
        // Animation
        animation: "slide_from_right", // iOS-style slide animation
      }}
    >
      {/**
       * Stack.Screen - Configure individual screens
       *
       * name: Must match the file name (without .tsx)
       * options: Override screenOptions for this screen
       *
       * "index" is a special name — it's the root "/" route
       */}
      <Stack.Screen
        name="index"
        options={{
          title: "User CRUD", // Header title
          // headerRight: () => <Button />, // Add buttons to header if needed
        }}
      />

      {/**
       * Add more screens here as your app grows:
       *
       * <Stack.Screen
       *   name="users/[id]"
       *   options={{ title: "User Details" }}
       * />
       *
       * <Stack.Screen
       *   name="settings"
       *   options={{ title: "Settings", presentation: "modal" }}
       * />
       */}
    </Stack>
  );
}
