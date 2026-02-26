import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export interface VerificationResult {
  verified: boolean;
  reason: string;
  confidence: number;
}

export async function verifyPhotoWithClaude(
  photoUri: string,
  photoGuidance?: string
): Promise<VerificationResult> {
  try {
    // Read image file and convert to base64
    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Determine image media type
    const extension = photoUri.split('.').pop()?.toLowerCase();
    let mediaType = 'image/jpeg';
    if (extension === 'png') {
      mediaType = 'image/png';
    } else if (extension === 'gif') {
      mediaType = 'image/gif';
    } else if (extension === 'webp') {
      mediaType = 'image/webp';
    }

    // Prepare Claude prompt
    const prompt = photoGuidance
      ? `Please verify if this photo shows: ${photoGuidance}\n\nAnswer with ONLY a JSON object in this format:\n{"verified": true/false, "reason": "brief explanation"}`
      : `Please verify if this photo shows evidence of a completed chore/task. The task should appear clean, organized, or completed.\n\nAnswer with ONLY a JSON object in this format:\n{"verified": true/false, "reason": "brief explanation"}`;

    // Call Claude API
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );

    // Parse response
    const content = response.data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return {
        verified: false,
        reason: 'Could not parse verification response',
        confidence: 0,
      };
    }

    const result = JSON.parse(jsonMatch[0]);
    
    return {
      verified: result.verified === true,
      reason: result.reason || 'No reason provided',
      confidence: result.confidence || (result.verified ? 0.9 : 0.5),
    };
  } catch (error) {
    console.error('Claude verification error:', error);
    
    // Fallback: assume verified if Claude fails (user can manually override)
    return {
      verified: true,
      reason: 'Verification service unavailable - assuming verified',
      confidence: 0.3,
    };
  }
}
