'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, Auth, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { app } from './config';

interface FirebaseContextType {
  auth: Auth | null;
  db: Firestore | null;
  user: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  auth: null,
  db: null,
  user: null,
  loading: true,
});

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authInstance = getAuth(app);
    const dbInstance = getFirestore(app);
    setAuth(authInstance);
    setDb(dbInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ auth, db, user, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
export const useAuth = () => {
    const { auth, user, loading } = useFirebase();
    return { auth, user, loading };
}
export const useFirestore = () => useFirebase().db;
