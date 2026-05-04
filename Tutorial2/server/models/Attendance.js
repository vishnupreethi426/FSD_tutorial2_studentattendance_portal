const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Present', 'Absent']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);