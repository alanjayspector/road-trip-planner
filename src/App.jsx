// src/App.jsx

import React, { useState, useEffect, useCallback } from 'react'; // <-- Updated import
import { useAuth } from './context/AuthContext';

function App() {
  const { currentUser, signInWithGoogle, logout, createRoute, getRoutes, loading, error, setError } = useAuth();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [routes, setRoutes] = useState([]); // <-- New state for routes

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await createRoute(from, to);
      setFrom('');
      setTo('');
      // Refetch routes after creation
      const fetchedRoutes = await getRoutes();
      setRoutes(fetchedRoutes);
    } catch (error) {
      console.error('Error creating route:', error);
    }
  };

  useEffect(() => {
    const fetchUserRoutes = async () => {
      if (currentUser) {
        try {
          const fetchedRoutes = await getRoutes();
          setRoutes(fetchedRoutes);
        } catch (error) {
          console.error('Error fetching routes:', error);
          setError('Failed to fetch routes.');
          // Display an error message to the user or take other appropriate action
        }
      }
    };
    fetchUserRoutes();
  }, [currentUser, getRoutes, setError]); // <-- Rerun effect when currentUser changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      {currentUser ? (
        <div>
          <h1>Welcome, {currentUser.displayName}!</h1>
          <button onClick={logout}>Sign Out</button>

          <hr style={{ margin: '20px 0' }} />

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

          <hr style={{ margin: '20px 0' }} />

          {/* NEW: Display a list of saved routes */}
          <h2>Your Saved Road Trips</h2>
          {routes.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {routes.map((route) => (
                <li key={route.id} style={{ marginBottom: '10px' }}>
                  <strong>From:</strong> {route.from} | <strong>To:</strong> {route.to}
                </li>
              ))}
            </ul>
          ) : (
            <p>No saved trips yet. Plan one above!</p>
          )}
        </div>
      ) : (
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