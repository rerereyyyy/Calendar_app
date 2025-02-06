import React, { useEffect } from 'react';
import '../styles/Modal.css'


const Modal = ({ isOpen, eventDetails, onClose, onDelete }) => {

    useEffect(() => {
        console.log('Event details received:', eventDetails); // 受け取ったイベント詳細を確認
    }, [eventDetails]); // eventdetailsが変わるたびに確認

    if (!isOpen || !eventDetails) return null; // モーダルが開いていない場合は何も表示しない

    console.log('Event details received in modal:', eventDetails);  // モーダルに渡されたイベントの内容を確認

    // Dateオブジェクトを文字列に変換
    const startDate = new Date(eventDetails.start).toLocaleString();
    const endDate = new Date(eventDetails.end).toLocaleString();

    const handleContentClick = (e) => {
        e.stopPropagation();  // モーダルの外側クリック時に閉じないようにする
      };
    
      const handleDelete = async () => {
        console.log("Event details in modal:", eventDetails);  // イベントの詳細確認
        if (!eventDetails._id || !eventDetails._id) {
            console.error('Event ID is missing');
            return;
        }

        const eventId = eventDetails._id;
        console.log('Deleting event with ID:', eventId); // 削除対象のIDを確認

        try {
            await onDelete(eventId);

            console.log('Event deleted successfully');
            onClose();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };
    

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal' onClick={handleContentClick}>
                <h3>{eventDetails.title}</h3>
                <p><strong>Start:</strong> {startDate}</p>
                <p><strong>End:</strong> {endDate}</p>
                <p><strong>Description</strong> {eventDetails.description || 'No description'}</p>
                <p><strong>Location:</strong> {eventDetails.location || 'No location'}</p>
                <button onClick={onClose} className='button close-button'>Close</button>
                <button onClick={handleDelete} className='button delete-button'>Delete Event</button>
            </div>
        </div>
    );
};

export default Modal;