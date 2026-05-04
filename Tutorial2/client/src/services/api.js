const API_BASE_URL = 'http://localhost:5000/api';

export const fetchAttendance = async () => {
  const response = await fetch(`${API_BASE_URL}/attendance`);
  if (!response.ok) {
    throw new Error('Failed to fetch attendance records');
  }
  return response.json();
};

export const addAttendance = async (record) => {
  const response = await fetch(`${API_BASE_URL}/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  });
  if (!response.ok) {
    throw new Error('Failed to add attendance record');
  }
  return response.json();
};

export const updateAttendance = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update attendance record');
  }
  return response.json();
};

export const deleteAttendance = async (id) => {
  const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete attendance record');
  }
  return response.json();
};

export const searchAttendance = async (query = '', status = 'All') => {
  const params = new URLSearchParams();
  if (query) params.append('search', query);
  if (status !== 'All') params.append('status', status);
  
  const response = await fetch(`${API_BASE_URL}/attendance/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to search attendance records');
  }
  return response.json();
};