/**
 * Generate a simple hash for client-side API requests
 * Note: This is not cryptographically secure but provides basic request validation
 * @param timestamp - Current timestamp
 * @param regNumber - Registration number (optional)
 * @returns Object with timestamp and hash
 */
export function generateClientHash(timestamp?: string, regNumber?: string): { timestamp: string; hash: string } {
  const ts = timestamp || Date.now().toString();
  
  // Simple hash generation for client-side
  // In production, you might want to use a more sophisticated approach
  const data = `${ts}:${regNumber || ''}:client-salt`;
  
  // Convert to base64 for transmission
  const hash = btoa(data);
  
  return { timestamp: ts, hash };
}

/**
 * Create headers with authentication hash
 * @param regNumber - Registration number (optional)
 * @returns Headers object
 */
export function createAuthHeaders(regNumber?: string): Record<string, string> {
  const { timestamp, hash } = generateClientHash(undefined, regNumber);
  
  return {
    'X-Timestamp': timestamp,
    'X-Hash': hash,
    'Content-Type': 'application/json',
  };
}
