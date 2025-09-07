// src/App.jsx

import React from 'react';
import { useAuth } from './context/AuthContext';

function App() {
  const { currentUser, signInWithGoogle, logout, loading, error } = useAuth();

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
          <p>Your email: {currentUser.email}</p>
          <button onClick={logout}>Sign Out</button>
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