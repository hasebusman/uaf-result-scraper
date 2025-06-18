import { NextRequest, NextResponse } from 'next/server';
import { validateHash, validateClientHash, isTimestampValid } from './crypto';

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

const BLOCKED_ORIGINS = process.env.BLOCKED_ORIGINS
  ? process.env.BLOCKED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

export function corsMiddleware(request: NextRequest): { isAllowed: boolean; corsHeaders: Record<string, string> } {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

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

  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);
  const isAllowedReferer = referer && ALLOWED_ORIGINS.some(allowedOrigin =>
    referer.startsWith(allowedOrigin)
  );

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
  error: string,
  status: number = 400,
  corsHeaders: Record<string, string> = {}
) {
  return NextResponse.json({ status: 'error', message: error }, {
    status,
    headers: corsHeaders
  });
}

export function validateApiRequest(request: NextRequest, regNumber?: string): { isValid: boolean; error?: string } {
  const timestamp = request.headers.get('x-timestamp');
  const hash = request.headers.get('x-hash');

  if (!timestamp || !hash) {
    return { isValid: false, error: 'Missing authentication headers' };
  }

  if (!isTimestampValid(timestamp)) {
    return { isValid: false, error: 'Request timestamp expired' };
  }

  if (validateClientHash(hash, timestamp, regNumber)) {
    return { isValid: true };
  }

  if (validateHash(hash, timestamp, regNumber)) {
    return { isValid: true };
  }

  return { isValid: false, error: 'Invalid authentication hash' };
}
