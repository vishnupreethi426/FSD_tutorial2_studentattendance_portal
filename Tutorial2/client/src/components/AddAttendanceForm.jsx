import React, { useState } from 'react';

const AddAttendanceForm = ({ onAdd }) => {
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Present');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = studentName.trim();
    const trimmedRoll = rollNumber.trim();

    if (!trimmedName || !trimmedRoll || !date) {
      setError('Please fill in all fields before submitting.');
      return;
    }

    if (!/^[0-9]+$/.test(trimmedRoll)) {
      setError('Roll number must be a valid numeric value.');
      return;
    }

    setError('');
    onAdd({ studentName: trimmedName, rollNumber: trimmedRoll, date, status });
    setStudentName('');
    setRollNumber('');
    setDate('');
    setStatus('Present');
  };

  return (
    <div className="add-attendance-form card">
      <h3>Add New Attendance Record</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter student name"
          />
        </div>
        <div className="form-group">
          <label>Roll Number:</label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="Enter roll number"
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-success">Add Record</button>
      </form>
    </div>
  );
};

export default AddAttendanceForm;