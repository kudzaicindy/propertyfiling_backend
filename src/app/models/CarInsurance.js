import mongoose from 'mongoose';

const carInsuranceSchema = new mongoose.Schema({
  carRef: {
    type: String,
    required: true,
  },
  carDetails: {
    type: String,
    required: true,
  },
  responsiblePerson: {
    type: String,
    required: true,
  },
  insurance: {
    type: String,
    required: true,
  },
  amountInsured: {
    type: Number,
    required: true,
  },
  monthlyPayment: {
    type: Number,
    required: true,
  },
  nextPaymentDate: {
    type: Date,
    required: true,
  },
  termlyPremium: {
    type: Number,
    required: true,
  },
  yearlyPremium: {
    type: Number,
    required: true,
  }
}, {
  collection: 'insuredcars',
  timestamps: true
});

const CarInsurance = mongoose.models.CarInsurance || mongoose.model('CarInsurance', carInsuranceSchema);

export default CarInsurance; 