/**
 * =============================================================================
 * MAIN.TSX - React Application Entry Point
 * =============================================================================
 *
 * This is where React is mounted to the DOM. It's the "front door" of your
 * frontend application.
 *
 * WHAT HAPPENS HERE:
 * 1. Import Bootstrap CSS (must be before App to style everything)
 * 2. Find the <div id="root"> in index.html
 * 3. Create a React root and render the App component into it
 *
 * THIS FILE RARELY CHANGES after initial setup.
 * All your app logic lives in App.tsx and its child components.
 *
 * BOOTSTRAP: We import the CSS here so it's available globally.
 * This is the simplest approach - one import, styles everywhere.
 * =============================================================================
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// BOOTSTRAP CSS - Import before App so all components can use Bootstrap classes
// This imports from node_modules/bootstrap/dist/css/bootstrap.min.css
// React-Bootstrap components (Button, Form, etc.) need this CSS to look right
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App.tsx";

/**
 * Mount React to the DOM
 *
 * document.getElementById("root")! finds <div id="root"></div> in index.html
 * The ! is TypeScript's "non-null assertion" - we know this element exists
 *
 * createRoot() creates a React 18 root (replaced ReactDOM.render from React 17)
 *
 * StrictMode enables extra development checks:
 * - Warns about deprecated lifecycle methods
 * - Detects unexpected side effects (runs effects twice in dev)
 * - Warns about legacy APIs
 * Don't worry if you see effects running twice in dev - that's intentional!
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
