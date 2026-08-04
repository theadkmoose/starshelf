"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

function App() {
  const [status, setStatus] = useState("Connecting to StarShelf...");

  useEffect(() => {
    async function testSupabase() {
      const { error } = await supabase
        .from("books")
        .select("*")
        .limit(1);

      if (error) {
        setStatus(`Supabase connected, but books table is not ready yet.`);
        console.error(error);
      } else {
        setStatus("StarShelf is connected to Supabase!");
      }
    }

    testSupabase();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">StarShelf</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;
