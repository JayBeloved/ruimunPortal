'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onIdTokenChanged, Auth, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { app } from './config';

interface FirebaseContextType {
  auth: Auth | null;
  db: Firestore | null;
  user: User | null;
  isAdmin: boolean; // Add isAdmin state
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  auth: null,
  db: null,
  user: null,
  isAdmin: false,
  loading: true,
});

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authInstance = getAuth(app);
    const dbInstance = getFirestore(app, 'legacydb');
    setAuth(authInstance);
    setDb(dbInstance);

    // Use onIdTokenChanged to listen for token refreshes
    const unsubscribe = onIdTokenChanged(authInstance, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Get the ID token and check for the custom claim
        const tokenResult = await firebaseUser.getIdTokenResult();
        const userIsAdmin = tokenResult.claims.admin === true;

        if (userIsAdmin) {
          setUser(firebaseUser);
          setIsAdmin(true);
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };
          Cookies.set('user', JSON.stringify(userData), { expires: 7 });
        } else {
          // If the user is logged in but not an admin, sign them out.
          await authInstance.signOut();
          // State will be cleared in the 'else' block below
        }
      } else {
        // User is logged out
        setUser(null);
        setIsAdmin(false);
        Cookies.remove('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ auth, db, user, isAdmin, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
export const useAuth = () => {
  const { auth, user, isAdmin, loading } = useFirebase();
  return { auth, user, isAdmin, loading };
}
export const useFirestore = () => useFirebase().db;
