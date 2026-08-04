"use client";

import React from 'react';
import { useTheme } from '../contexts/ThemeProvider';

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h2>Settings</h2>
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
        />
        Dark Mode
      </label>
    </div>
  );
};

export default Settings;