import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function GET(request) {
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
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token'
        },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found'
        },
        { status: 404 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Account is deactivated'
        },
        { status: 401 }
      );
    }

    // Return user data
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    });
  } catch (error) {
    console.error('❌ Error verifying user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication failed'
      },
      { status: 401 }
    );
  }
} 