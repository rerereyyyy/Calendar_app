import React, { useState } from 'react';
import axios from 'axios'
import '../styles/Login.css';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log({ email, password });

        try {
            const response = await axios.post('http://localhost:5003/api/auth/login', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = response.data;
            console.log(data);

            if (response.status === 200) {
                // ログイン成功後の処理
                if (data && data.token) {
                    setToken(data.token);  // 親コンポーネントのsetTokenを呼び出してtokenを更新
                } else {
                    setError('Tokenがレスポンスに含まれていません');
                }
            } else {
                setError('ログイン失敗');
            }

            setLoading(false);

        } catch (err) {
            console.error("Error:", err);
            setError('Invalid credentials or server error');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
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
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p>{error}</p>}
          </form>
        </div>
      );
};

export default Login;
