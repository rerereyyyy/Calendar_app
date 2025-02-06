import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SignUp.css';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5003/api/auth/signup', {
                email,
                password,
            });

            // サインアップ成功時の処理
            alert('User registered successfully!');
            setLoading(false);
        } catch (err) {
            // エラーハンドリング
            console.error(err);
            setError('Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Sign Up"}
            </button>
            {error && <p>{error}</p>}
          </form>
        </div>
      );
};

export default SignUp;