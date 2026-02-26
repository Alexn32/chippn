import { supabase } from './supabase';

/**
 * Get current user's profile
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user.id) return null;

  const { data: user, error } = await supabase
    .from('users')
    .select()
    .eq('id', data.session.user.id)
    .single();

  if (error) throw error;
  return user;
}

/**
 * Get user's household (first one they're in)
 */
export async function getUserHousehold(userId: string) {
  const { data, error } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('user_id', userId)
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No household found
    }
    throw error;
  }

  const { data: household, error: householdError } = await supabase
    .from('households')
    .select()
    .eq('id', data.household_id)
    .single();

  if (householdError) throw householdError;
  return household;
}

/**
 * Get all household members with user details
 */
export async function getHouseholdMembers(householdId: string) {
  const { data, error } = await supabase
    .from('household_members')
    .select(`
      id,
      household_id,
      user_id,
      joined_at,
      users (id, display_name, email)
    `)
    .eq('household_id', householdId);

  if (error) throw error;
  return data || [];
}

/**
 * Get user's assigned chores
 */
export async function getUserChores(userId: string, householdId: string) {
  const { data, error } = await supabase
    .from('chore_assignments')
    .select(`
      id,
      chore_id,
      assigned_to,
      due_date,
      status,
      completion_count,
      completed_at,
      photo_verified,
      chores (id, name, description, frequency, requires_photo, photo_guidance)
    `)
    .eq('assigned_to', userId)
    .order('due_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get all household chores with assignment info
 */
export async function getHouseholdChores(householdId: string) {
  const { data, error } = await supabase
    .from('chores')
    .select(`
      id,
      name,
      description,
      frequency,
      assignment_type,
      assigned_to,
      requires_photo,
      created_at,
      users (display_name)
    `)
    .eq('household_id', householdId);

  if (error) throw error;
  return data || [];
}

/**
 * Create a new chore
 */
export async function createChore(
  householdId: string,
  name: string,
  description: string,
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly',
  assignmentType: 'single' | 'rotating',
  assignedTo: string | null,
  requiresPhoto: boolean,
  photoGuidance: string | null
) {
  const { data, error } = await supabase
    .from('chores')
    .insert([{
      household_id: householdId,
      name,
      description,
      frequency,
      assignment_type: assignmentType,
      assigned_to: assignedTo,
      requires_photo: requiresPhoto,
      photo_guidance: photoGuidance,
    }])
    .select()
    .single();

  if (error) throw error;

  // If rotating, assignment will be handled separately when members are available
  // For now, just create the chore

  return data;
}

/**
 * Mark chore as complete
 */
export async function completeChore(
  assignmentId: string,
  photoUrl?: string,
  photoVerified?: boolean
) {
  const { data, error } = await supabase
    .from('chore_assignments')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      photo_url: photoUrl,
      photo_verified: photoVerified,
    })
    .eq('id', assignmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get household chat messages
 */
export async function getHouseholdMessages(householdId: string, limit = 50) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(`
      id,
      household_id,
      sender_id,
      message,
      is_anonymous,
      created_at,
      users (display_name)
    `)
    .eq('household_id', householdId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ? data.reverse() : [];
}

/**
 * Send a chat message
 */
export async function sendMessage(
  householdId: string,
  senderId: string,
  message: string,
  isAnonymous: boolean
) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{
      household_id: householdId,
      sender_id: senderId,
      message,
      is_anonymous: isAnonymous,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Save notification token
 */
export async function saveNotificationToken(
  userId: string,
  token: string,
  deviceType: 'ios' | 'android'
) {
  const { data, error } = await supabase
    .from('notification_tokens')
    .upsert([{
      user_id: userId,
      token,
      device_type: deviceType,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Upload photo to storage
 */
export async function uploadChorePhoto(
  householdId: string,
  assignmentId: string,
  photoUri: string
) {
  try {
    // Read file from URI
    const response = await fetch(photoUri);
    if (!response.ok) {
      throw new Error('Failed to read photo file');
    }
    const blob = await response.blob();

    const fileName = `${householdId}/${assignmentId}-${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from('chore-photos')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
      });

    if (error) throw error;
    if (!data) throw new Error('No upload response');

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('chore-photos')
      .getPublicUrl(data.path);

    if (!publicUrl.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return publicUrl.publicUrl;
  } catch (error) {
    console.error('Photo upload error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload photo');
  }
}
