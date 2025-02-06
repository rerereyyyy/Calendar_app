import React, { useState } from 'react';
import axios from 'axios';
import '../styles/EventFormModal.css'

const EventFormModal = ({ onClose, fetchEvents }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [reminderTime, setReminderTime] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEvent = { title, start, end, description, location, reminderTime };
      await axios.post('http://localhost:5003/api/events', newEvent);
      fetchEvents();  // カレンダーを更新
      onClose();  // モーダルを閉じる
    } catch (error) {
      console.log('Error adding event:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>予定を追加</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
          <textarea placeholder="説明（省略可）" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="text" placeholder="場所（省略可）" value={location} onChange={(e) => setLocation(e.target.value)} />
          
          {/* リマインダー時間を選択 */}
          <label>リマインダー（分前）</label>
          <select value={reminderTime} onChange={(e) => setReminderTime(Number(e.target.value))}>
            <option value="0">なし</option>
            <option value="10">10分前</option>
            <option value="30">30分前</option>
            <option value="60">1時間前</option>
            <option value="1440">1日前</option>
          </select>

          <div className="modal-buttons">
            <button type="submit">追加</button>
            <button type="button" onClick={onClose}>閉じる</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
