import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import FileManager from './components/FileManager';
const CustomGoogleButton = () => {

  const [error, setError] = useState(null);
  const [sucess, setSucess] = useState(null);
  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const response = await fetch("http://localhost:3001/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ code }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) {
          throw new Error("login failed")
        }
        const responseJson = await response.json()
        const { user, token } = responseJson.data;
        localStorage.setItem('accessToken', token)
        console.log("success", user, token)
        setError(null)
        setSucess("login success")
      } catch (error) {
        console.log("Error:", error)
        setSucess(null)
        setError("login failed")
      }
    },
    flow: 'auth-code'
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/users", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (!response.ok) {
        throw new Error("fetch users failed")
      }
      const result = await response.json()
      console.log("users", result)
      setError(null)
      setSucess("fetch users success")
    } catch (error) {
      console.log("Error:", error)
      setSucess(null)
      setError("fetch users failed")
    }
  }
  console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem',
      alignItems: 'center'
    }}>
      <button
        onClick={login}
        style={{
          backgroundColor: '#4285F4',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Sign in with Google
      </button>
      <button onClick={fetchUsers}>
        fetch users
      </button>
      <FileManager />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {sucess && <p style={{ color: 'green' }}>{sucess}</p>}
    </div >
  );
};

export default CustomGoogleButton;
