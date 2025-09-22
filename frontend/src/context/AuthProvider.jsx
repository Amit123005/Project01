import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return React.useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [accessLevel, setAccessLevel] = useState(null);
  const [department, setDepartment] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const login = (id, level, dept, uname, realName, mail) => {
    setUserId(id);
    setAccessLevel(level);
    setDepartment(dept);
    setUsername(uname);
    setName(realName);
    setEmail(mail);
    setIsAuthenticated(true);
    localStorage.setItem('userId', id);
    localStorage.setItem('accessLevel', level);
    localStorage.setItem('department', dept);
    localStorage.setItem('username', uname);
    localStorage.setItem('name', realName);
    localStorage.setItem('email', mail);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setUserId(null);
    setAccessLevel(null);
    setDepartment(null);
    setUsername(null);
    setName(null);
    setEmail(null);
    setIsAuthenticated(false);
  
    localStorage.removeItem('userId');
    localStorage.removeItem('accessLevel');
    localStorage.removeItem('department');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('isAuthenticated');
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isAuthenticated) {
        console.log('User not authenticated within 15 seconds. Logging out...');
        logout();
      }
    }, 15000); // 15 seconds timeout

    try {
      const storedUserId = localStorage.getItem('userId');
      const storedAccessLevel = localStorage.getItem('accessLevel');
      const storedDepartment = localStorage.getItem('department');
      const storedUsername = localStorage.getItem('username');
      const storedName = localStorage.getItem('name');
      const storedEmail = localStorage.getItem('email');
      const storedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
      if (storedUserId && storedAccessLevel && storedIsAuthenticated) {
        setUserId(storedUserId);
        setAccessLevel(storedAccessLevel);
        setDepartment(storedDepartment);
        setUsername(storedUsername);
        setName(storedName);
        setEmail(storedEmail);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    } finally {
      setLoading(false); // Ensure loading state is updated
    }

    return () => clearTimeout(timeout); // Clear timeout on component unmount
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ userId, accessLevel, department, username, name, email, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
