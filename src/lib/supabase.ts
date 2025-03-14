import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    emailAuth: {
      requireEmailConfirmation: false
    }
  }
});

export const setupRealtimeSubscriptions = () => {
  const channel = supabase.channel('db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public'
      },
      (payload) => {
        console.log('Database change:', payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Payment addresses
export async function getPaymentAddresses() {
  try {
    const { data, error } = await supabase
      .from('payment_addresses')
      .select('*')
      .order('network');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching payment addresses:', error);
    return [];
  }
}

// Deposit transactions
export async function submitDepositTransaction(transaction: {
  asset: string;
  transaction_id: string;
  network: string;
  amount: number;
}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('deposit_transactions')
      .insert([{
        user_id: user.id,
        ...transaction,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting deposit:', error);
    throw error;
  }
}

// Membership transactions
export async function submitMembershipTransaction(transaction: {
  plan: string;
  transaction_id: string;
  network: string;
  amount: number;
}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('membership_transactions')
      .insert([{
        user_id: user.id,
        ...transaction,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting transaction:', error);
    throw error;
  }
}

// User management functions
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function getUserByUsername(username: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
}

export async function createUserProfile(userId: string, profile: {
  username: string;
  email: string;
  full_name?: string;
  transaction_password: string;
}) {
  try {
    await supabase.auth.updateUser({
      data: { email_confirmed: true }
    });

    const { error } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        ...profile,
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, updates: {
  full_name?: string;
  email?: string;
  transaction_password?: string;
}) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Holdings management
export async function getUserHoldings(userId: string) {
  try {
    const { data, error } = await supabase
      .from('holdings')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching holdings:', error);
    return [];
  }
}

export async function updateHolding(userId: string, symbol: string, quantity: number) {
  try {
    const { error } = await supabase
      .from('holdings')
      .upsert({
        user_id: userId,
        symbol,
        quantity,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,symbol'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating holding:', error);
    throw error;
  }
}

// Authentication functions
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        data: {
          email_confirmed: true
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          email_confirmed: true
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function checkSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error checking session:', error);
    return null;
  }
}