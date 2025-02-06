const mongoose = require('mongoose');

// イベントモデルのスキーマを定義
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    description: { type: String },
    location: { type: String },
    reminderTime: {type: Number, default: 0},
});

// イベントモデルをエクスポート
module.exports = mongoose.model('Event', eventSchema);