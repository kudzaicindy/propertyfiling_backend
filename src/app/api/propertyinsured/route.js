import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import PropertyInsurance from '@/app/models/PropertyInsurance';
import { authMiddleware } from '@/app/middleware/auth';

// Apply auth middleware to all routes
export const middleware = [authMiddleware];

// GET /api/propertyinsured
export async function GET() {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');

    const propertyInsurance = await PropertyInsurance.find({}).sort({ startDate: -1 });

    console.log(`📊 Found ${propertyInsurance.length} property insurance records`);

    return NextResponse.json({
      success: true,
      data: propertyInsurance,
      count: propertyInsurance.length
    });
  } catch (error) {
    console.error('❌ Error fetching property insurance:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/propertyinsured
export async function POST(request) {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['propertyId', 'insuranceType', 'coverage', 'startDate', 'endDate', 'premium', 'status'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Validate field types and formats
    const validationErrors = [];
    
    if (typeof body.coverage !== 'number' || body.coverage <= 0) {
      validationErrors.push('Coverage must be a positive number');
    }
    
    if (typeof body.premium !== 'number' || body.premium <= 0) {
      validationErrors.push('Premium must be a positive number');
    }
    
    if (!body.startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      validationErrors.push('Start date must be in YYYY-MM-DD format');
    }
    
    if (!body.endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      validationErrors.push('End date must be in YYYY-MM-DD format');
    }
    
    if (new Date(body.startDate) >= new Date(body.endDate)) {
      validationErrors.push('End date must be after start date');
    }
    
    if (!['active', 'expired', 'cancelled'].includes(body.status)) {
      validationErrors.push('Status must be one of: active, expired, cancelled');
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      );
    }
    
    // Create new property insurance
    const propertyInsurance = await PropertyInsurance.create(body);
    
    console.log('✅ New property insurance created:', propertyInsurance.insuranceType);
    
    return NextResponse.json({
      success: true,
      data: propertyInsurance,
      message: 'Property insurance created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating property insurance:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/propertyinsured
export async function PUT(request) {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    const body = await request.json();
    
    if (!body._id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insurance ID is required'
        },
        { status: 400 }
      );
    }

    // Validate field types and formats if provided
    const validationErrors = [];
    
    if (body.coverage !== undefined && (typeof body.coverage !== 'number' || body.coverage <= 0)) {
      validationErrors.push('Coverage must be a positive number');
    }
    
    if (body.premium !== undefined && (typeof body.premium !== 'number' || body.premium <= 0)) {
      validationErrors.push('Premium must be a positive number');
    }
    
    if (body.startDate !== undefined && !body.startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      validationErrors.push('Start date must be in YYYY-MM-DD format');
    }
    
    if (body.endDate !== undefined && !body.endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      validationErrors.push('End date must be in YYYY-MM-DD format');
    }
    
    if (body.startDate && body.endDate && new Date(body.startDate) >= new Date(body.endDate)) {
      validationErrors.push('End date must be after start date');
    }
    
    if (body.status !== undefined && !['active', 'expired', 'cancelled'].includes(body.status)) {
      validationErrors.push('Status must be one of: active, expired, cancelled');
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      );
    }

    // Update property insurance
    const propertyInsurance = await PropertyInsurance.findByIdAndUpdate(
      body._id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!propertyInsurance) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property insurance not found'
        },
        { status: 404 }
      );
    }
    
    console.log('✅ Property insurance updated:', propertyInsurance.insuranceType);
    
    return NextResponse.json({
      success: true,
      data: propertyInsurance,
      message: 'Property insurance updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating property insurance:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE /api/propertyinsured
export async function DELETE(request) {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insurance ID is required'
        },
        { status: 400 }
      );
    }

    const propertyInsurance = await PropertyInsurance.findByIdAndDelete(id);

    if (!propertyInsurance) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property insurance not found'
        },
        { status: 404 }
      );
    }
    
    console.log('✅ Property insurance deleted:', propertyInsurance.insuranceType);
    
    return NextResponse.json({
      success: true,
      message: 'Property insurance deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting property insurance:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 