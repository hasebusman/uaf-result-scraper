import { NextRequest, NextResponse } from 'next/server';
import { scraper } from '@/lib/scraper';
import { corsMiddleware, createCorsResponse, createCorsErrorResponse, validateApiRequest } from '@/lib/cors';

// Force Node.js runtime (required for Playwright)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  const { isAllowed, corsHeaders } = corsMiddleware(request);
  
  if (!isAllowed) {
    return createCorsErrorResponse('Unauthorized access - invalid origin');
  }
  
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  // Debug: Log incoming request and query params
  console.debug('Incoming GET /api/result request', {
    url: request.url,
    searchParams: Object.fromEntries(request.nextUrl.searchParams.entries())
  });

  const { isAllowed, corsHeaders } = corsMiddleware(request);
  
  if (!isAllowed) {
    return createCorsErrorResponse('Unauthorized access - invalid origin');
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const regNumber = searchParams.get('reg_number');

    if (!regNumber) {
      return createCorsResponse({ 
        status: 'error', 
        message: 'Registration number is required' 
      }, 400, corsHeaders);
    }

    // Validate API request hash
    const { isValid, error } = validateApiRequest(request, regNumber);
    console.debug('API Request Validation', { isValid, error });
    if (!isValid) {
      return createCorsResponse({
        status: 'error',
        message: error || 'Invalid request authentication'
      }, 401, corsHeaders);
    }

    const regNumberPattern = /^\d{4}-ag-\d{1,6}$/i;
    if (!regNumberPattern.test(regNumber)) {
      return createCorsResponse({
        status: 'error',
        message: 'Invalid registration number format'
      }, 400, corsHeaders);
    }

    const result = await scraper.getResult(regNumber);
    console.log('Scraped Result:', result);
    
    // Check that the response structure is valid
    if (!result.student_info || !result.result_table || !result.result_table.rows) {
      console.error('Invalid result structure:', result);
      return createCorsResponse({ 
        status: 'error', 
        message: 'Invalid result data structure' 
      }, 500, corsHeaders);
    }
    
    return createCorsResponse({
      status: 'success',
      data: {
        metadata: result.metadata,
        student_info: result.student_info,
        result_table: result.result_table
      }
    }, 200, corsHeaders);
  } catch (error) {
    console.error('API Error:', error);
    return createCorsResponse({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Internal server error'
    }, 500, corsHeaders);
  }
}
