import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../../utils/serverUrl';
import './userForm.scss';
import { toast } from 'react-hot-toast';

const UserForm = () => {
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username: username,
      department: department,
    };

    setLoading(true);

    try {
      const res = await axios.post(`${serverUrl}/create/user`, userData);
      console.log(res.data);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(`/dashboard/${res.data.user._id}`);
    } catch (error) {
      console.error('Error saving user data:', error);
      toast.error(error.response.data.message);
    }

    setLoading(false); 
  };

  return (
    <>
      <div className="userForm">
        <div className="heading">
          <h2>Leave Application System</h2>
        </div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <br />
            <div className="input">
              <label>Department:</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
                <option value="Accounting">Accounting</option>
              </select>
            </div>
            <br />
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserForm;
