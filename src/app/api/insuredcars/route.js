import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import CarInsurance from '@/app/models/CarInsurance';
import { authMiddleware } from '@/app/middleware/auth';

// Apply auth middleware to all routes
export const middleware = [authMiddleware];

// GET /api/insuredcars
export async function GET() {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');

    const carInsurance = await CarInsurance.find({}).sort({ createdAt: -1 });

    console.log(`📊 Found ${carInsurance.length} car insurance records`);

    return NextResponse.json({
      success: true,
      data: carInsurance,
      count: carInsurance.length
    });
  } catch (error) {
    console.error('❌ Error fetching car insurance:', error);
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

// POST /api/insuredcars
export async function POST(request) {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'carRef',
      'carDetails',
      'responsiblePerson',
      'insurance',
      'amountInsured',
      'monthlyPayment',
      'nextPaymentDate',
      'termlyPremium',
      'yearlyPremium'
    ];
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
    
    if (typeof body.amountInsured !== 'number' || body.amountInsured <= 0) {
      validationErrors.push('Amount insured must be a positive number');
    }
    
    if (typeof body.monthlyPayment !== 'number' || body.monthlyPayment <= 0) {
      validationErrors.push('Monthly payment must be a positive number');
    }
    
    if (typeof body.termlyPremium !== 'number' || body.termlyPremium <= 0) {
      validationErrors.push('Termly premium must be a positive number');
    }
    
    if (typeof body.yearlyPremium !== 'number' || body.yearlyPremium <= 0) {
      validationErrors.push('Yearly premium must be a positive number');
    }
    
    if (!body.nextPaymentDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      validationErrors.push('Next payment date must be in YYYY-MM-DD format');
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
    
    // Create new car insurance
    const carInsurance = await CarInsurance.create(body);
    
    console.log('✅ New car insurance created:', carInsurance.carRef);
    
    return NextResponse.json({
      success: true,
      data: carInsurance,
      message: 'Car insurance created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating car insurance:', error);
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

// PUT /api/insuredcars
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
    
    if (body.amountInsured !== undefined && (typeof body.amountInsured !== 'number' || body.amountInsured <= 0)) {
      validationErrors.push('Amount insured must be a positive number');
    }
    
    if (body.monthlyPayment !== undefined && (typeof body.monthlyPayment !== 'number' || body.monthlyPayment <= 0)) {
      validationErrors.push('Monthly payment must be a positive number');
    }
    
    if (body.termlyPremium !== undefined && (typeof body.termlyPremium !== 'number' || body.termlyPremium <= 0)) {
      validationErrors.push('Termly premium must be a positive number');
    }
    
    if (body.yearlyPremium !== undefined && (typeof body.yearlyPremium !== 'number' || body.yearlyPremium <= 0)) {
      validationErrors.push('Yearly premium must be a positive number');
    }
    
    if (body.nextPaymentDate !== undefined && !body.nextPaymentDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      validationErrors.push('Next payment date must be in YYYY-MM-DD format');
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

    // Update car insurance
    const carInsurance = await CarInsurance.findByIdAndUpdate(
      body._id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!carInsurance) {
      return NextResponse.json(
        {
          success: false,
          error: 'Car insurance not found'
        },
        { status: 404 }
      );
    }
    
    console.log('✅ Car insurance updated:', carInsurance.carRef);
    
    return NextResponse.json({
      success: true,
      data: carInsurance,
      message: 'Car insurance updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating car insurance:', error);
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

// DELETE /api/insuredcars
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

    const carInsurance = await CarInsurance.findByIdAndDelete(id);

    if (!carInsurance) {
      return NextResponse.json(
        {
          success: false,
          error: 'Car insurance not found'
        },
        { status: 404 }
      );
    }
    
    console.log('✅ Car insurance deleted:', carInsurance.carRef);
    
    return NextResponse.json({
      success: true,
      message: 'Car insurance deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting car insurance:', error);
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