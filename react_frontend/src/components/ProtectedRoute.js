
import React, { useEffect, useState, useRef } from 'react';
import UnauthorizedRoute from './UnauthorizedRoute';
import axios from 'axios';
import Loading from './Loading';
 
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const Authenticated = localStorage.getItem("Auth");
  const isCheckingAuth = useRef(false);
 
  const TOKEN_TIMESTAMP_KEY = 'lastAuthTime';
  const AUTH_CHECK_INTERVAL = 24 * 60 * 60 * 1000;
  const autoLogoutTimeout = useRef(null);
 
  const scheduleAutoLogout = () => {
    if (autoLogoutTimeout.current) {
      clearTimeout(autoLogoutTimeout.current);
    }
 
    const lastAuthTime = parseInt(localStorage.getItem(TOKEN_TIMESTAMP_KEY) || Date.now().toString());
    const timeUntilExpiry = (lastAuthTime + AUTH_CHECK_INTERVAL) - Date.now();
 
    if (timeUntilExpiry > 0) {
      autoLogoutTimeout.current = setTimeout(() => {
        clearAuthState();
      }, timeUntilExpiry);
    } else {
      clearAuthState();
    }
  };
 
  const clearAuthState = () => {
    localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("isInsured", "yes");
 
    if (autoLogoutTimeout.current) {
      clearTimeout(autoLogoutTimeout.current);
    }
    setIsAuthenticated(false);
  };
 
  const checkAuthenticationStatus = async () => {
    if (isCheckingAuth.current) return;
    isCheckingAuth.current = true;
    try {
      const lastAuthTime = parseInt(localStorage.getItem(TOKEN_TIMESTAMP_KEY) || '0');
      const isExpired = Date.now() - lastAuthTime > AUTH_CHECK_INTERVAL;
      if (lastAuthTime > 0 && isExpired) {
        clearAuthState();
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_URL}Administration/check_auth_status/`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      const isAuth = response.data.status === 'authenticated';
      if (isAuth) {
        localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
        scheduleAutoLogout();
        setIsAuthenticated(true);
      } else {
        clearAuthState();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      clearAuthState();
    } finally {
      isCheckingAuth.current = false;
      setIsLoading(false);
    }
  };
 
  useEffect(() => {
    let authCheckInterval;
 
    if (Authenticated) {
      // Initial auth check
      checkAuthenticationStatus();
 
      // Set up interval for periodic checks
      authCheckInterval = setInterval(checkAuthenticationStatus, AUTH_CHECK_INTERVAL);
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
 
    return () => {
      if (authCheckInterval) {
        clearInterval(authCheckInterval);
      }
      if (autoLogoutTimeout.current) {
        clearTimeout(autoLogoutTimeout.current);
      }
    };
  }, [Authenticated]); // Only depend on Authenticated status
 
  if (isLoading) {
    // return <div>Loading...</div>;
    return <Loading/>;
  }
 
  return isAuthenticated && Authenticated ? children : <UnauthorizedRoute isAuthError={true} />;
}
 
export default ProtectedRoute;
 