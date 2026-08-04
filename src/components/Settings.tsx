"use client";

import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const Settings = ({ onDarkModeToggle }: { onDarkModeToggle: () => void }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div className="flex items-center space-x-4">
        <button onClick={onDarkModeToggle}>
          {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
        </button>
      </div>
    </div>
  );
};

export default Settings;