import { NextRequest, NextResponse } from 'next/server';
import { validateHash, validateClientHash, isTimestampValid } from './crypto';

// Add your allowed origins here
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://uafcalculator.live',
  'https://www.uafcalculator.live',
];

// Blocked domains/origins
const BLOCKED_ORIGINS = [
  'https://thecgpacalculator.com',
  'http://thecgpacalculator.com',
  'https://www.thecgpacalculator.com',
  'http://www.thecgpacalculator.com',
];
const ErrorMessage = `This website Sucks 😐. Please visit uafcalculator.live`;

export function corsMiddleware(request: NextRequest): { isAllowed: boolean; corsHeaders: Record<string, string> } {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Check if the request is from a blocked origin
  const isBlockedOrigin = origin && BLOCKED_ORIGINS.some(blocked => 
    origin.includes(blocked.replace(/https?:\/\//, ''))
  );
  const isBlockedReferer = referer && BLOCKED_ORIGINS.some(blocked =>
    referer.includes(blocked.replace(/https?:\/\//, ''))
  );

  if (isBlockedOrigin || isBlockedReferer) {
    return {
      isAllowed: false,
      corsHeaders: {}
    };
  }

  // Check if the request is from an allowed origin
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);
  const isAllowedReferer = referer && ALLOWED_ORIGINS.some(allowedOrigin =>
    referer.startsWith(allowedOrigin)
  );

  // For same-origin requests (no origin header), check referer
  const isSameOrigin = !origin && referer && ALLOWED_ORIGINS.some(allowedOrigin =>
    referer.startsWith(allowedOrigin)
  );

  const allowRequest = Boolean(isAllowedOrigin || isAllowedReferer || isSameOrigin);

  return {
    isAllowed: allowRequest,
    corsHeaders: allowRequest ? {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin! : '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Timestamp, X-Hash',
      'Access-Control-Max-Age': '86400',
    } : {}
  };
}

export function createCorsResponse(
  data: any,
  status: number = 200,
  corsHeaders: Record<string, string>
) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders
  });
}

export function createCorsErrorResponse(
  message: string = 'Access denied',
  status: number = 403
) {
  const htmlContent = `
   This website Sucks. Please visit uafcalculator.live
  `;

  return new NextResponse(htmlContent, {
    status,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  });
}

export function validateApiRequest(request: NextRequest, regNumber?: string): { isValid: boolean; error?: string } {
  const timestamp = request.headers.get('x-timestamp');
  const hash = request.headers.get('x-hash');

  if (!timestamp || !hash) {
    return { isValid: false, error: ErrorMessage };
  }

  if (!isTimestampValid(timestamp)) {
    return { isValid: false, error: ErrorMessage };
  }

  // Try client hash validation first (for browser requests)
  if (validateClientHash(hash, timestamp, regNumber)) {
    return { isValid: true };
  }

  // Fallback to server hash validation (for server-to-server requests with SECRET_KEY)
  if (validateHash(hash, timestamp, regNumber)) {
    return { isValid: true };
  }

  return { isValid: false, error: ErrorMessage };
}
