// src/App.jsx

import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';

function App() {
  const { currentUser, signInWithGoogle, logout, loading, error } = useAuth(); // Keep loading and error
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleCreateRoute = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    // TODO: We will add the Firestore logic here in the next step
    console.log('Creating route from:', from, 'to:', to);

    // Clear the form
    setFrom('');
    setTo('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      {currentUser ? (
        // Dashboard view for logged-in users
        <div>
          <h1>Welcome, {currentUser.displayName}!</h1>
          <p>Your email: {currentUser.email}</p> {/* Keep this line */}
          <button onClick={logout}>Sign Out</button>

          <hr style={{ margin: '20px 0' }} />

          {/* New route creation form */}
          <h2>Plan a New Road Trip</h2>
          <form onSubmit={handleCreateRoute}>
            <input
              type="text"
              placeholder="From Location"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={{ padding: '8px', marginRight: '10px' }}
            />
            <input
              type="text"
              placeholder="To Location"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{ padding: '8px', marginRight: '10px' }}
            />
            <button type="submit" style={{ padding: '8px 12px' }}>
              Create Route
            </button>
          </form>

          {/* TODO: Next, we'll display a list of saved routes here */}
        </div>
      ) : (
        // Login page view for non-logged-in users
        <div>
          <h1>Road Trip Planner</h1>
          <p>Please sign in to continue.</p>
          <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
      )}
    </div>
  );
}

export default App;