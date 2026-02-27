import React from "react";
import "./App.css";
import InputScreen from "./screens/InputScreen";

/**
 * Root app composition.
 * Screens/overlays are extracted into separate components for clarity.
 */

// PUBLIC_INTERFACE
function App() {
  // Currently the app contains a single screen. Future screens can be added here
  // (e.g., via routing or an internal state machine) without changing screen internals.
  return <InputScreen />;
}

export default App;
