/**
 * Generate a hash for client-side API requests that matches server expectations
 * @param timestamp - Current timestamp
 * @param regNumber - Registration number (optional)
 * @returns Object with timestamp and hash
 */
export function generateClientHash(timestamp?: string, regNumber?: string): { timestamp: string; hash: string } {
  const ts = timestamp || Date.now().toString();
  
  // Add browser-specific data to make hash unique to your domain
  const domain = typeof window !== 'undefined' ? window.location.hostname : 'server';
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 20) : 'server';
  
  // Use a more complex hash that includes domain validation
  const data = `${ts}:${regNumber || ''}:${domain}:${userAgent}:client-key`;
  
  // Create a simple but consistent hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Add additional entropy
  const entropy = Math.abs(hash ^ ts.length ^ (regNumber?.length || 0));
  
  // Convert to base64 string for transmission
  const hashString = Math.abs(hash).toString(16).padStart(8, '0') + 
                     entropy.toString(16).padStart(4, '0') + 
                     ts.slice(-4);
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
