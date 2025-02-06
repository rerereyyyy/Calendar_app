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

// イベント編集
router.put('/:id', async (req, res) => {
    const { title, start, end, description, location, reminderTime } = req.body;
    const eventId = req.params.id;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).send('Event not found');
        }

        // イベントの情報を更新
        event.title = title;
        event.start = start;
        event.end = end;
        event.description = description;
        event.location = location;
        event.reminderTime = reminderTime;

        await event.save();
        res.json({ message: 'Event updated successfully', event });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(400).send('Error updating event');
    }
});

// イベント更新
router.put('/:id', async (req, res) => {
    const { title, start, end, description, location, reminderTime } = req.body;
    const eventId = req.params.id;

    try {
        console.log("Received update request for ID:", eventId); // デバッグ用

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { title, start, end, description, location, reminderTime },
            { new: true } // 更新後のデータを返す
        );

        if (!updatedEvent) {
            console.log(`❌ Event with ID ${eventId} not found`);
            return res.status(404).json({ message: 'Event not found' });
        }

        console.log(`✅ Event ${eventId} updated successfully`);
        res.json(updatedEvent);
    } catch (error) {
        console.error('❌ Error updating event:', error);
        res.status(500).json({ message: 'Error updating event' });
    }
});


module.exports = router;
