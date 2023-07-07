import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../../utils/serverUrl';
import './leaveForm.scss';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const LeaveForm = () => {
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [localStorageUser, setLocalStorageUser] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${serverUrl}/users`);
        setUsers(res.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setLocalStorageUser(user.username);
    }
  }, []);

  const handleUsernameChange = (e) => {
    const selectedUser = users.find((user) => user.username === e.target.value);
    if (selectedUser) {
      setUsername(selectedUser.username);
      setDepartment(selectedUser.department);
      if (selectedUser.username !== localStorageUser) {
        setUsername('');
        setDepartment('');
        toast.error('You can only apply leave for yourself.');
      }
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const calculateDurationInDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return durationInDays;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const duration = calculateDurationInDays();

    const leaveData = {
      username,
      department,
      leaveType,
      duration,
    };

    setLoading(true);

    try {
      const res = await axios.post(`${serverUrl}/create/leave`, leaveData);
      const route = res.data.user._id;
      navigate(`/dashboard/${route}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="leaveForm">
        <div className="heading">
          <h2>Leave Application</h2>
        </div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input">
              <label>Username:</label>
              <select value={username} onChange={handleUsernameChange}>
                <option value="">Select Username</option>
                {users.map((user) => (
                  <option key={user._id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            <br />
            <div className="input">
              <label>Department:</label>
              <input type="text" value={department} disabled />
            </div>
            <br />
            <div className="input">
              <label>Leave Type:</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="">Select Leave Type</option>
                <option value="casual">casual</option>
                <option value="sick">sick</option>
              </select>
            </div>
            <br />
            <div className="input">
              <label>Start Date:</label>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
            </div>
            <br />
            <div className="input">
              <label>End Date:</label>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
            </div>
            <br />
            <div className="input">
              <label>Duration (in days):</label>
              <input type="number" value={calculateDurationInDays()} disabled />
            </div>
            <br />
            <button type="submit" disabled={loading}>
              {loading ? 'Applying Leave...' : 'Apply Leave'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LeaveForm;
