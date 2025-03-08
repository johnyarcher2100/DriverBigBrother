import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  supabase, 
  signUpWithEmail, 
  signInWithEmail, 
  signInWithProvider, 
  signOut, 
  getCurrentUser 
} from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean, error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean, error?: string }>;
  signInWithSocial: (provider: 'google' | 'facebook' | 'apple') => Promise<{ success: boolean, error?: string }>;
  logout: () => Promise<{ success: boolean, error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for active session on mount
    const checkUser = async () => {
      try {
        setLoading(true);
        const { user, error } = await getCurrentUser();
        
        if (error) {
          throw error;
        }
        
        setUser(user);
      } catch (err: any) {
        console.error('Error checking auth status:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      // Clean up subscription
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      const { error } = await signUpWithEmail(email, password, metadata);
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Error signing up:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await signInWithEmail(email, password);
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithSocial = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setLoading(true);
      const { error } = await signInWithProvider(provider);
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (err: any) {
      console.error(`Error signing in with ${provider}:`, err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      return { success: true };
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithSocial,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
