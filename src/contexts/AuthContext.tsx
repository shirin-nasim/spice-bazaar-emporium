
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type User = any;
type Session = any;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; error: any }>;
  signUp: (email: string, password: string, data?: any) => Promise<{ user: User | null; session: Session | null; error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
  isAdmin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session and set the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign In Error:', error);
        return { user: null, session: null, error };
      }

      setUser(data.user);
      return { user: data.user, session: data.session, error: null };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, data?: any) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { ...data }
        }
      });

      if (authError) {
        console.error('Sign Up Error:', authError);
        return { user: null, session: null, error: authError };
      }

      setUser(authData.user);
      return { user: authData.user, session: authData.session, error: null };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign Out Error:', error);
      }
      setUser(null);
      // We don't need router.push here, we'll handle navigation after logout in components
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        emailRedirectTo: `${window.location.origin}/update-password`
      });

      if (error) {
        console.error('Reset Password Error:', error);
        alert('Could not send reset password email.');
      } else {
        alert('Reset password email sent!');
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMagicLink = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Send Magic Link Error:', error);
        alert('Could not send magic link.');
      } else {
        alert('Magic link sent!');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: any) => {
    setLoading(true);
    try {
      if (!user) {
        console.error('No user to update.');
        return;
      }

      const { error } = await supabase.from('profiles').update(data).eq('id', user.id);

      if (error) {
        console.error('Update User Error:', error);
        alert('Could not update user profile.');
      } else {
        alert('User profile updated!');
      }
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = async () => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    sendMagicLink,
    updateUserProfile,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
