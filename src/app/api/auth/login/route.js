import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(request) {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    const body = await request.json();
    console.log('📝 Login request body:', body);
    
    // Validate required fields
    if (!body.email || !body.password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required'
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: body.email });
    console.log('🔍 Looking for user with email:', body.email);

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials'
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account is deactivated');
      return NextResponse.json(
        {
          success: false,
          error: 'Account is deactivated'
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(body.password, user.password);
    console.log('🔑 Password verification:', isValidPassword ? 'successful' : 'failed');

    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials'
        },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log('✅ User logged in successfully:', user.username);

    // Generate JWT token
    const token = sign(
      { 
        id: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        }
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
} 