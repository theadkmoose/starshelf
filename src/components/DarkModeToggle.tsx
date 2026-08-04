"use client";

import React, { useState } from 'react';

const DarkModeToggle = () => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const toggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled);
    document.body.classList.toggle("dark", !darkModeEnabled);
    localStorage.setItem("darkModeEnabled", !darkModeEnabled.toString());
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <span>Dark Mode</span>
      <input
        type="checkbox"
        checked={darkModeEnabled}
        onChange={toggleDarkMode}
        className="sr-only peer"
      />
      <div className="w-14 h-8 bg-gray-200 rounded-full peer dark:bg-primary-light dark:hover:bg-secondary-light after:content-[''] after:absolute after:left-[2px] after:h-7 after:w-6 after:rounded-full after:top-1 after:bg-white after:transition-all dark:after:bg-white peer-checked:translate-x-7 peer-checked:bg-primary hover:peer-focus:ring-4 hover:peer-focus:ring-secondary-light peer-checked:hover:peer-focus:ring-4 peer-checked:hover:peer-focus:ring-accent-light">
      </div>
    </label>
  );
};

export default DarkModeToggle;