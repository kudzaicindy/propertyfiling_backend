import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import PropertyInsurance from '@/app/models/PropertyInsurance';
import CarInsurance from '@/app/models/CarInsurance';
import InsuranceCover from '@/app/models/InsuranceCover';

// GET /api/insurance
export async function GET() {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully!');

    // Fetch all insurance data in parallel
    const [propertyInsurance, carInsurance, insuranceCover] = await Promise.all([
      PropertyInsurance.find({}).sort({ startDate: -1 }),
      CarInsurance.find({}).sort({ startDate: -1 }),
      InsuranceCover.find({}).sort({ coverType: 1 })
    ]);

    console.log('📊 Insurance data found:', {
      propertyInsurance: propertyInsurance.length,
      carInsurance: carInsurance.length,
      insuranceCover: insuranceCover.length
    });

    return NextResponse.json({
      success: true,
      data: {
        propertyInsurance,
        carInsurance,
        insuranceCover
      },
      counts: {
        propertyInsurance: propertyInsurance.length,
        carInsurance: carInsurance.length,
        insuranceCover: insuranceCover.length
      }
    });
  } catch (error) {
    console.error('❌ Error fetching insurance data:', error);
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