import axios from 'axios';

const API_URL = 'http://localhost:5003/api/events';

export const getEvents = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createEvent = async (eventData) => {
    const response = await axios.post(API_URL, eventData);
    return response.data;
};

export const deleteEvent = async (eventId) => {
    try {
        const url = `${API_URL}/${eventId}`;
        console.log(`🔍 Sending DELETE request to: ${url}`);

        const response = await axios.delete(url);
        console.log('✅ Response from server:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error deleting event:', error);

        if (error.response) {
            console.error('🔍 Server Response:', error.response.data);
        } else {
            console.error('⚠️ No response from server');
        }

        throw error;
    }
};
