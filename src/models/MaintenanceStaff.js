import mongoose from 'mongoose';

const MaintenanceStaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // You might want to add validation for email format later
  },
  speciality: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    enum: ['Available', 'Occupied', 'Out of Office'], // Example availability statuses
    default: 'Available',
  },
  // You might want to add a reference to the tasks assigned to this staff member later
  // assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceTask' }],
});

const MaintenanceStaff = mongoose.models.MaintenanceStaff || mongoose.model('MaintenanceStaff', MaintenanceStaffSchema);

export default MaintenanceStaff; 