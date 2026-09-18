const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const JWT_SECRET = 'srm-events-2k26-secret-key';
const EVENTS_FILE = path.join(__dirname, '../data/events.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Helper to read/write events
const getEvents = () => {
    try {
        const data = fs.readFileSync(EVENTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

const saveEvents = (events) => {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
};

// Auth middleware
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
    try {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        const user = users.find(u => u.id === req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch {
        return res.status(500).json({ error: 'Authorization check failed' });
    }
};

// Get all events
router.get('/', (req, res) => {
    const { category, status, search } = req.query;
    let filteredEvents = getEvents();

    // Filter by category
    if (category && category !== 'all') {
        filteredEvents = filteredEvents.filter(e => e.category === category);
    }

    // Filter by status
    const now = new Date('2026-01-30');
    if (status === 'upcoming') {
        filteredEvents = filteredEvents.filter(e => new Date(e.date) >= now);
    } else if (status === 'past') {
        filteredEvents = filteredEvents.filter(e => new Date(e.date) < now);
    }

    // Search filter
    if (search) {
        const query = search.toLowerCase();
        filteredEvents = filteredEvents.filter(e =>
            e.title.toLowerCase().includes(query) ||
            e.description.toLowerCase().includes(query) ||
            e.venue.toLowerCase().includes(query)
        );
    }

    res.json(filteredEvents);
});

// Get single event
router.get('/:id', (req, res) => {
    const events = getEvents();
    const event = events.find(e => e.id === req.params.id);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
});

// Create event (admin only)
router.post('/', authenticate, requireAdmin, (req, res) => {
    try {
        const { title, description, date, time, venue, category, image, seats, prizes, teamSize } = req.body;

        if (!title || !description || !date || !time || !venue || !category) {
            return res.status(400).json({ error: 'Title, description, date, time, venue, and category are required' });
        }

        const events = getEvents();
        const newEvent = {
            id: uuidv4(),
            title,
            description,
            date,
            time,
            venue,
            category,
            image: image || '/assets/images/event-ai.jpg',
            seats: parseInt(seats) || 100,
            registered: 0,
            prizes: prizes || '',
            teamSize: teamSize || 'Individual'
        };

        events.push(newEvent);
        saveEvents(events);

        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Update event (admin only)
router.put('/:id', authenticate, requireAdmin, (req, res) => {
    try {
        const events = getEvents();
        const index = events.findIndex(e => e.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const updatedEvent = {
            ...events[index],
            ...req.body,
            id: events[index].id, // Prevent ID change
            seats: req.body.seats ? parseInt(req.body.seats) : events[index].seats,
            registered: req.body.registered ? parseInt(req.body.registered) : events[index].registered,
        };

        events[index] = updatedEvent;
        saveEvents(events);

        res.json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Delete event (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
    try {
        const events = getEvents();
        const index = events.findIndex(e => e.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Event not found' });
        }

        events.splice(index, 1);
        saveEvents(events);

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

module.exports = router;
