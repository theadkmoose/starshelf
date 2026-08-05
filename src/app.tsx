import { useEffect, useState } from 'react';
import { supabase } from './supabase';

function App() {
  const [status, setStatus] = useState('Connecting to StarShelf…');

  useEffect(() => {
    let active = true;

    async function testSupabase() {
      const { error } = await supabase.from('books').select('*').limit(1);

      if (!active) return;

      if (error) {
        console.error('StarShelf Supabase check:', error);
        setStatus('StarShelf is online. Your books database still needs to be set up.');
      } else {
        setStatus('StarShelf is connected to your books database.');
      }
    }

    testSupabase();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="card" aria-live="polite">
        <div className="logo" aria-hidden="true">★</div>
        <h1>StarShelf</h1>
        <p className="tagline">Your personal bookshelf, wherever you go.</p>
        <div className="status">
          <span className="status-dot" />
          <span>{status}</span>
        </div>
        <p className="hint">Add StarShelf to your iPhone Home Screen from Safari for an app-like experience.</p>
      </section>
    </main>
  );
}

export default App;
