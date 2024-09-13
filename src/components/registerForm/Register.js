import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../utils/APIUtils';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { RegistrationSchema }  from '../../utils/SchemaValidation';

const Registration = () => {
  const navigate = useNavigate();
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);

  useEffect(() => {
    const fetchCountryList = async () => {
     try {
      const response = await apiRequest('GET', '/Address/countryList');
      const {result} = response.data;
      setCountry(result);
     } catch (error) {
      console.error("Error fetching country data:", error);
     }
    };
    fetchCountryList();
  }, []);

  const handleCountryChange = async (e, setFieldValue) => {
    const selectCountryID = e.target.selectedOptions[0].getAttribute("data-key");
    const selectedCountry = e.target.value;
    if (selectCountryID) {
     setFieldValue('country', selectedCountry);
     try {
      const method = 'POST';
      const endpoint = '/Address/getState';
      const data = { id: selectCountryID };
      const response = await apiRequest(method, endpoint, data);
      const { stateResult } = response.data;
      setState(stateResult);
      setFieldValue('state', ''); 
     } catch (error) {
      console.error("Error fetching state data:", error);
     }
    }
  };

  const handleSubmit = async (values) => {
    try { 
      const response = await apiRequest('POST', '/auth/register', values);
      if (response) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'User data registered successfully!',
        }).then(result => {
         if (result.isConfirmed) {
          navigate('/login');
         }
        });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: 'warning',
          title: 'User already exists',
          text: 'Please check your email address',
        });
      }
    } 
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Formik initialValues={{ fname: '', lname: '', email: '', password: '', c_password: '', country: '', state: '', city: ''}} validationSchema={RegistrationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, setFieldValue }) => (
              <Form className="border p-4 rounded text-dark bg-white">
                <h2 className="mb-4 text-center">Register</h2>
                <div className="row mb-3">
                 <div className="col-md-6">
                   <label htmlFor="fname" className="form-label">First Name:</label>
                   <Field type="text" id="fname" name="fname" className="form-control" placeholder='Enter firstname' />
                   <ErrorMessage name="fname" component="div" className="text-danger" />
                 </div>
                 <div className="col-md-6">
                   <label htmlFor="lname" className="form-label">Last Name:</label>
                   <Field type="text" id="lname" name="lname" className="form-control" placeholder='Enter lastname' />
                   <ErrorMessage name="lname" component="div" className="text-danger" />
                 </div>
                </div>
                <div className="mb-3">
                 <label htmlFor="email" className="form-label">Email:</label>
                 <Field type="email" id="email" name="email" className="form-control" placeholder='Enter email' />
                 <ErrorMessage name="email" component="div" className="text-danger" />
                </div>
                <div className="row mb-3">
                 <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <Field type="password" id="password" name="password" className="form-control" placeholder='Enter password' />
                    <ErrorMessage name="password" component="div" className="text-danger" />
                 </div>
                 <div className="col-md-6">
                    <label htmlFor="c_password" className="form-label">Confirm Password:</label>
                    <Field type="password" id="c_password" name="c_password" placeholder='Enter confirm password' className="form-control" />
                    <ErrorMessage name="c_password" component="div" className="text-danger" />
                 </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                   <label htmlFor="country" className="form-label">Country:</label>
                   <Field as="select" id="country" name="country" className="form-control" onChange={(e) => handleCountryChange(e, setFieldValue)}>
                     <option value="">Select a country</option>
                      {country && country.map((countries) => (
                        <option key={countries.id} value={countries.country} data-key={countries.id}>
                         {countries.country}
                        </option>
                     ))}
                   </Field>
                   <ErrorMessage name="country" component="div" className="text-danger" />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="state" className="form-label">State:</label>
                    <Field as="select" id="state" name='state' className="form-control">
                      <option value="">Select a state</option>
                      {state && state.map((state) => (
                        <option key={state.id} value={state.state}>
                          {state.state}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="state" component="div" className="text-danger" />
                  </div>
                  <div className="col-md-4">
                   <label htmlFor="city" className="form-label">City:</label>
                   <Field type="text" name="city" className="form-control" placeholder="Enter City" />
                   <ErrorMessage name="city" component="div" className="text-danger" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-3" disabled={isSubmitting}>Register</button>
                <p className='text-center mt-3'> Already have an account? <a href='/login'> Login </a> </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Registration;
