import mongoose from 'mongoose';

const MaintenanceTaskSchema = new mongoose.Schema({
  issue: {
    type: String,
    required: true,
  },
  requestedBy: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  financial: {
    amount: { type: Number },
    laborCost: { type: Number },
    financeNotes: { type: String },
  },
  assignment: {
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceStaff' },
    dateAssigned: { type: Date },
    expectedCompletion: { type: Date },
  },
  notesAndHistory: [
    {
      timestamp: { type: Date, default: Date.now },
      note: { type: String },
    },
  ],
  // You might want to add a reference to the Property this task is for later
  // property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
});

const MaintenanceTask = mongoose.models.MaintenanceTask || mongoose.model('MaintenanceTask', MaintenanceTaskSchema);

export default MaintenanceTask; 