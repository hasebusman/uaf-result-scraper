import crypto from 'crypto';

const SECRET_KEY = process.env.SECRET_KEY || '';

/**
 * Generate HMAC-SHA256 hash for API request validation
 * @param timestamp - Current timestamp
 * @param regNumber - Registration number (optional)
 * @returns Base64 encoded hash
 */
export function generateHash(timestamp: string, regNumber?: string): string {
  const data = `${timestamp}:${regNumber || ''}:${SECRET_KEY}`;
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(data)
    .digest('base64');
}

/**
 * Validate HMAC-SHA256 hash from API request
 * @param receivedHash - Hash received from client
 * @param timestamp - Timestamp from client
 * @param regNumber - Registration number (optional)
 * @returns Boolean indicating if hash is valid
 */
export function validateHash(receivedHash: string, timestamp: string, regNumber?: string): boolean {
  try {
    const expectedHash = generateHash(timestamp, regNumber);
    const res = crypto.timingSafeEqual(
      Buffer.from(receivedHash, 'base64'),
      Buffer.from(expectedHash, 'base64')
    );
    console.log("serverHash", res)
    return res;
  } catch (error) {
    return false;
  }
}

/**
 * Check if timestamp is within acceptable range (5 minutes)
 * @param timestamp - Timestamp to validate
 * @returns Boolean indicating if timestamp is valid
 */
export function isTimestampValid(timestamp: string): boolean {
  const now = Date.now();
  const requestTime = parseInt(timestamp);
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

  return Math.abs(now - requestTime) <= fiveMinutes;
}

/**
 * Validate client-side hash (for browser requests)
 * @param receivedHash - Hash received from client
 * @param timestamp - Timestamp from client
 * @param regNumber - Registration number (optional)
 * @returns Boolean indicating if hash is valid
 */
export function validateClientHash(receivedHash: string, timestamp: string, regNumber?: string): boolean {
  try {
    // List of allowed domains for client hash validation
    const allowedDomains = ['localhost', 'uafcalculator.live', 'www.uafcalculator.live'];
    
    // Try validation with each allowed domain
    for (const domain of allowedDomains) {
      // Try with different user agent patterns (common browsers)
      const userAgentPatterns = ['server', 'Mozilla/5.0 (Windows', 'Mozilla/5.0 (Macintosh', 'Mozilla/5.0 (X11'];
      
      for (const userAgent of userAgentPatterns) {
        const data = `${timestamp}:${regNumber || ''}:${domain}:${userAgent}:client-key`;
        
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
          const char = data.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; 
        }
        
        const entropy = Math.abs(hash ^ timestamp.length ^ (regNumber?.length || 0));
        const hashString = Math.abs(hash).toString(16).padStart(8, '0') + 
                          entropy.toString(16).padStart(4, '0') + 
                          timestamp.slice(-4);
        const expectedHash = Buffer.from(hashString).toString('base64');
        
        try {
          if (crypto.timingSafeEqual(
            Buffer.from(receivedHash, 'base64'),
            Buffer.from(expectedHash, 'base64')
          )) {
            console.log("clientHash validated for domain:", domain);
            return true;
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    console.log("clientHash validation failed");
    return false;
  } catch (error) {
    console.error('Client hash validation error:', error);
    return false;
  }
}

/**
 * Generate client-side hash (for frontend)
 * @param timestamp - Current timestamp
 * @param regNumber - Registration number (optional)
 * @returns Object with timestamp and hash
 */
export function generateClientHash(timestamp?: string, regNumber?: string): { timestamp: string; hash: string } {
  const ts = timestamp || Date.now().toString();
  
  // Use server domain for server-side generation
  const domain = 'server';
  const userAgent = 'server';
  
  // Use the same algorithm as validateClientHash for consistency
  const data = `${ts}:${regNumber || ''}:${domain}:${userAgent}:client-key`;
  
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const entropy = Math.abs(hash ^ ts.length ^ (regNumber?.length || 0));
  const hashString = Math.abs(hash).toString(16).padStart(8, '0') + 
                     entropy.toString(16).padStart(4, '0') + 
                     ts.slice(-4);
  const finalHash = Buffer.from(hashString).toString('base64');

  return { timestamp: ts, hash: finalHash };
}
