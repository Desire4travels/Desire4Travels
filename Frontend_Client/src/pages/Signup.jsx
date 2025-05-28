import React from 'react';
import './Signup.css';

const Signup = () => {
  return (
    <div className='signup-container'>
      <div className='signup'>
        <h2>Sign Up</h2>
        <form>
          <input type='text' placeholder='Full Name' required />
          <input type='tel' placeholder='Mobile Number' required />
          
          <div className='terms'>
            <input type='checkbox' id='terms' required />
            <label htmlFor='terms'>
              By continuing, I agree to the <a href='#'>terms of use</a> & <a href='#'>privacy policy</a>.
            </label>
          </div>

          <button type='submit'>Continue</button>
        </form>
        <p className='login-link'>
          Already have an account? <a href='/login'>Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
