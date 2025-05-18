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
    console.log('📝 Registration request body:', body);
    
    // Validate required fields
    const requiredFields = ['username', 'email', 'password', 'role', 'firstName', 'lastName'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['property_manager', 'finance', 'ceo', 'assistant'];
    if (!validRoles.includes(body.role)) {
      console.log('❌ Invalid role:', body.role);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: body.email }, { username: body.username }]
    });

    if (existingUser) {
      console.log('❌ User already exists:', existingUser.email || existingUser.username);
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email or username already exists'
        },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Create user
    const user = await User.create({
      ...body,
      password: hashedPassword
    });

    console.log('✅ User created successfully:', user.username);

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
      message: 'User registered successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Registration error:', error);
    // Log the full error details
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