import React, { useState } from 'react';

const AttendanceList = ({ records, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditStatus(record.status);
  };

  const handleSave = (id) => {
    onUpdate(id, editStatus);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditStatus('');
  };

  return (
    <div className="attendance-list card">
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Roll Number</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              <td>{record.studentName}</td>
              <td>{record.rollNumber}</td>
              <td>{record.date}</td>
              <td>
                {editingId === record.id ? (
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                ) : (
                  <span className={`status ${record.status.toLowerCase()}`}>{record.status}</span>
                )}
              </td>
              <td>
                {editingId === record.id ? (
                  <>
                    <button onClick={() => handleSave(record.id)} className="btn btn-small btn-success">Save</button>
                    <button onClick={handleCancel} className="btn btn-small btn-secondary">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(record)} className="btn btn-small btn-primary">Edit</button>
                    <button onClick={() => onDelete(record.id)} className="btn btn-small btn-danger">Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {records.length === 0 && <p className="no-records">No attendance records found.</p>}
    </div>
  );
};

export default AttendanceList;