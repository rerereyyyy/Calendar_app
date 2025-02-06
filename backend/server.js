const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const Event = require('./models/Event');  // モデルのパスが正しいか確認
const schedule = require('node-schedule'); // スケジューリング用
const session = require('express-session');
const passport = require('passport');
const { ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5003;

// `express-session` を CORS の前に適用
app.use(session({
    secret: 'your_secret_key', // セッションの暗号化キー（適宜変更）
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // 本番環境では true にする
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1日
    },
    proxy: true // 追加（Google OAuthがプロキシを使う可能性があるため）
}));

// CORSミドルウェアを設定
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// CORSの設定：フロントエンドからのリクエストを許可
const corsOptions = {
    origin: 'http://localhost:3000', // クライアントのURL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 許可するHTTPメソッド
    allowedHeaders: ['Content-Type', 'Authorization'], // 許可するヘッダー
    preflightContinue: true, // OPTIONSリクエストの処理を続ける
    optionsSuccessStatus: 200, // 成功のステータスコード
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(5002, () => {
    console.log('Server is runnning on http://localhost:5003')
});

// CORSエラーのハンドリング
app.use((err, req, res, next) => {
    if (err) {
        console.error('CORS Error', err.stack);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
    next();
});

// MongoDB接続
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// ユーザーモデル定義
const User = mongoose.model('User', new mongoose.Schema({
    email: {type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

// サインアップAPI
app.post('/api/auth/signup', [
    body('email').isEmail(),
    body('password').isLength({ min: 5})
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // パスワードのハッシュ化
        const hashedPassword = bcrypt.hashSync(password, 10);

        // 新しいユーザーを作成
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});

// ログインAPI
app.post('/api/auth/login', [
    body('email').isEmail(),
    body('password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // ユーザー検索
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(401).send('Invalid credentials');
        }

        // パスワードを比較
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch:', { email, enteredPassword: password, storedPassword: user.password });
            return res.status(401).send('Invalid credentials');
        }

        // JWTトークンの作成
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h'});

        // トークンを返す
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// イベント作成API
app.post('/api/events', async (req, res) => {
    try {
        const {title, start, end, description, location, reminderTime} = req.body;

        const newEvent = new Event({ title, start, end, description, location, reminderTime });
        const savedEvent = await newEvent.save();

        console.log('New event added', savedEvent);
        scheduleReminder(savedEvent);
        res.json(savedEvent);
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(400).send("Error adding event");
    }
})

// イベント削除処理
app.delete('/api/events/:id', async (req, res) => {
    try {
        
        const eventId = new ObjectId(req.params.id);  // ObjectIdに変換
        console.log('Received DELETE request for event with ID:', eventId);  // ログ出力


        const event = await Event.findByIdAndDelete(eventId);
        if (!event) {
            console.error('Event not found');  // イベントが見つからなかった場合
            return res.status(404).send("Event not found");
        }
        console.log("Deleted event:", event);
        res.json({ message: "Event deleted" });
    } catch (err) {
        console.error('Error deleting event:', err);  // エラーログ
        res.status(400).send("Error deleting event");
    }
});

// LINE通知を送信する関数
const sendLineNotification = async (message) => {
    const url = 'https://api.line.me/v2/bot/message/push';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
    };
    const data = {
        to: process.env.LINE_USER_ID,
        messages: [{ type: 'text', text: message }],
    };

    try {
        await axios.post(url, data, { headers });
        console.log('LINEが送信されました');
    } catch (error) {
        console.error('LINE通知の送信エラー:', error);
    }
};

// リマインダーのスケジューリング
const scheduleReminder = (event) => {
    if (!event.reminderTime || event.reminderTime <= 0) return;

    const eventTime = new Date(event.start);
    const reminderTime = new Date(eventTime.getTime() - event.reminderTime * 60000); // 分をmsに変換

    if (reminderTime > new Date()) {
        schedule.scheduleJob(reminderTime, () => {
            console.log(`🔔 リマインダー通知: ${event.title} の時間が近づいています！`);
            // ここでメール送信やプッシュ通知を実装
            const message = `🔔 予定「${event.title}」の${event.reminderTime}分前です！`;
            sendLineNotification(message); // LINEに通知を送信
        });
    }
};

// 起動時に全イベントのリマインダーをスケジュール
const initializeReminders = async () => {
    try {
        const events = await Event.find({ reminderTime: { $gt: 0 } });
        events.forEach(scheduleReminder);
    } catch (error) {
        console.error("Error initializing reminders:", error);
    }
};

initializeReminders(); // サーバー起動時に実行

// ルート設定
const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

// サーバー起動
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.options('*', cors(corsOptions)); // 全てのルートに対してプリフライトリクエストを許可

