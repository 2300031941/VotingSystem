import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedVoteStatus = localStorage.getItem('hasVoted');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedVoteStatus) {
      setHasVoted(JSON.parse(savedVoteStatus));
    }
  }, []);

  const login = async (aadhaar, password, isAdmin = false) => {
    try {
      if (isAdmin) {
        const response = await fetch('http://localhost:4000/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: aadhaar, password }),
        });

        if (response.ok) {
          const data = await response.json();
          const user = { id: aadhaar, role: 'admin', name: 'Admin' };
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          return { success: true };
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Invalid admin credentials' }));
          return { success: false, error: errorData.error || 'Invalid admin credentials' };
        }
      } else {
        const response = await fetch('http://localhost:4000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ aadhaarNumber: aadhaar, password }),
        });

        if (response.ok) {
          const userData = await response.json();
          const user = { aadhaar: userData.aadhaarNumber, role: 'voter', name: userData.fullName };
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          return { success: true };
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Invalid credentials' }));
          return { success: false, error: errorData.error || 'Invalid credentials' };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (name, aadhaar, password) => {
    try {
      const response = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName: name, aadhaarNumber: aadhaar, password }),
      });

      if (response.ok) {
        const newUser = { name, aadhaar, role: 'voter' };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Signup failed:', errorData.error);
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setHasVoted(false);
    localStorage.removeItem('user');
    localStorage.removeItem('hasVoted');
  };

  const castVote = () => {
    if (user && !hasVoted) {
      setHasVoted(true);
      localStorage.setItem('hasVoted', 'true');
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, hasVoted, login, signup, logout, castVote }}>
      {children}
    </AuthContext.Provider>
  );
};