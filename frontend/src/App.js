import React from 'react';
import './styles/App.css';
import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import Login from './components/Login';
import SignUp from './components/SignUp';


function App() {
    // ログイン状態を管理
    const [token, setToken] = useState(localStorage.getItem('token')); 
    const [showSignUp, setShowSignUp] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken); // トークンがあればログイン状態に
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // ログアウト時にトークンを削除
        setToken(null); // 状態も更新
    };

    const toggleSignUp = () => {
        setShowSignUp(!showSignUp); // サインアップ画面切り替え
    }

    return (
        <div className="App">
            <h1>カレンダーだよ</h1>
            {!token ? (
                // ログインしてなければ
                showSignUp ? (
                    // サインアップ画面表示
                    <SignUp setToken={setToken} />
                ) : (
                    // ログインフォーム表示
                    <Login setToken={setToken} />
                )
            ) : (
                <>
                    {/* ログイン後はカレンダーを表示 */}
                    <Calendar />
                    <button onClick={handleLogout}>ログアウト</button>
                </>
            )}

            {/* サインアップ画面に切り替えるためのリンク */}
            {!token && (
                <button onClick={toggleSignUp}>
                    {showSignUp ? 'ログイン画面に戻る' : 'サインアップ画面に切り替え'}
                </button>
            )}
        </div>
    );
}

export default App;