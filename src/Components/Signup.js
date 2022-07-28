import React , {useState, useEffect, useContext} from 'react'
import "./Signup.css"
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../utils/firebase.js';
import LoginImg from "../LoginImg.png";
import Rectangle from "../Rectangle.png";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';


const Signup = () => {
    const navigate = useNavigate();
    const {setCurrentUser} = useContext(UserContext);
  const initialValues = { username:"", email: "", password: "" }
  const [formValues, setFormValues] = useState(initialValues);
  const {username,email, password}= formValues;
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

const resetFormValues=()=>{
  setFormValues(initialValues);
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);

    try{
        
      const {user} = await createAuthUserWithEmailAndPassword(email,password);
      console.log(user);
      await createUserDocumentFromAuth(user,{username} )
      resetFormValues();
      setCurrentUser(user);
      setTimeout(() => navigate("/projects"), 100);
    }catch(error){
      if (error.code ==="auth/email-already-in-use"){
        alert('Cannot create user, email already in use')
      }
      else{
        console.log('user creation encountered an error', error);
      }
    }

  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors])

  const validate = (values) => {
    const errors = {}
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.username) {
      errors.username = "Username is required!"
    } 
    if (!values.email) {
      errors.email = "Email is required!"
    } else if (!regex.test(values.email)) {
      errors.email = "Please enter a valid email"
    }
    if (!values.password) {
      errors.password = "Password is required!"
    }
    return errors;
  }

  return (
    <div>
        <img src={LoginImg} alt="loginImg" className='login__image' /> 
          <img src={Rectangle} alt="Rectangle" className='rectangle__image' /> 
          <div className="login__content1"  ><Link to ="/log-in">Log In</Link></div>
          <div className='signup__content1'>
      <Link to="/sign-up">Sign Up</Link></div>
      <div className="signup__line"></div>
      <div className="signup__longline"></div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Full Name' className='username' name="username" onChange={handleChange} />
        <p className='username__error'>{formErrors.username}</p>
        <input type="email" placeholder='Email' className='email' name="email" onChange={handleChange} />
        <p className='email__error'>{formErrors.email}</p>
        <input type="password" placeholder='Password' className='password' name="password" onChange={handleChange} />
        <p className='password__error'>{formErrors.password}</p>
        <button type="submit" className='btn signup__btn'>Sign Up</button>
      </form>
    </div>
  )
}

export default Signup
