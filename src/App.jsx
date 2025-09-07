// src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';

function App() {
  const { currentUser, signInWithGoogle, logout, createRoute, getRoutes, deleteRoute, loading, error, setError } = useAuth();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null); // <-- New state for selected route

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await createRoute(from, to);
      setFrom('');
      setTo('');
      const fetchedRoutes = await getRoutes();
      setRoutes(fetchedRoutes);
    } catch (error) {
      console.error('Error creating route:', error);
      setError('Failed to create route.');
    }
  };

  const handleDeleteRoute = async (routeId) => {
    try {
      await deleteRoute(routeId);
      const fetchedRoutes = await getRoutes();
      setRoutes(fetchedRoutes);
    } catch (error) {
      console.error("Error deleting route:", error);
      setError('Failed to delete route.');
    }
  };

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
  };

  const handleGoBack = () => {
    setSelectedRoute(null);
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
        }
      }
    };
    fetchUserRoutes();
  }, [currentUser, getRoutes, setError]);

  // Conditional rendering based on selectedRoute state
  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      {currentUser ? (
        // Main view for logged-in users
        <div>
          {selectedRoute ? (
            // New view to show details of a selected route
            <div>
              <button onClick={handleGoBack}>&larr; Back to Trips</button>
              <h1>Route from {selectedRoute.from} to {selectedRoute.to}</h1>
              <p>This is where we'll display the activities!</p>
            </div>
          ) : (
            // Main dashboard
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

              <h2>Your Saved Road Trips</h2>
              {routes.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {routes.map((route) => (
                    <li
                      key={route.id}
                      onClick={() => handleRouteClick(route)}
                      style={{
                        marginBottom: '10px',
                        cursor: 'pointer',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                      }}
                    >
                      <strong>From:</strong> {route.from} | <strong>To:</strong> {route.to}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoute(route.id);
                        }}
                        style={{ marginLeft: '10px', padding: '5px 8px' }}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No saved trips yet. Plan one above!</p>
              )}
            </div>
          )}
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