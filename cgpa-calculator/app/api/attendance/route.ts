import { NextRequest, NextResponse } from 'next/server';
import { scraper } from '@/lib/scraper';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const regNumber = searchParams.get('reg_number');

    if (!regNumber) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Registration number is required' 
      }, { status: 400 });
    }

    const attendanceData = await scraper.getAttendanceData(regNumber);
    
    return NextResponse.json({
      status: 'success',
      data: attendanceData
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}
