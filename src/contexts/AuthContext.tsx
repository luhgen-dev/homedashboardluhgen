import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Safety timeout: If auth doesn't resolve in 8 seconds, force loading to false
    // This prevents the app from being stuck on "Loading..." in restrictive environments like iPad iframes
    const timer = setTimeout(() => {
      if (loading) {
        console.warn('Auth initialization timed out. Forcing loading to false.');
        setLoading(false);
      }
    }, 8000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('[AuthContext] Auth state changed:', !!currentUser);
      clearTimeout(timer);
      try {
        if (currentUser) {
          // Ensure user profile exists in Firestore
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            // Create new user profile
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || 'User',
              photoURL: currentUser.photoURL || '',
              role: 'user', // Default role
            });
          }
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    setError(null);
    
    // Check if we are likely in an iframe on an iPad/Safari
    const isIPad = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
    const isIframe = window.self !== window.top;

    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Error logging in:', err);
      
      if (err.code === 'auth/popup-blocked') {
        setError('The sign-in popup was blocked. Please allow popups or open the app in a new tab.');
      } else if (err.code === 'auth/network-request-failed' || err.code === 'auth/internal-error') {
        if (isIPad && isIframe) {
          setError('iPad Safari blocks login inside iframes. Please click "Open in new tab" at the top right to sign in.');
        } else {
          setError('Connection issue. Please try opening the app in a new tab.');
        }
      } else {
        setError(`Sign-in failed: ${err.message}. Try opening in a new tab.`);
      }
    }
  };

  const clearError = () => setError(null);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};
