import mongoose from 'mongoose';

const insuranceCoverSchema = new mongoose.Schema({
  coverId: {
    type: String,
    required: true,
  },
  coverType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverageAmount: {
    type: Number,
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
  collection: 'insuredcover'
});

const InsuranceCover = mongoose.models.InsuranceCover || mongoose.model('InsuranceCover', insuranceCoverSchema);

export default InsuranceCover; 