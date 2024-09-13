import React, { useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; 
import { jwtDecode } from "jwt-decode";
import { Context } from "../context/Context";
import GoogleSignInButton from './GoggleLoginBtn';
import './GoggleLoginBtn.css';
import { apiRequest } from '../../utils/APIUtils';
import { LoginSchema } from '../../utils/SchemaValidation';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Login = () => {
  const navigate = useNavigate(); 
  const {login, Img} = useContext(Context);
  const loginUsertoken = localStorage.getItem('access_token');

  useEffect(()=> {
    if(loginUsertoken){ navigate('/') }
  }, [loginUsertoken]);

  const handleSubmit = async (values) => {
    const method = 'POST';
    const endpoint = '/auth/login';
    const data = values;
    const response = await apiRequest(method, endpoint, data);
    if (response.status === 200) {
      const { message, access_token } = response.data;
      Swal.fire({
        icon: 'success', title: message, text: 'User login successfully!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const user = jwtDecode(access_token);
          localStorage.setItem('loggedIn', JSON.stringify(user));
          login(user, access_token);
          Img(user.image);
          const {role} = user;
          if (!role) { return( <div>Loading...</div>) }
          if (role === 1) { navigate('/userlist'); } 
          else if(role === 2){ navigate('/profile'); }
        }
      });
    }else if (response.response.data === 'User not found') {
      Swal.fire({
        icon: 'warning',
        title: 'User not found',
        text: 'Please check your email address',
      });
    }else if(response.response.data === "Incorrect Password"){
      Swal.fire({
        icon: 'warning',
        title: 'Incorrect password',
        text: 'Please check your password',
      });
    }
  }
  return(
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <Formik initialValues={{email: '', password: ''}} validationSchema={LoginSchema} onSubmit={handleSubmit}>
            {() => (
              <Form className="border p-4 rounded bg-white text-dark">
                <h2 className="mb-4">Login</h2>
                <div className="mb-3">
                  <label htmlFor="Email" className="form-label">Email:</label>
                  <Field type="text" id="email" name="email" className="form-control" placeholder="Enter email" />
                  <ErrorMessage name='email' component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Field type="password" id="password" name="password" className="form-control" placeholder="Enter password" />
                  <ErrorMessage name='password' component="div" className="text-danger" />
                </div>
                <button type="submit" className="btn btn-primary btn-block" >Login</button>
                <p className='d-grid gap-2 d-md-flex justify-content-md-center'>Don't have an account?<a href='/Register'> Signup </a> </p>
                <GoogleSignInButton />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
export default Login;