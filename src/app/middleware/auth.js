import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

// Define role permissions
const ROLE_PERMISSIONS = {
  'property_manager': ['GET', 'POST', 'PUT', 'DELETE'],
  'finance': ['GET'],
  'ceo': ['GET'],
  'assistant': ['GET']
};

export async function authMiddleware(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'No token provided'
        },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'No token provided'
        },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.role) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token'
        },
        { status: 401 }
      );
    }

    // Get the request method
    const method = request.method;
    
    // Check if the user's role has permission for this method
    const allowedMethods = ROLE_PERMISSIONS[decoded.role] || [];
    
    if (!allowedMethods.includes(method)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Insufficient permissions'
        },
        { status: 403 }
      );
    }

    // Create a new request with user info
    const newRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: request.redirect,
      signal: request.signal,
      credentials: request.credentials,
      cache: request.cache,
      integrity: request.integrity,
      keepalive: request.keepalive,
      mode: request.mode,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      user: {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email
      }
    });

    // Return the modified request
    return NextResponse.next({
      request: newRequest
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication failed'
      },
      { status: 401 }
    );
  }
} 