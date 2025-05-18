import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  propertyRef: {
    type: String,
    required: true,
    unique: true,
  },
  propertyName: {
    type: String,
    required: true,
  },
  // You might want to add a reference to the Assets associated with this property later
  // assets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }],
});

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

export default Property; 