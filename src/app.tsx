"use client";

import React, { useState } from 'react';
import Settings from './components/Settings';

const App = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Turn Off Dark Mode' : 'Turn On Dark Mode'}
      </button>
      <Settings onDarkModeToggle={() => setDarkMode(!darkMode)} />
    </div>
  );
};

export default App;