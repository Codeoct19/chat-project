import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { apiRequest } from '../../utils/APIUtils';
import { PaginatedTable } from "../../utils/tablePagination/PaginatedTable";
const DashbordPage = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ id: "", fname: "", lname: "", email: "" });
  const [errors, setErrors] = useState({ fname: "", lname: "", email: "" });

  const handleShow = () => setShow(true);
  const fetchurl = async () => {
    try {
      const token = localStorage.getItem('loggedInUser');
      const method = 'GET';
      const endpoint = '/user/userlist';
      const response = await apiRequest(method, endpoint, '', token);
      const { result } = response.data;
      setUsers(result);
    }
    catch (error) { console.error("Error fetching user data:", error); }
  }
  useEffect(() => {
    fetchurl();
  }, []);
  const handleEdit = async (user) => {
    setFormData({
      id: user.id,
      fname: user.first_name,
      lname: user.last_name,
      email: user.email
    });
    handleShow();
  }
  const handleChange = (event) => {
    const { name, value } = event.target;
    let errorMessage = '';
    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      errorMessage = !value ? 'Email is required' : (!emailPattern.test(value) ? 'Invalid email format' : '');
    }
    else if (name === 'fname' || name === 'lname') {
      errorMessage = !value ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required` : (value.trim().length < 3 ? `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least 3 characters long` : '');
    }
    setErrors({ ...errors, [name]: errorMessage });
    setFormData({ ...formData, [name]: value });
  }
  const handleUpdate = async (event) => {
    event.preventDefault();
    const Error = Object.values(errors).some(error => error !== '');
    if (Error) return;
    Swal.fire({
      title: 'Are you sure?',
      text: 'User details Update!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const method = 'POST';
        const data = formData;
        const endpoint = '/user/editUser';
        await apiRequest(method, endpoint, data);
        fetchurl();
        handleClose();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        fetchurl();
        handleClose();
      }
    });
  }
  const handleDelete = async (userId) => {
    let id = { id: userId }
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: 'User data delete',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const method = 'POST';
          const data = id;
          const endpoint = '/user/delete';
          await apiRequest(method, endpoint, data);
          fetchurl();
          handleClose();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          fetchurl();
          handleClose();
        }
      });
    }
    catch (error) { console.error("Error fetching user data:", error); }
  }
  const handleClose = () => {
    setErrors({ ...errors, fname: "", lname: "", email: "" });
    setShow(false);
  }
  return (
    <div className="container d-flex justify-content-center flex-nowrap flex-row w-100">
      <div className="d-flex justify-content-center flex-nowrap flex-row w-100">
        <PaginatedTable data = {users} itemsPerPage = {6} handleEdit={handleEdit} handleDelete={handleDelete} action={'user'} />
        <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-black">Update User</h5>
                <close_m_btn type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                  <span aria-hidden="true">&times;</span>
                </close_m_btn>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>First Name:</label>
                    <input type="text" className="form-control" name="fname" value={formData.fname} onChange={handleChange} />
                    {errors.fname && <div className="text-danger">{errors.fname}</div>}
                  </div>
                  <div className="form-group">
                    <label>Last Name:</label>
                    <input type="text" className="form-control" name="lname" value={formData.lname} onChange={handleChange} />
                    {errors.lname && <div className="text-danger">{errors.lname}</div>}
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                <button type="button" className="btn btn-primary top-update-btn" id="updateButtonTop" onClick={handleUpdate}>Update</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DashbordPage;
