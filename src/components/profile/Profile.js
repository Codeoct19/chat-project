import axios from "axios";
import { Footer } from "flowbite-react";
import React, { useState , useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Profile.css'; 
import Swal from "sweetalert2";
import { GoPencil } from "react-icons/go";
import { Context } from "../context/Context";
import {apiRequest} from "../../utils/APIUtils";
import { socket } from "../../Socket";

const ProfilePage = () => {
  const navigate = useNavigate(); 
  const [editModal, setEditModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState([]); 
  const [errors, setErrors] = useState({fname: "", lname: "", email: ""})
  const [image, setImage] = useState({img: '', user_id: ''});
  const [editData, setEditData] = useState({ fname: "", lname: "", email: ""});
  const [showUploadImg, setShowUploadImg] = useState(false);
  const {Img} = useContext(Context);
  const tok = localStorage.getItem('access_token');
  useEffect(() => {
    if (tok == null) { navigate('/'); } 
    if(socket.connected){socket.disconnect()}
  }, [tok]);

  const fetchData = async () => {
    try {
    const token = localStorage.getItem('loggedInUser');
    const method = 'GET';
    const endpoint = '/user/userlist';
    const response = await apiRequest(method, endpoint, '', token);
    const { profile, loggedInUser } = response.data;
    setUserData(JSON.parse(loggedInUser));
    setData(profile[0]);
    Img(profile[0].image);
    setEditData({ id: profile[0].id, fname: profile[0].first_name, lname: profile[0].last_name, email: profile[0].email });

    } catch (error) {
    console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleChange = (event) =>{
    const {name, value} = event.target;
    let errorMessage = '';
    if(name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(value === ''){
        errorMessage = 'Email is required';
      } else if(!emailPattern.test(value)){
        errorMessage = 'Invalid email format';
      }  
    } else if(name === 'fname' || name === 'lname'){
      if(value === ''){
        errorMessage = `${name} is required`;
      }else if (value.trim().length < 3) {
        errorMessage = `${name} must be at least 3 characters long`;
      }
    }
    setErrors({...errors, [name]: errorMessage});
    setEditData({...editData, [name]: value});
  }
  
  const handleEdit = () => {
    setEditModal(true);
  }   
  const handleSubmit = async(e) =>{
    e.preventDefault();
    if (errors.fname === '' && errors.lname === '' && errors.email === '') {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: 'User details Update!',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then(async (result) => {
          if (result.isConfirmed) {
            console.log('editData of profile Page....', editData);
            const data = editData;
            const method = 'POST';
            const endpoint = '/user/editUser';
            await apiRequest(method, endpoint, data);
            fetchData();
            setEditModal(false);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            fetchData();
            setEditModal(false);
          }
        });
      } catch (error) {
        console.log('Error for edit api: ', error);
      }
    }
  }
  if (!userData) { return(<div>Loading...</div>)}
  const handleClose = () =>{ 
    setErrors({...errors, fname: '', lname: '', email: ''});
    setEditModal(false); 
    fetchData();
  }
  const handleFile = (e) =>{
    const user_id = userData.userid;
    const img = e.target.files[0];
    setImage({img, user_id});
  }
  const handleUpload = async() =>{
    const formData = new FormData();
    formData.append('image', image.img);
    formData.append('user_id', image.user_id);
    try {
      const response = await axios.post('http://localhost:8080/userImg/image', formData, {
       headers: { 'Content-Type': 'multipart/form-data'}
      });
      if (response.status === 200) {
        fetchData();
        setShowUploadImg(false);
        const {image} = response.data;
        Img(image);
      }else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  return(
  <>
    <div className="main-container">
      <div className="container d-flex justify-content-center flex-nowrap flex-row shadow-sm">
        <div className="d-flex justify-content-center flex-nowrap flex-row image-content w-50">
          <div className="profile-logo w-100 align-items-center">
            <div>
              <h1>Profile</h1>
            </div>
            <div className="d-flex flex-row-reverse align-items-start">
              <img alt="upload_file" title="Usuario" src={data.image ? `http://localhost:8080/userImg/images/${data.image}` : 'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg'} className="img-circle img" />
            </div>
            <div className="d-flex flex-icon-text">
              <p className="flex-item-text">image</p>
              <GoPencil className="edit-icon" onClick={() => setShowUploadImg(true)} />
            </div>
            <div className={`modalDialog ${showUploadImg ? 'd-block' : 'd-none'} bg-custom`}>
              <div className="mb-3 p-30">
                <input type="file" name="file" className="form-control" onChange={handleFile} />
                <div className="modal-footer mt-20">
                  <button type="button" className="btn btn-secondary m-12" onClick={(() => setShowUploadImg(false))} >Close</button>
                  <button type="button" className="btn btn-primary top-update-btn" onClick={handleUpload}>Upload</button>
                </div>
              </div>        
            </div>
            <div className="d-flex">
              <div className="d-flex">
                <div>
                  <h2 className="title">ABOUT ME</h2>
                  <p className="flex-item-text">I am an allround web developer. I am a senior programmer with good knowledge sof front-end techniques. Vitae sapien pellentesque habitant morbi tristique senectus et. Aenean sed adipiscing diam donec adipiscing tristique risus.</p>
                  <Footer.LinkGroup col={true} className="d-flex">
                    <div className="d-flex social-media">
                      <Footer.Link href="https://facebook.com"><FaFacebook /></Footer.Link>
                      <Footer.Link href="https://twitter.com"><FaTwitter /></Footer.Link>
                      <Footer.Link href="https://instagram.com"><FaInstagram /></Footer.Link>
                    </div>
                  </Footer.LinkGroup>
                </div>
              </div>
              <div className="d-flex">
                <div className="text-black">
                  <div className="d-flex">
                    <h2 className="title">DETAILS</h2>
                    <GoPencil className="edit-icon"  onClick={() => handleEdit()} />
                  </div>
                  <p className="flex-item-text ">
                    <span>Name:</span><br/>
                    {data.first_name} {data.last_name}<br/><br/>
                    <span>Email:</span><br/>
                    {data.email}<br/><br/>
                    <span>Role:</span><br/>
                    {userData.role == 1 ? 'Admin' : 'User'}<br/><br/>
                    <span>Address:</span><br/>
                    {data.country_name}{','} {data.state_name}{','} {data.city_name}<br/><br/>
                  </p>
                </div>
              </div>
              <div className={`modal ${editModal ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-body text-black">
                      <div className="d-flex align-items-center">
                        <h2 className="title">Edit details:</h2>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="fname" className="form-label flex-item-text">First Name:</label>
                          <input type="text" name="fname" className="form-control" placeholder="Enter your firstname" value={editData.fname} onChange={handleChange} />
                          {errors.fname && <div className="text-danger">{errors.fname}</div>}
                        </div>
                        <div className="form-group">
                          <label htmlFor="lname" className="form-label flex-item-text">Last Name:</label>
                          <input type="text" name="lname" className="form-control" placeholder="Enter your lastname" value={editData.lname} onChange={handleChange} />
                          {errors.lname && <div className="text-danger">{errors.lname}</div>}
                        </div>
                        <div className="form-group">
                          <label htmlFor="email" className="form-label flex-item-text">Email:</label>
                          <input type="text" name="email" className="form-control" placeholder="Enter your email" value={editData.email} onChange={handleChange} />
                          {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                          <button type="submit" className="btn btn-primary top-update-btn">Submit</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
    // <div className="d-flex">
    //   <div className="container bootstrap snippets bootdey">
    //     <div className="infContentStyle">
    //       <div className="row">
    //         <div className="col-md-4">
    //           <div className="profile-logo">
    //             <div className="d-flex flex-row-reverse align-items-start">
    //               <EditIcon className="edit-icon" onClick={() => setShowUploadImg(true)} />
    //               <img alt="upload_file" title="Usuario" src={data.image ? `http://localhost:8080/userImg/images/${data.image}` : 'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg'} className="img-circle img" />
    //             </div>
    //           </div>
    //           <div className={`modalDialog ${showUploadImg ? 'd-block' : 'd-none'} bg-custom`}>
    //             <div className="modalHeader">
    //               <button type="button" className="close-icon" data-dismiss="modal" aria-label="Close" onClick={(() => setShowUploadImg(false))}>
    //                 <span aria-hidden="true">&times;</span>
    //               </button>   
    //             </div>
    //             <div className="mb-3 p-30">
    //               <input type="file" name="file" className="form-control" onChange={handleFile} />
    //               <div className="modal-footer mt-20">
    //                 <button type="button" className="btn btn-secondary m-12" onClick={(() => setShowUploadImg(false))} >Close</button>
    //                 <button type="button" className="btn btn-primary top-update-btn" onClick={handleUpload}>Upload</button>
    //               </div>
    //             </div>        
    //           </div>
    //         </div>
    //         <div className="col-md-6">
    //           <h3 className="text-black">Profile</h3><br />
    //           <div className="table-responsive d-flex flex-column-reverse align-items-end">
    //             <table className="table table-user-information">
    //               <tbody>
    //                 <tr>
    //                   <td><strong><span className="glyphicon glyphicon-asterisk text-primary"></span>Identificacion</strong></td>
    //                   <td className="text-primary"> {userData.iat} </td>
    //                 </tr>
    //                 <tr>
    //                   <td><strong><span className="glyphicon glyphicon-user  text-primary"></span>Name</strong></td>
    //                   <td className="text-primary"> {data.first_name} </td>
    //                 </tr>
    //                 <tr>        
    //                   <td><strong><span className="glyphicon glyphicon-cloud text-primary"></span> Lastname</strong></td>
    //                   <td className="text-primary"> {data.last_name } </td>
    //                 </tr>
    //                 <tr>        
    //                   <td><strong><span className="glyphicon glyphicon-eye-open text-primary"></span>Role</strong></td>
    //                   <td className="text-primary"> {userData.role === 1 ? "Admin" : "User"} </td>
    //                 </tr>
    //                 <tr>        
    //                   <td><strong><span className="glyphicon glyphicon-envelope text-primary"></span>Email </strong></td>
    //                   <td className="text-primary"> {data.email} </td>
    //                 </tr>
    //                 <tr>        
    //                   <td><strong><span className="glyphicon glyphicon-envelope text-primary"></span>Country </strong></td>
    //                   <td className="text-primary"> {data.country_name} </td>
    //                 </tr>
    //                 <tr>        
    //                   <td><strong><span className="glyphicon glyphicon-envelope text-primary"></span>State </strong></td>
    //                   <td className="text-primary"> {data.state_name} </td>
    //                 </tr>
    //                 <tr>        
    //                   <td><strong><span className="glyphicon glyphicon-envelope text-primary"></span>City </strong></td>
    //                   <td className="text-primary"> {data.city_name} </td>
    //                 </tr>
    //               </tbody>
    //             </table>
    //             <div className="d-grid gap-2 d-md-flex justify-content-md-start">
    //               <button variant="success" className="btn btn-warning" onClick={handleEdit}>Edit details</button>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}
export default ProfilePage;
