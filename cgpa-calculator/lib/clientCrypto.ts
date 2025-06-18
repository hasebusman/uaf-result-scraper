/**
 * Generate a hash for client-side API requests that matches server expectations
 * @param timestamp - Current timestamp
 * @param regNumber - Registration number (optional)
 * @returns Object with timestamp and hash
 */
export function generateClientHash(timestamp?: string, regNumber?: string): { timestamp: string; hash: string } {
  const ts = timestamp || Date.now().toString();
  
  // Use a simplified hash that can be validated on server
  // This creates a deterministic hash without requiring crypto libraries on client
  const data = `${ts}:${regNumber || ''}:client-key`;
  
  // Create a simple but consistent hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to base64 string for transmission
  const hashString = Math.abs(hash).toString(16).padStart(8, '0') + ts.slice(-4);
  const finalHash = btoa(hashString);
  
  return { timestamp: ts, hash: finalHash };
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
