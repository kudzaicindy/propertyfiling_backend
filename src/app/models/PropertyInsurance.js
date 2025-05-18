import mongoose from 'mongoose';

const propertyInsuranceSchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: true,
  },
  insuranceType: {
    type: String,
    required: true,
  },
  coverage: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  premium: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  }
}, {
  collection: 'propertyinsured'
});

const PropertyInsurance = mongoose.models.PropertyInsurance || mongoose.model('PropertyInsurance', propertyInsuranceSchema);

export default PropertyInsurance; 