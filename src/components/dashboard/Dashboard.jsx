import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader';
import { serverUrl } from '../../utils/serverUrl';
import "./dashboard.scss";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/user/${id}`);
        setUser(res.data);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  const totalLeavesLeft = user?.casualLeaves + user?.sickLeaves;
  const totalAppliedLeaves = user?.totalLeaves - totalLeavesLeft;

  const handleApplyLeave = () => {
    navigate('/apply');
  };

  return (
    <>
      <div className='dashboard'>
        <div className="up">
          <h2>Welcome to the Dashboard</h2>
          <button onClick={handleApplyLeave}>Apply Leave</button>
        </div>
        <div className="bottom">
          <h1>hi ,  {user?.username}</h1>
          <div className="leave">
          <div className="leaveleft">
            <p>Total Leaves Left:   {totalLeavesLeft}</p>
            <p>Casual Leaves Left:   {user?.casualLeaves}</p>
            <p>Sick Leaves Left:   {user?.sickLeaves}</p>
          </div>
          <div className="appliedleave">
            <p>Total Applied Leaves: {totalAppliedLeaves}</p>
            <p>Applied Casual Leaves: {2 - user?.casualLeaves}</p>
            <p>Applied Sick Leaves: {2 - user?.sickLeaves}</p>
          </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
