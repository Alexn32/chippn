import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { supabase } from './supabase';

export interface VerificationResult {
  verified: boolean;
  reason: string;
  confidence: number;
}

export async function verifyPhotoWithClaude(
  photoUri: string,
  choreTitle?: string
): Promise<VerificationResult> {
  try {
    // Read image file and convert to base64
    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Call Supabase Edge Function (Claude API key stays server-side)
    const { data, error } = await supabase.functions.invoke('verify-chore', {
      body: {
        imageBase64: base64,
        choreTitle: choreTitle || 'Completed Chore',
      },
    });

    if (error) {
      console.error('Verification error:', error);
      return {
        verified: true,
        reason: 'Verification service unavailable - assuming verified',
        confidence: 0.3,
      };
    }

    return {
      verified: data.verified === true,
      reason: data.reasoning || 'No reason provided',
      confidence: data.confidence === 'high' ? 0.9 : data.confidence === 'medium' ? 0.6 : 0.3,
    };
  } catch (error) {
    console.error('Photo verification error:', error);
    
    // Fallback: assume verified if service fails (user can manually override)
    return {
      verified: true,
      reason: 'Verification service unavailable - assuming verified',
      confidence: 0.3,
    };
  }
}
