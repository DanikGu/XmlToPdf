import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString ?? '{}');
    if (userToken.expiration && 
      new Date(userToken.expiration) < new Date()) {
      return null;
    }
    return userToken?.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken : { token: string, expiration: Date }) => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token
  }
}
