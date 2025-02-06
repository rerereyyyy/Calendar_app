const express = require('express');
const Event = require('../models/Event');
const router = express.Router();

// イベント一覧取得
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(400).send("Error fetching events");
  }
});

// イベント追加
router.post('/', async (req, res) => {
  const { title, start, end, description, location } = req.body;
  const newEvent = new Event({ title, start, end, description, location });

  try {
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).send("Error saving event");
  }
});

// イベント削除
router.delete('/:id', async (req, res) => {
    const eventId = req.params.id;

    console.log(`Received delete request for event with ID: ${eventId}`);
    
    try {
        const event = await Event.findByIdAndDelete(eventId);
        if (!event) {
            console.log(`Event with ID ${eventId} not found`);
            return res.status(404).send('Event not found');
        }
        console.log(`Event with ID ${eventId} deleted`);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(400).send('Error deleting event');
    }
});

module.exports = router;
