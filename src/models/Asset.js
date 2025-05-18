import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  propertyName: {
    type: String,
    required: true,
  },
  assetAtProperty: {
    type: String,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  // Reference to the Property this asset belongs to
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
});

const Asset = mongoose.models.Asset || mongoose.model('Asset', AssetSchema);

export default Asset; 