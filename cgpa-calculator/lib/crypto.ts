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
    // Recreate the client-side hash algorithm
    const data = `${timestamp}:${regNumber || ''}:client-key`;
    
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; 
    }
    
    const hashString = Math.abs(hash).toString(16).padStart(8, '0') + timestamp.slice(-4);
    const expectedHash = Buffer.from(hashString).toString('base64');
    
    const res=  crypto.timingSafeEqual(
      Buffer.from(receivedHash, 'base64'),
      Buffer.from(expectedHash, 'base64')
    );
    console.log("clientHash", res)
    return res;
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
  
  // Use the same algorithm as validateClientHash for consistency
  const data = `${ts}:${regNumber || ''}:client-key`;
  
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const hashString = Math.abs(hash).toString(16).padStart(8, '0') + ts.slice(-4);
  const finalHash = Buffer.from(hashString).toString('base64');

  return { timestamp: ts, hash: finalHash };
}
