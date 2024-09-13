import * as Yup from 'yup';
export const  RegistrationSchema = Yup.object().shape({
  fname: Yup.string()
    .min(3, 'Firstname must be at least 3 characters long')
    .required('Firstname is required'),
  lname: Yup.string()
    .min(3, 'Lastname must be at least 3 characters long')
    .required('Lastname is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, 'Password must contain one uppercase, one lowercase, and one digit')
    .required('Password is required'),
  c_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Confirm password does not match')
    .required('Confirm password is required'),
  country: Yup.string().required('Please select your country'),
  state: Yup.string().required('Please select your state'),
  city: Yup.string().required('Please enter your city name')
});

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});