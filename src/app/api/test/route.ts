import { NextRequest, NextResponse } from 'next/server';
import { runApiDiagnostics, testApiEndpoint } from '@/utils/api-tester';

/**
 * API route to test connection and endpoints
 */
export async function GET(request: NextRequest) {
  try {
    // Get endpoint from query params
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');

    // If endpoint specified, test just that one
    if (endpoint) {
      const result = await testApiEndpoint(endpoint);
      return NextResponse.json(result);
    }

    // Otherwise run full diagnostics
    const results = await runApiDiagnostics();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
