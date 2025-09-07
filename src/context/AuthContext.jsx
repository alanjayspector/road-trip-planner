// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [createUserDocument]);

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
  }, []);

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

  const getRoutes = useCallback(async () => {
    if (!currentUser) return [];
    try {
      const q = query(collection(db, "users", currentUser.uid, "routes"));
      const querySnapshot = await getDocs(q);
      const routes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Routes fetched:", routes);
      return routes;
    } catch (error) {
      console.error("Error fetching routes:", error);
      setError("Failed to fetch routes.");
      return [];
    }
  }, [currentUser, setError]);

  const deleteRoute = useCallback(async (routeId) => {
    if (!currentUser) return;
    try {
      const routeDocRef = doc(db, "users", currentUser.uid, "routes", routeId);
      await deleteDoc(routeDocRef);
      console.log("Route document successfully deleted!");
    } catch (error) {
      console.error("Error deleting route:", error);
      setError("Failed to delete route.");
    }
  }, [currentUser, setError]);

  // NEW: Functions for Activities
  const createActivity = useCallback(async (routeId, activityData) => {
    if (!currentUser) return;
    try {
      const activitiesCollection = collection(
        db,
        "users",
        currentUser.uid,
        "routes",
        routeId,
        "activities"
      );
      await addDoc(activitiesCollection, activityData);
      console.log("Activity successfully created!");
    } catch (error) {
      console.error("Error creating activity:", error);
      setError("Failed to create activity.");
    }
  }, [currentUser]);

  const getActivities = useCallback(async (routeId) => {
    if (!currentUser) return [];
    try {
      const activitiesCollection = collection(
        db,
        "users",
        currentUser.uid,
        "routes",
        routeId,
        "activities"
      );
      const q = query(activitiesCollection);
      const querySnapshot = await getDocs(q);
      const activities = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Activities fetched:", activities);
      return activities;
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to fetch activities.");
      return [];
    }
  }, [currentUser]);

  const deleteActivity = useCallback(async (routeId, activityId) => {
    if (!currentUser) return;
    try {
      const activityDocRef = doc(
        db,
        "users",
        currentUser.uid,
        "routes",
        routeId,
        "activities",
        activityId
      );
      await deleteDoc(activityDocRef);
      console.log("Activity successfully deleted!");
    } catch (error) {
      console.error("Error deleting activity:", error);
      setError("Failed to delete activity.");
    }
  }, [currentUser]);

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
    deleteRoute,
    createActivity, // <-- Add new functions to context
    getActivities,
    deleteActivity,
    loading,
    error,
    setError,
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
export default AuthProvider;