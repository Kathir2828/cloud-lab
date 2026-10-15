import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// 1. Your Firebase Configuration (replace with your keys)
const firebaseConfig = {
  apiKey: "AIzaSyDPk2hshtbz1mf_Jo68vu6MkYugjYwKi08",
  authDomain: "mdirfan-982d5.firebaseapp.com",
  projectId: "mdirfan-982d5",
  storageBucket: "mdirfan-982d5.firebasestorage.app",
  messagingSenderId: "352880984129",
  appId: "1:352880984129:web:db32e4bb26fbb050ff46c0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  // Keep track of user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle Submit (Login or Sign Up)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  // If logged in, show dashboard
  if (user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
        <h2>Welcome!</h2>
        <p>Logged in as: <strong>{user.email}</strong></p>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Log Out
        </button>
      </div>
    );
  }

  // If logged out, show form
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '80px', fontFamily: 'Arial' }}>
      <form onSubmit={handleSubmit} style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isSignUp ? 'Sign Up' : 'Log In'}
        </button>

        {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

        <p 
          onClick={() => setIsSignUp(!isSignUp)} 
          style={{ color: '#007bff', fontSize: '14px', cursor: 'pointer', textAlign: 'center', marginTop: '10px' }}
        >
          {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </p>
      </form>
    </div>
  );
}