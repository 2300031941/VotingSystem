import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    else if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!aadhaar) newErrors.aadhaar = 'Aadhaar number is required';
    else if (!/^\d{12}$/.test(aadhaar)) newErrors.aadhaar = 'Aadhaar number must be exactly 12 digits';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const result = await signup(name.trim(), aadhaar, password);
        if (result.success) {
          navigate('/dashboard');
        } else {
          setErrors({ general: result.error || 'Registration failed. Please try again.' });
        }
      } catch (error) {
        setErrors({ general: 'Network error. Please check your connection and try again.' });
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="container-content">
        <h2>Voter Registration</h2>
        <p>Create your account to participate in the election</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'error' : ''}
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Aadhaar Number:</label>
          <input
            type="text"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
            className={errors.aadhaar ? 'error' : ''}
            placeholder="Enter your 12-digit Aadhaar number"
            maxLength="12"
          />
          {errors.aadhaar && <span className="error-message">{errors.aadhaar}</span>}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'error' : ''}
            placeholder="Create a password"
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? 'error' : ''}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        {errors.general && <div className="error-message general">{errors.general}</div>}

        <button type="submit" className="btn-primary">Register</button>
      </form>

      <div className="auth-links">
        <p>Already have an account? <a href="/">Login here</a></p>
      </div>
      </div>
    </div>
  );
};

export default Signup;