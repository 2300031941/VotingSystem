import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginType, setLoginType] = useState('voter');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!id) newErrors.id = `${loginType === 'voter' ? 'Aadhaar number' : 'Admin ID'} is required`;
    else if (!/^\d{12}$/.test(id)) newErrors.id = `${loginType === 'voter' ? 'Aadhaar number' : 'Admin ID'} must be exactly 12 digits`;
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const result = await login(id, password, loginType === 'admin');
        if (result.success) {
          navigate('/dashboard');
        } else {
          setErrors({ general: result.error || `Invalid ${loginType === 'voter' ? 'aadhaar or password' : 'admin credentials'}` });
        }
      } catch (error) {
        setErrors({ general: 'Network error. Please try again.' });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="container-content">
        <h2>Login</h2>
        <p>Enter your credentials to access the voting system</p>

        <div className="form-group">
          <label>Login Type:</label>
          <select value={loginType} onChange={(e) => setLoginType(e.target.value)}>
            <option value="voter">Voter</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{loginType === 'voter' ? 'Aadhaar Number:' : 'Admin ID:'}</label>
            <input
              type="number"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className={errors.id ? 'error' : ''}
              placeholder={`Enter your 12-digit ${loginType === 'voter' ? 'Aadhaar number' : 'Admin ID'}`}
              maxLength="12"
            />
            {errors.id && <span className="error-message">{errors.id}</span>}
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {errors.general && <div className="error-message general">{errors.general}</div>}

          <button type="submit" className="btn-primary">Login</button>
        </form>

        {loginType === 'voter' && (
          <div className="auth-links">
            <p>Don't have an account? <a href="/signup">Register here</a></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;