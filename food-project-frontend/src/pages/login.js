import React, {useEffect, useState} from 'react';
import './login.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link, useNavigate} from "react-router-dom";
import {faKey, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {useAuth} from "../Context/Context";

function LoginComponent({isAuthenticated}) {
  const { user } = useAuth()
  let navigate = useNavigate();
  useEffect(() => {
    const bgGradient = `linear-gradient(
      to bottom,
      #eda1c8,
      #3d9bb3
    )`;
    document.documentElement.style.setProperty("--bg-gradient", bgGradient);
  }, [isAuthenticated, navigate]);
  const { checktoken } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/login', formData);
      if (response.status === 200) {
        const token = response.data.token;
        checktoken({ token });
        navigate('/');
    }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function show_hide_password(target){
	let input = document.getElementById('password-input');
	if (input.getAttribute('type') === 'password') {
		target.classList.add('view');
		input.setAttribute('type', 'text');
	} else {
		target.classList.remove('view');
		input.setAttribute('type', 'password');
	}
	return false;
  }

  return (
      <section className="login-section">

  <div className="login-box">

    <div className="login-square" style={{'--i': 0}}/>
    <div className="login-square" style={{'--i': 1}}/>
    <div className="login-square" style={{'--i': 2}}/>
    <div className="login-square" style={{'--i': 3}}/>
    <div className="login-square" style={{'--i': 4}}/>
    <div className="login-square" style={{'--i': 5}}/>

    <div className="login-container">
      <div className="login-form">
        <h2 className="login-h2">LOGIN</h2>
        <form onSubmit={loginUser}>
          <div className="login-inputBx">
            <input className="login-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
            <span className="login-span">Login</span>
            <FontAwesomeIcon className="login-fas" icon={faUserCircle} />
          </div>
          <div className="login-inputBx login-password">
            <input className="login-input" id="password-input" type="password" name="password" value={formData.password} onChange={handleChange} required />
            <span className="login-span">Password</span>
            <Link to="/login" className="login-password-control" onClick={(e) => show_hide_password(e.target)} />
            <FontAwesomeIcon icon={faKey} className="login-fas" />
            <button onClick={()=>setFormData({email:"mayank02srivastava@gmail.com",password:"mayank15"})}>guest</button>
          </div>
          <div className="login-inputBx">
            <input className="login-input" type="submit" value="Log in" />
          </div>
        </form>
        <p className="login-p">Don't have an account <Link className="login-a" to="/signup">Signup</Link></p>
      </div>
    </div>

  </div>
</section>
  );
}

export default LoginComponent;
