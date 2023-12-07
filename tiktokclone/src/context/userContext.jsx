import { createContext, useState, useEffect, useContext } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

const UserContext = createContext();

export function UserProvider({ children }) {
  const firestore = getFirestore();
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDocRef = doc(firestore, 'users', authUser.uid);
        try {
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            setUser({
              id: docSnapshot.id,
              ref: docSnapshot.ref,
              ...docSnapshot.data(),
            });
          }
        } catch (error) {
          console.error('Error fetching user', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [firestore]);

  return (
    <UserContext.Provider value={[user, isLoading]}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useAuthUser must be used with UserContext.Provider');
  }

  return context;
}
