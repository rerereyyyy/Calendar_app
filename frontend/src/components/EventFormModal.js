import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EventFormModal.css'

const EventFormModal = ({ onClose, fetchEvents, eventDetails = null }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [reminderTime, setReminderTime] = useState(0);

  // 編集モードか新規作成か判断
  const isEditMode = eventDetails !== null;

  useEffect(() => {
    if (eventDetails) {
        setTitle(eventDetails.title);
        setStart(eventDetails.start);
        setEnd(eventDetails.end);
        setDescription(eventDetails.description || '');
        setLocation(eventDetails.location || '');
        setReminderTime(eventDetails.reminderTime || 0);
    } else {
        // 新規作成のため、フォームをリセット
        setTitle('');
        setStart('');
        setEnd('');
        setDescription('');
        setLocation('');
        setReminderTime(0);
    }
  }, [eventDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedEvent = { title, start, end, description, location, reminderTime };

    try {
        if (isEditMode) {
            // 編集の場合
            await axios.put(`http://localhost:5003/api/events/${eventDetails._id}`, updatedEvent);
            console.log("Event updated:", updatedEvent);
        } else {
            // 新規作成の場合
            await axios.post('http://localhost:5003/api/events', updatedEvent);
            console.log("New event added:", updatedEvent);
        }
        fetchEvents();
        onClose();
    } catch (error) {
        console.log('Error adding/updating event:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{isEditMode ? 'イベントを編集' : '予定を追加'}</h3>
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
            <button type="submit">{isEditMode ? '更新': '追加'}</button>
            <button type="button" onClick={onClose}>閉じる</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
