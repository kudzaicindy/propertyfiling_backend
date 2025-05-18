import mongoose from 'mongoose';

const InsuranceSchema = new mongoose.Schema({
  policyNumber: {
    type: String,
    required: true,
    unique: true,
  },
  provider: {
    type: String,
    required: true,
  },
  coverageType: {
    type: String,
    // e.g., Property, Liability, etc.
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  premiumAmount: {
    type: Number,
    required: true,
  },
  contactInfo: {
    type: String,
  },
  // Reference to the Property this insurance policy covers
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
});

const Insurance = mongoose.models.Insurance || mongoose.model('Insurance', InsuranceSchema);

export default Insurance; 