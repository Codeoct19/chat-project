// Logout.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Context } from '../context/Context';
import { IoLogOut } from "react-icons/io5";
function Logout () {
  const navigate = useNavigate();
  const { logout } = useContext(Context);
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User Logout',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/');
      }
    });
  };
  return (
    <IoLogOut onClick={handleLogout} />
  );
};

export default Logout;
