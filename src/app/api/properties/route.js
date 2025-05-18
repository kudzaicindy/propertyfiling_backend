import { NextResponse } from 'next/server';
import Property from '@/app/models/Property';
import connectDB from '@/app/lib/mongodb';
import mongoose from 'mongoose';
import { authMiddleware } from '@/app/middleware/auth';

// Apply auth middleware to all routes
export const middleware = [authMiddleware];

// GET /api/properties
export async function GET(request) {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    const properties = await Property.find().sort({ createdAt: -1 });
    console.log(`📊 Found ${properties.length} properties`);
    
    // Get user role from request
    const userRole = request.user?.role;
    console.log('👤 User role:', userRole);
    
    return NextResponse.json({
      success: true,
      data: properties,
      userRole
    });
  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/properties
export async function POST(request) {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    // Check if user is property manager
    if (request.user?.role !== 'property_manager') {
      console.log('❌ Unauthorized: User is not a property manager');
      return NextResponse.json(
        { success: false, error: 'Only property managers can create properties' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log('📝 Creating new property:', body);
    
    const property = await Property.create(body);
    console.log('✅ Property created successfully:', property._id);
    
    return NextResponse.json({
      success: true,
      data: property,
      message: 'Property created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating property:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/properties
export async function PUT(request) {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    // Check if user is property manager
    if (request.user?.role !== 'property_manager') {
      console.log('❌ Unauthorized: User is not a property manager');
      return NextResponse.json(
        { success: false, error: 'Only property managers can update properties' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log('📝 Updating property:', body);
    
    const { _id, ...updateData } = body;
    console.log('🔄 Update data:', updateData);
    
    const property = await Property.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!property) {
      console.log('❌ Property not found:', _id);
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    console.log('✅ Property updated successfully:', property._id);
    return NextResponse.json({
      success: true,
      data: property,
      message: 'Property updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating property:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/properties
export async function DELETE(request) {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    // Check if user is property manager
    if (request.user?.role !== 'property_manager') {
      console.log('❌ Unauthorized: User is not a property manager');
      return NextResponse.json(
        { success: false, error: 'Only property managers can delete properties' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('🗑️ Deleting property:', id);
    
    const property = await Property.findByIdAndDelete(id);
    
    if (!property) {
      console.log('❌ Property not found:', id);
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    console.log('✅ Property deleted successfully:', id);
    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting property:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 