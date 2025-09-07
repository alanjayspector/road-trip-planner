// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query, // <-- Add query here
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add an error state

  // Define createUserDocument BEFORE signInWithGoogle
  const createUserDocument = useCallback(
    async (user) => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          await setDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
            createdAt: new Date(),
          });
          console.log("User document created!");
        }
      } catch (error) {
        console.error("Error creating user document:", error);
        setError("Failed to create user profile.");
        // Consider retrying or taking other appropriate action
      }
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  }, [createUserDocument]); // Add createUserDocument as a dependency

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out.");
    } finally {
      setLoading(false);
    }
  }, []); // <-- Add auth to the dependency array

  // NEW: Function to create a new route for the current user
  const createRoute = useCallback(async (from, to) => {
    if (!currentUser) {
      console.error("No authenticated user to create a route.");
      return;
    }
    try {
      const userRouteCollection = collection(db, `users/${currentUser.uid}/routes`);
      await addDoc(userRouteCollection, {
        from,
        to,
        createdAt: new Date(),
      });
      console.log("Route document successfully added!");
    } catch (error) {
      console.error("Error creating route:", error);
      setError("Failed to create route.");
    }
  }, [currentUser]);

  // NEW: Function to get all routes for the current user
  const getRoutes = useCallback(async () => {
    if (!currentUser) return [];
    try {
      const q = query(collection(db, 'users', currentUser.uid, 'routes'));
      const querySnapshot = await getDocs(q);
      const routes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Routes fetched:', routes);
      return routes;
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Failed to fetch routes.'); // Set the error state
      return [];
    }
  }, [currentUser, setError]); // Add setError as a dependency

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const value = {
    currentUser,
    signInWithGoogle,
    logout,
    createRoute,
    getRoutes,
    loading,
    error,
    setError, // <-- Add setError here
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};