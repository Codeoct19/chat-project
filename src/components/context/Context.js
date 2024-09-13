import { createContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { apiRequest } from '../../utils/APIUtils';
export const Context = createContext();
export const AuthContext = ({children}) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({ id: '', fname: '', lname: '', email: '' });
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

  const handleEdit = (data) => {
    if (loggedInUser) { setEditData(data); }
    setEditModal(true);
  }; 

  const handleClose = () => {
    setErrors({});
    setEditModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';
    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value === '') {
        errorMessage = 'Email is required';
      } else if (!emailPattern.test(value)) {
        errorMessage = 'Invalid email format';
      }
    } else if (name === 'fname' || name === 'lname') {
      if (value === '') {
        errorMessage = `${name} is required`;
      } else if (value.trim().length < 3) {
        errorMessage = `${name} must be at least 3 characters long`;
      }
    }
    setErrors({ ...errors, [name]: errorMessage });
    setEditData({ ...editData, [name]: value });
  };
  
  const handleFileChange = (e) => {
    const fileData = e.target.files[0];
    setFile(fileData);
  };

  const handleSubmit = async (e) => {
   e.preventDefault();
   const formData = {image: file, user_id: editData?.id};
   console.log(formData, '.....formData');
   if (!errors.fname && !errors.lname && !errors.email) {
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
          const method = "POST";
          const endpoint = "/user/editUser";
          const data = editData;
          await apiRequest(method, endpoint, data);
          setEditModal(false);
          console.log(editData);
          if (formData.image == null) {return; }
            const response = await apiRequest('POST', '/userImg/image', formData);
          if (response.status === 200) { 
            const { image } = response.data; 
            Img(image);
          } else { console.error('Failed to upload image'); }
          } else if (result.dismiss === Swal.DismissReason.cancel) { setEditModal(false); }
      });
     } catch (error) { console.log('Error for edit api: ', error); }
   }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    const storedToken = localStorage.getItem('access_token');
    const profilePic = localStorage.getItem('User_Img');
    if (storedUser) { setLoggedInUser(storedUser); }
    if (storedToken) { setAccessToken(storedToken); }
    if (profilePic) { setUserImg(profilePic); }
    return;
  }, []);

  const login = (user, token) => {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    localStorage.setItem('access_token', JSON.stringify(token));
    setLoggedInUser(user); 
    setAccessToken(token);
  }

  const logout = () =>{
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('access_token');
    setLoggedInUser(null); 
    setAccessToken(null);
  }
  
  const Img = (loggedInUserImg) => {
    localStorage.setItem('User_Img', loggedInUserImg);
    setUserImg(loggedInUserImg);
  }

  return(
    <Context.Provider value={{loggedInUser, accessToken, userImg, editModal, editData, errors, file, login, logout, Img, handleEdit, handleClose, handleChange, handleFileChange, handleSubmit}}>
      {children}
    </Context.Provider>
  );
}
