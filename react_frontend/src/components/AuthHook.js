import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';


const AUTH_STATUS_KEY = 'authStatus';
const TOKEN_TIMESTAMP_KEY = 'lastAuthTime';
const AUTH_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
// const AUTH_CHECK_INTERVAL = 10 * 60 * 1000; // 24 hours


export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedStatus = localStorage.getItem(AUTH_STATUS_KEY);
    const lastAuthTime = parseInt(localStorage.getItem(TOKEN_TIMESTAMP_KEY) || '0');
    const isExpired = Date.now() - lastAuthTime > AUTH_CHECK_INTERVAL;
    return storedStatus && !isExpired ? JSON.parse(storedStatus) : false;
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const initialCheckDone = useRef(false);
  const currentAuthCheck = useRef(null);
  const autoLogoutTimeout = useRef(null);

  const clearAuthState = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STATUS_KEY);
    localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("isInsured", "yes");
    
    if (autoLogoutTimeout.current) {
      clearTimeout(autoLogoutTimeout.current);
    }
  }, []);

  const scheduleAutoLogout = useCallback(() => {
    if (autoLogoutTimeout.current) {
      clearTimeout(autoLogoutTimeout.current);
    }

    const lastAuthTime = parseInt(localStorage.getItem(TOKEN_TIMESTAMP_KEY) || Date.now().toString());
    const timeUntilExpiry = (lastAuthTime + AUTH_CHECK_INTERVAL) - Date.now();
    
    if (timeUntilExpiry > 0) {
      autoLogoutTimeout.current = setTimeout(() => {
        console.log('Auto logout triggered after 24 hours');
        clearAuthState();
      }, timeUntilExpiry);
    } else {
      clearAuthState();
    }
  }, [clearAuthState]);

  const checkAuthStatus = useCallback(async (force = false) => {
    // If there's already a check in progress, return that promise
    if (currentAuthCheck.current) {
      return currentAuthCheck.current;
    }

    // Check for token expiration
    const lastAuthTime = parseInt(localStorage.getItem(TOKEN_TIMESTAMP_KEY) || '0');
    const isExpired = Date.now() - lastAuthTime > AUTH_CHECK_INTERVAL;
    
    if (!force && isExpired) {
      clearAuthState();
      return false;
    }

    setIsLoading(true);
    console.log('Starting auth check...', { force });

    currentAuthCheck.current = (async () => {
      try {
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

        console.log('Auth check response:', response.data);
        const isAuth = response.data.status === 'authenticated';
        
        // Ensure state updates happen synchronously
        await new Promise(resolve => {
          setIsAuthenticated(isAuth);
          if (isAuth) {
            localStorage.setItem(AUTH_STATUS_KEY, 'true');
            localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
            scheduleAutoLogout();
          } else {
            clearAuthState();
          }
          resolve();
        });

        initialCheckDone.current = true;
        return isAuth;
      } catch (error) {
        console.error('Auth check failed:', error);
        
        clearAuthState();
         return false;
      } finally {
        setIsLoading(false);
        currentAuthCheck.current = null;
      }
    })();

    return currentAuthCheck.current;
  }, [clearAuthState, scheduleAutoLogout]);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_URL}Administration/logout_view/`,
        {},
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearAuthState();
      setIsLoading(false);
    }
  }, [clearAuthState]);

  // Initial auth check and cleanup
  useEffect(() => {
    checkAuthStatus(true);

    return () => {
      if (autoLogoutTimeout.current) {
        clearTimeout(autoLogoutTimeout.current);
      }
    };
  }, [checkAuthStatus]);

  return {
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    checkAuthStatus,
    handleLogout,
    initialCheckDone: initialCheckDone.current
  };
}
