import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import EventFormModal from './EventFormModal';
import Modal from './Modal'
import { deleteEvent } from '../api';
import '../styles/Calendar.css';


const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // モーダルの開閉状態
  const [selectedEvent, setSelectedEvent] = useState(null); // クリックされた予定の詳細
  const [formModalOpen, setFormModalOpen] = useState(false);

  // イベントをバックエンドから取得
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5003/api/events');

      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const openFormModal = () => setFormModalOpen(true);
  const closeFormModal = () => setFormModalOpen(false);

  // 予定がクリックされたときに詳細を取得してモーダルを開く
  const handleEventClick = (clickInfo) => {
    const eventDetails = {
      _id: clickInfo.event._def.extendedProps._id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      description: clickInfo.event.extendedProps.description || "",
      location: clickInfo.event.extendedProps.location || "",
    };

    console.log('Event details for modal:', eventDetails); // モーダルに渡す前に確認

    setSelectedEvent(eventDetails);  // eventDetails を setSelectedEvent にセット
    setModalOpen(true);  // モーダルを開く
  };

  // イベントの削除処理
  const handleEventDelete = async () => {
    if (!selectedEvent || !selectedEvent._id) {
      console.error('Event details are missing or incomplete');
      return;
    }

    try {
      await deleteEvent(selectedEvent._id);
      console.log('✅ Event deleted:', selectedEvent._id);

      // 🔹 MongoDB のデータ削除が完了してからイベントリストを更新
      setEvents(prevEvents => prevEvents.filter(event => event._id !== selectedEvent._id));

      setModalOpen(false); // モーダルを閉じる
    } catch (error) {
      console.error('❌ Error deleting event:', error);
    }
};

return (
  <div className="calendar-container">
    <h2>My Calendar</h2>

    {/* 予定を追加ボタン */}
    <button className="add-event-button" onClick={openFormModal}>予定を追加</button>

    <FullCalendar 
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      eventClick={handleEventClick}
      eventContent={(eventInfo) => (
        <div className="fc-event-title">
          {eventInfo.event.title}
        </div>
      )}
    />

    {/* 予定追加モーダル */}
    {formModalOpen && <EventFormModal onClose={closeFormModal} fetchEvents={fetchEvents} />}

    {/* 予定詳細モーダル */}
    {modalOpen && (
      <Modal 
        isOpen={modalOpen}
        eventDetails={selectedEvent}
        onClose={() => setModalOpen(false)}
        onDelete={handleEventDelete}
      />
    )}
  </div>
);
};

export default Calendar;
