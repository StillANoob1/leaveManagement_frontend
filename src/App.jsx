import React from 'react';
import { BrowserRouter, Route,Routes  } from "react-router-dom"
import UserForm from './components/userForm/UserForm';
import Dashboard from './components/dashboard/Dashboard';
import LeaveForm from './components/leaveForm/LeaveForm';
import {Toaster} from "react-hot-toast";

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Toaster/>
      <Routes>
        <Route path='/' element={<UserForm/>}/>
        <Route path='/dashboard/:id' element={<Dashboard/>}/>
        <Route path='/apply' element={<LeaveForm/>}/>
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App