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
    console.log("res", res)
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
 * Generate client-side hash (for frontend)
 * @param timestamp - Current timestamp
 * @param regNumber - Registration number (optional)
 * @returns Object with timestamp and hash
 */
export function generateClientHash(timestamp?: string, regNumber?: string): { timestamp: string; hash: string } {
  const ts = timestamp || Date.now().toString();
  // Note: In production, you might want to use a different approach for client-side hashing
  // This is a simplified version for demonstration
  const data = `${ts}:${regNumber || ''}`;
  const hash = Buffer.from(data).toString('base64');

  return { timestamp: ts, hash };
}
