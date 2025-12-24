'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onIdTokenChanged, Auth, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { app } from './config';

interface FirebaseContextType {
  auth: Auth | null;
  db: Firestore | null;
  user: User | null;
  isAdmin: boolean;
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

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const authInstance = getAuth(app);
    const dbInstance = getFirestore(app, 'legacydb');
    setAuth(authInstance);
    setDb(dbInstance);

    const unsubscribe = onIdTokenChanged(authInstance, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult();
        const userIsAdmin = tokenResult.claims.admin === true;

        setUser(firebaseUser);
        setIsAdmin(userIsAdmin);

        // If the user is on an admin route but is NOT an admin, sign them out.
        if (pathname.startsWith('/dashboard/admin') && !userIsAdmin) {
          toast.error('Access Denied. You do not have admin privileges.', { duration: 5000 });
          await authInstance.signOut();
        }

      } else {
        // User is logged out
        setUser(null);
        setIsAdmin(false);

        // If the user was on a protected admin route, redirect them to the login page.
        if (pathname.startsWith('/dashboard/admin')) {
          router.push('/login');
        }
        // We don't force a redirect for delegate pages, allowing them to see a login dialog.
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  return (
    <FirebaseContext.Provider value={{ auth, db, user, isAdmin, loading }}>
      <Toaster richColors position="bottom-right" />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
export const useAuth = () => useFirebase();
export const useFirestore = () => useFirebase().db;
