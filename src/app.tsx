"use client";

import React from 'react';
import Button from './components/Button';
import DarkModeToggle from "./components/DarkModeToggle"

function App() {
  const [darkModeEnabled, setDarkModeEnabled] = useState(() => localStorage.getItem("darkModeEnabled") === "true");

  return (
    <div className={`bg-gray-100 min-h-screen text-gray-900 ${darkModeEnabled ? 'dark' : ''}`}>
      <header>
        <nav className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 flex justify-between items-center">
          <h1>My App</h1>
          <DarkModeToggle />
        </nav>
      </header>
      <main className="container mx-auto p-6">
        {/* Main content goes here */}
        <Button label="Click Me" onClick={() => alert("Button clicked!")}/>
      </main>
    </div>
  );
}

export default App;