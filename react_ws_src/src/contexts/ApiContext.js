import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Create the context
export const ApiContext = createContext();

// Hook for easy access
export const useApi = () => useContext(ApiContext);

// Provider component
export const ApiProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // POST create new user
  const createUser = async (name) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/users', { name });
      // Successfully created new user
      setUser(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      // If user already exists, get existing user from response
      if (err.response && err.response.status === 409 && err.response.data) {
        try {
          console.log('User already exists', name);
          const existingRes = await axios.get('/api/users', {
            params: { name },
          });
          console.log('Fetched existing user', existingRes.data);
          setError(null);
          setUser(existingRes.data);
          return existingRes.data;
        } catch (getErr) {
          setError(
            getErr.response && getErr.response.data
              ? getErr.response.data.error
              : getErr.message,
          );
          return null;
        }
      } else {
        setError(
          err.response && err.response.data
            ? err.response.data.error
            : err.message,
        );
        return null;
      }
    } finally {
      setLoading(false);
    }
  };

  // POST add a new score
  const addUserScore = async (userData) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/users/scores', { ...userData });
      setError(null);
      setUser(res.data);
      console.log('Score added', res.data);
      return res.data;
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.error) ||
          err.message,
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // GET leaderboard
  const fetchLeaderboard = async (limit = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/scores/leaderboard?limit=${limit}`);
      setLeaderboard(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.error) ||
          err.message,
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        user,
        leaderboard,
        loading,
        error,
        createUser,
        addUserScore,
        fetchLeaderboard,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
