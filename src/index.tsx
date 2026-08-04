"use client";

import React from "react";
import "./css/style.css";

const Index = () => {
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(() => localStorage.getItem("darkModeEnabled") === "true");

  React.useEffect(() => {
    let rootElement;
    if (localStorage.getItem('darkModeEnabled') === 'true') {
      rootElement = document.body.classList.add('dark');
    } else {
      rootElement = document.body.classList.remove('dark');
    }

    return () => {
      if (rootElement) {
        document.body.classList.remove('dark');
      }
    };
  }, []);

  return (
    <div className={`bg-gray-100 min-h-screen text-gray-900 ${darkModeEnabled ? 'dark' : ''}`}>
      {/* Your App component here */}
    </div>
  );
};

export default Index;