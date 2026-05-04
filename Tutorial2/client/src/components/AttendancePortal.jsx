import React, { useState, useEffect } from 'react';
import AttendanceList from './AttendanceList';
import AddAttendanceForm from './AddAttendanceForm';
import { fetchAttendance, addAttendance, updateAttendance, deleteAttendance, searchAttendance } from '../services/api';

const AttendancePortal = ({ user, onLogout }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const records = await fetchAttendance();
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (newRecord) => {
    try {
      await addAttendance(newRecord);
      await loadAttendance(); // Refresh list
    } catch (error) {
      console.error('Error adding attendance:', error);
    }
  };

  const handleUpdate = async (id, status) => {
    try {
      await updateAttendance(id, status);
      await loadAttendance(); // Refresh list
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteAttendance(id);
        await loadAttendance(); // Refresh list
      } catch (error) {
        console.error('Error deleting attendance:', error);
      }
    }
  };

  useEffect(() => {
    const applyFilter = async () => {
      if (searchQuery.trim() === '' && statusFilter === 'All') {
        await loadAttendance();
      } else {
        try {
          const results = await searchAttendance(searchQuery, statusFilter);
          setAttendanceRecords(results);
        } catch (error) {
          console.error('Search error:', error);
          await loadAttendance();
        }
      }
    };

    const debounceTimer = setTimeout(applyFilter, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, statusFilter]);

  return (
    <div className="attendance-portal">
      <header className="header">
        <div className="header-content">
          <h1>Students Attendance Portal</h1>
          <div className="user-info">
            <span>Welcome, Admin ({user.email})</span>
            <button onClick={onLogout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </header>
      <main className="main-content">
        <div className="container attendance-grid">
          <div className="form-column">
            <AddAttendanceForm onAdd={handleAdd} />
          </div>
          <div className="attendance-section">
            <div className="records-header">
              <h2>Attendance Records</h2>
              <div className="search-panel">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or roll number"
                />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AttendanceList
                records={attendanceRecords}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendancePortal;