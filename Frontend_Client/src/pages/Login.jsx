import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');

  const isValidMobile = mobile.length === 10;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!isValidMobile) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    console.log('Sending OTP to:', mobile);
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      alert('Please enter the OTP.');
      return;
    }
    console.log('Verifying OTP:', otp);
  };

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      alert('Please enter your password.');
      return;
    }
    console.log('Logging in with password for:', mobile, 'Password:', password);
  };

  const toggleLoginMethod = () => {
    setUsePassword((prev) => !prev);
    setOtpSent(false);
    setOtp('');
    setPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={usePassword ? handlePasswordLogin : (otpSent ? handleVerifyOtp : handleSendOtp)}>
          <input
            type="tel"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            pattern="[0-9]{10}"
            maxLength="10"
            required
          />

          {usePassword ? (
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          ) : otpSent ? (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          ) : null}

          <div className="terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              By continuing, I agree to the <a href="#">terms of use</a> & <a href="#">privacy policy</a>.
            </label>
          </div>

          <button type="submit">
            {usePassword ? 'Login with Password' : otpSent ? 'Verify OTP' : 'Send OTP'}
          </button>
        </form>

        <button className="toggle-method" onClick={toggleLoginMethod}>
          {usePassword ? 'Login using OTP instead' : 'Having trouble? Use password'}
        </button>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
