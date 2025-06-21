import crypto from 'crypto';

const SECRET_KEY = process.env.SECRET_KEY || '';
const CLIENT_AUTH_SECRET = process.env.CLIENT_AUTH_SECRET || 'uaf-client-auth';
const TIMESTAMP_VALIDITY_MINUTES = parseInt(process.env.TIMESTAMP_VALIDITY_MINUTES || '5');
const HASH_PADDING_LENGTH = parseInt(process.env.HASH_PADDING_LENGTH || '8');

/**
 * @param timestamp 
 * @param regNumber 
 * @returns 
 */
export function generateHash(timestamp: string, regNumber?: string): string {
  const data = `${timestamp}:${regNumber || ''}:${SECRET_KEY}`;
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(data)
    .digest('base64');
}

/**
 * @param receivedHash 
 * @param timestamp 
 * @param regNumber
 * @returns
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
 * @param timestamp 
 * @returns 
 */
export function isTimestampValid(timestamp: string): boolean {
  const now = Date.now();
  const requestTime = parseInt(timestamp);
  const validityWindow = TIMESTAMP_VALIDITY_MINUTES * 60 * 1000;

  return Math.abs(now - requestTime) <= validityWindow;
}

/**
 * @param receivedHash 
 * @param timestamp 
 * @param regNumber 
 * @returns 
 */
export function validateClientHash(receivedHash: string, timestamp: string, regNumber?: string): boolean {
  try {


    const data = `${timestamp}:${regNumber || ''}:${CLIENT_AUTH_SECRET}`;

    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    const hashString = Math.abs(hash).toString(16).padStart(HASH_PADDING_LENGTH, '0') + timestamp.slice(-4);
    const expectedHash = Buffer.from(hashString).toString('base64');

    try {
      const isValid = crypto.timingSafeEqual(
        Buffer.from(receivedHash, 'base64'),
        Buffer.from(expectedHash, 'base64')
      );

      if (isValid) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('Buffer comparison failed:', e);
      return false;
    }
  } catch (error) {
    console.error('Client hash validation error:', error);
    return false;
  }
}

/**
 * @param timestamp 
 * @param regNumber 
 * @returns
 */
export function generateClientHash(timestamp?: string, regNumber?: string): { timestamp: string; hash: string } {
  const ts = timestamp || Date.now().toString();

  const data = `${ts}:${regNumber || ''}:${CLIENT_AUTH_SECRET}`;

  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const hashString = Math.abs(hash).toString(16).padStart(HASH_PADDING_LENGTH, '0') + ts.slice(-4);
  const finalHash = Buffer.from(hashString).toString('base64');

  return { timestamp: ts, hash: finalHash };
}
