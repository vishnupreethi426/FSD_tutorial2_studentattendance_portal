const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const Admin = require('./models/Admin');
const Attendance = require('./models/Attendance');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://vishnupreethi084_db_user:Admin%23123@cluster0.z24k1rk.mongodb.net/?appName=Cluster0';

let useMongoDB = false;
let admins = [
  { id: 1, name: 'Default Admin', email: 'admin@example.com', password: 'admin' },
];
let attendanceRecords = [
  { id: 1, studentName: 'John Doe', rollNumber: '101', date: '2023-05-01', status: 'Present' },
  { id: 2, studentName: 'Jane Smith', rollNumber: '102', date: '2023-05-01', status: 'Absent' },
  { id: 3, studentName: 'Bob Johnson', rollNumber: '103', date: '2023-05-01', status: 'Present' },
];
let nextAdminId = 2;
let nextAttendanceId = 4;

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB Atlas');
  useMongoDB = true;
  // Seed initial data
  seedInitialData();
})
.catch((error) => {
  console.error('MongoDB connection failed, using in-memory storage:', error.message);
  console.log('Server will run with in-memory data storage');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Seed initial data
async function seedInitialData() {
  try {
    // Check if default admin exists
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      const defaultAdmin = new Admin({
        name: 'Default Admin',
        email: 'admin@example.com',
        password: 'admin'
      });
      await defaultAdmin.save();
      console.log('Default admin created');
    }

    // Check if attendance records exist
    const attendanceCount = await Attendance.countDocuments();
    if (attendanceCount === 0) {
      const initialAttendance = [
        { studentName: 'John Doe', rollNumber: '101', date: '2023-05-01', status: 'Present' },
        { studentName: 'Jane Smith', rollNumber: '102', date: '2023-05-01', status: 'Absent' },
        { studentName: 'Bob Johnson', rollNumber: '103', date: '2023-05-01', status: 'Present' },
      ];

      await Attendance.insertMany(initialAttendance);
      console.log('Initial attendance records created');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Auth routes
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (useMongoDB) {
      const admin = await Admin.findOne({ email, password });
      if (admin) {
        res.json({ email: admin.email, name: admin.name, role: 'admin' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      const admin = admins.find(a => a.email === email && a.password === password);
      if (admin) {
        res.json({ email: admin.email, name: admin.name, role: 'admin' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (useMongoDB) {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const newAdmin = new Admin({ name, email, password });
      await newAdmin.save();

      res.status(201).json({ message: 'Admin registered successfully' });
    } else {
      const existingAdmin = admins.find(a => a.email === email);
      if (existingAdmin) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const newAdmin = {
        id: nextAdminId++,
        name,
        email,
        password,
      };

      admins.push(newAdmin);
      res.status(201).json({ message: 'Admin registered successfully' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Attendance routes
app.get('/api/attendance', async (req, res) => {
  try {
    if (useMongoDB) {
      const attendanceRecords = await Attendance.find().sort({ createdAt: -1 });
      res.json(attendanceRecords);
    } else {
      res.json(attendanceRecords);
    }
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/attendance/search', async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = search ? search.toLowerCase() : '';
    const statusFilter = status && status !== 'All' ? status : null;

    if (useMongoDB) {
      let searchQuery = {};
      if (query) {
        searchQuery = {
          $or: [
            { studentName: { $regex: query, $options: 'i' } },
            { rollNumber: { $regex: query, $options: 'i' } }
          ]
        };
      }
      if (statusFilter) {
        searchQuery.status = statusFilter;
      }

      const results = await Attendance.find(searchQuery).sort({ createdAt: -1 });
      res.json(results);
    } else {
      let results = attendanceRecords;
      if (query) {
        results = results.filter(record =>
          record.studentName.toLowerCase().includes(query) ||
          record.rollNumber.toLowerCase().includes(query)
        );
      }
      if (statusFilter) {
        results = results.filter(record => record.status === statusFilter);
      }
      res.json(results);
    }
  } catch (error) {
    console.error('Error searching attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { studentName, rollNumber, date, status } = req.body;
    if (!studentName || !rollNumber || !date || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (useMongoDB) {
      const newRecord = new Attendance({ studentName, rollNumber, date, status });
      await newRecord.save();
      res.status(201).json(newRecord);
    } else {
      const newRecord = {
        id: nextAttendanceId++,
        studentName,
        rollNumber,
        date,
        status,
      };
      attendanceRecords.push(newRecord);
      res.status(201).json(newRecord);
    }
  } catch (error) {
    console.error('Error adding attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/attendance/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    if (useMongoDB) {
      const updatedRecord = await Attendance.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );

      if (!updatedRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }

      res.json(updatedRecord);
    } else {
      const recordIndex = attendanceRecords.findIndex(record => record.id === parseInt(req.params.id));
      if (recordIndex === -1) {
        return res.status(404).json({ error: 'Record not found' });
      }

      attendanceRecords[recordIndex].status = status;
      res.json(attendanceRecords[recordIndex]);
    }
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/attendance/:id', async (req, res) => {
  try {
    if (useMongoDB) {
      const deletedRecord = await Attendance.findByIdAndDelete(req.params.id);

      if (!deletedRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }

      res.json(deletedRecord);
    } else {
      const recordIndex = attendanceRecords.findIndex(record => record.id === parseInt(req.params.id));
      if (recordIndex === -1) {
        return res.status(404).json({ error: 'Record not found' });
      }

      const deletedRecord = attendanceRecords.splice(recordIndex, 1)[0];
      res.json(deletedRecord);
    }
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});