import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import InsuranceCover from '@/app/models/InsuranceCover';
import { authMiddleware } from '@/app/middleware/auth';

// Apply auth middleware to all routes
export const middleware = [authMiddleware];

// GET /api/insuredcover
export async function GET() {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');

    const insuranceCover = await InsuranceCover.find({}).sort({ coverType: 1 });

    console.log(`📊 Found ${insuranceCover.length} insurance cover records`);

    return NextResponse.json({
      success: true,
      data: insuranceCover,
      count: insuranceCover.length
    });
  } catch (error) {
    console.error('❌ Error fetching insurance cover:', error);
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

// POST /api/insuredcover
export async function POST(request) {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['coverId', 'coverType', 'description', 'coverageAmount', 'premium', 'status'];
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
    
    if (typeof body.coverageAmount !== 'number' || body.coverageAmount <= 0) {
      validationErrors.push('Coverage amount must be a positive number');
    }
    
    if (typeof body.premium !== 'number' || body.premium <= 0) {
      validationErrors.push('Premium must be a positive number');
    }
    
    if (body.description.length < 10) {
      validationErrors.push('Description must be at least 10 characters long');
    }
    
    if (!['active', 'inactive'].includes(body.status)) {
      validationErrors.push('Status must be either active or inactive');
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
    
    // Create new insurance cover
    const insuranceCover = await InsuranceCover.create(body);
    
    console.log('✅ New insurance cover created:', insuranceCover.coverType);
    
    return NextResponse.json({
      success: true,
      data: insuranceCover,
      message: 'Insurance cover created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating insurance cover:', error);
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

// PUT /api/insuredcover
export async function PUT(request) {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    const body = await request.json();
    
    if (!body._id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cover ID is required'
        },
        { status: 400 }
      );
    }

    // Validate field types and formats if provided
    const validationErrors = [];
    
    if (body.coverageAmount !== undefined && (typeof body.coverageAmount !== 'number' || body.coverageAmount <= 0)) {
      validationErrors.push('Coverage amount must be a positive number');
    }
    
    if (body.premium !== undefined && (typeof body.premium !== 'number' || body.premium <= 0)) {
      validationErrors.push('Premium must be a positive number');
    }
    
    if (body.description !== undefined && body.description.length < 10) {
      validationErrors.push('Description must be at least 10 characters long');
    }
    
    if (body.status !== undefined && !['active', 'inactive'].includes(body.status)) {
      validationErrors.push('Status must be either active or inactive');
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

    // Update insurance cover
    const insuranceCover = await InsuranceCover.findByIdAndUpdate(
      body._id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!insuranceCover) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insurance cover not found'
        },
        { status: 404 }
      );
    }
    
    console.log('✅ Insurance cover updated:', insuranceCover.coverType);
    
    return NextResponse.json({
      success: true,
      data: insuranceCover,
      message: 'Insurance cover updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating insurance cover:', error);
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

// DELETE /api/insuredcover
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
          error: 'Cover ID is required'
        },
        { status: 400 }
      );
    }

    const insuranceCover = await InsuranceCover.findByIdAndDelete(id);

    if (!insuranceCover) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insurance cover not found'
        },
        { status: 404 }
      );
    }
    
    console.log('✅ Insurance cover deleted:', insuranceCover.coverType);
    
    return NextResponse.json({
      success: true,
      message: 'Insurance cover deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting insurance cover:', error);
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