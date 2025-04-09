import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Session, User } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, data?: Record<string, any>) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  updateUserProfile: (data: Record<string, any>) => Promise<void>;
  isAdmin: () => Promise<boolean>;
}

interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseClient = useSupabaseClient<Database>();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    // Set the user based on the session
    setUser(session?.user || null);
    setLoading(false);
  }, [session]);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
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

  const signUp = async (email: string, password: string, data?: Record<string, any>): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...data,
          },
        },
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

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        console.error('Sign Out Error:', error);
      }

      setUser(null);
      router.push('/login'); // Redirect to login page after sign out
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
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

  const sendMagicLink = async (email: string): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabaseClient.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          redirectTo: window.location.origin,
        },
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

  const updateUserProfile = async (data: Record<string, any>): Promise<void> => {
    setLoading(true);
    try {
      if (!user) {
        console.error('No user to update.');
        return;
      }

      const { error } = await supabaseClient
        .from('profiles')
        .update(data)
        .eq('id', user.id);

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

  const isAdmin = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabaseClient
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
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
