import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Household {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  joined_at: string;
  user?: {
    display_name: string;
    email: string;
  };
}

interface HouseholdContextType {
  household: Household | null;
  members: HouseholdMember[];
  loading: boolean;
  error: string | null;
  createHousehold: (name: string) => Promise<Household>;
  joinHousehold: (inviteCode: string) => Promise<void>;
  leaveHousehold: () => Promise<void>;
  fetchHousehold: (householdId: string) => Promise<void>;
  fetchMembers: (householdId: string) => Promise<void>;
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createHousehold = useCallback(async (name: string): Promise<Household> => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      const inviteCode = generateInviteCode();

      const { data, error: insertError } = await supabase
        .from('households')
        .insert([{
          name,
          invite_code: inviteCode,
          created_by: user.id,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Add creator as member
      const { error: memberError } = await supabase
        .from('household_members')
        .insert([{
          household_id: data.id,
          user_id: user.id,
        }]);

      if (memberError) throw memberError;

      setHousehold(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create household';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const joinHousehold = useCallback(async (inviteCode: string) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      const { data: householdData, error: fetchError } = await supabase
        .from('households')
        .select()
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (fetchError) throw new Error('Invalid invite code');

      const { error: memberError } = await supabase
        .from('household_members')
        .insert([{
          household_id: householdData.id,
          user_id: user.id,
        }]);

      if (memberError) throw memberError;

      setHousehold(householdData);
      await fetchMembers(householdData.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join household';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const leaveHousehold = useCallback(async () => {
    if (!user || !household) throw new Error('Invalid state');

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('household_members')
        .delete()
        .eq('household_id', household.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHousehold(null);
      setMembers([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to leave household';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, household]);

  const fetchHousehold = useCallback(async (householdId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('households')
        .select()
        .eq('id', householdId)
        .single();

      if (fetchError) throw fetchError;

      setHousehold(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch household';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMembers = useCallback(async (householdId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('household_members')
        .select(`
          id,
          household_id,
          user_id,
          joined_at,
          user:users(display_name, email)
        `)
        .eq('household_id', householdId);

      if (fetchError) throw fetchError;

      setMembers(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch members';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <HouseholdContext.Provider
      value={{
        household,
        members,
        loading,
        error,
        createHousehold,
        joinHousehold,
        leaveHousehold,
        fetchHousehold,
        fetchMembers,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const context = useContext(HouseholdContext);
  if (context === undefined) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }
  return context;
}
