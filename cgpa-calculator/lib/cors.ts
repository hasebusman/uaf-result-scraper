import { NextRequest, NextResponse } from 'next/server';
import { validateHash, validateClientHash, isTimestampValid } from './crypto';

// Add your allowed origins here
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://uafcalculator.live', // Replace with your actual domain
  'https://www.uafcalculator.live', // Replace with your actual domain
  // Add any other domains you want to allow
];

export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Check if the request is from an allowed origin
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);
  const isAllowedReferer = referer && ALLOWED_ORIGINS.some(allowedOrigin =>
    referer.startsWith(allowedOrigin)
  );

  const allowRequest = isAllowedOrigin || isAllowedReferer;

  return {
    isAllowed: allowRequest,
    corsHeaders: {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Timestamp, X-Hash',
      'Access-Control-Max-Age': '86400',
    }
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS',
    }
  });
}

export function validateApiRequest(request: NextRequest, regNumber?: string): { isValid: boolean; error?: string } {
  const timestamp = request.headers.get('x-timestamp');
  const hash = request.headers.get('x-hash');


  if (!timestamp || !hash) {
    return { isValid: false, error: 'This website Sucks. Please visit uafcalculator.live ' };
  }

  if (!isTimestampValid(timestamp)) {
    return { isValid: false, error: 'This website Sucks. Please visit uafcalculator.live' };
  }

  // Try client hash validation first (for browser requests)
  if (validateClientHash(hash, timestamp, regNumber)) {
    return { isValid: true };
  }

  // Fallback to server hash validation (for server-to-server requests with SECRET_KEY)
  if (validateHash(hash, timestamp, regNumber)) {
    return { isValid: true };
  }

  return { isValid: false, error: 'This website Sucks. Please visit uafcalculator.live' };
}
