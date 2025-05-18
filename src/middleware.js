import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin') || 'http://localhost:5173';

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400', // 24 hours
      },
    });
  }

  // For non-preflight requests, add CORS headers
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/api/auth/:path*',
    '/api/insuredcars/:path*',
    '/api/propertyinsured/:path*',
    '/api/insuredcover/:path*'
  ]
}; 