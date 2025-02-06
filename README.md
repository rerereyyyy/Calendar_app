# カレンダーアプリ

このカレンダーアプリは、ユーザーが予定を追加・表示・削除できるウェブアプリケーションです。予定にはタイトル、日時、説明、場所、リマインダー時間を設定することができます。

## 機能

- **予定の表示**: カレンダー形式で予定を表示
- **予定の追加**: タイトル、開始日時、終了日時、場所、リマインダー時間を指定して新しい予定を追加
- **予定の削除**: 既存の予定をクリックして削除
- **リマインダー通知**: 設定されたリマインダー時間に基づき、予定の通知を送信

## 使用技術

- **フロントエンド**: React.js, FullCalendar
- **バックエンド**: Node.js, Express, MongoDB
- **データベース**: MongoDB
- **リマインダー通知**: node-schedule（スケジュール管理ライブラリ）

## セットアップ

### 1. リポジトリのクローン

最初にプロジェクトをローカルにクローンします。

```bash
git clone https://github.com/yourusername/calendar-app.git
cd calendar-app
```

### 2. フロントエンドのセットアップ

フロントエンド（React.js）を設定するには、frontendフォルダ内に移動して依存関係をインストールします。

```bash
cd frontend
npm install
```

その後開発サーバーを起動します

```bash
npm start
```

フロントエンドはhttp://localhost:3000で動作します。

### 3. バックエンドのセットアップ

バックエンド（Node.js）を設定するには、backendフォルダ内に移動して依存関係をインストールします。

```bash
cd backend
npm install
```

MongoDBがローカルまたはクラウドで実行されていることを確認し、.envファイルにMongoDBの接続URLを設定します。

```ini
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

バックエンドを起動します。

```bash
npm start
```

バックエンドはhttp://localhost:5003で動作します。

### 4. サーバーとフロントエンドの通信

フロントエンドとバックエンドが適切に通信できるように、CORSの設定を確認してください。バックエンドのserver.jsファイルで、次のように設定します。

```javascript
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
```

### 5. MongoDBのセットアップ

MongoDBがローカルまたはクラウドで動作している必要があります。MongoDBの接続設定は .env ファイルで行います。

## 昨日の詳細

### 1. 予定の追加

ユーザーはカレンダーの日付をクリックし、予定のタイトル、開始時刻、終了時刻、説明、場所、リマインダー時間を入力して新しい予定を追加できます。リマインダー時間は、指定した時間前に通知が送られる機能です。

### 2. 予定の削除

ユーザーは追加された予定をクリックすることで、その予定の詳細をモーダルで確認し、削除することができます。

### 3. リマインダー通知

予定のリマインダー時間を設定することで、設定された時間に予定の通知を受け取ることができます。バックエンドで node-schedule を使用して、スケジュールされた時間に通知が送られます。