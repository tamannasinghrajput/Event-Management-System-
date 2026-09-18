const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const JWT_SECRET = 'srm-events-2k26-secret-key';
const REGISTRATIONS_FILE = path.join(__dirname, '../data/registrations.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Helper to read/write registrations
const getRegistrations = () => {
    try {
        const data = fs.readFileSync(REGISTRATIONS_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

const saveRegistrations = (registrations) => {
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2));
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

// Register for an event
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, regNumber, department, year, eventId, eventTitle } = req.body;

        if (!name || !email || !regNumber || !eventId) {
            return res.status(400).json({ error: 'Name, email, registration number, and event ID are required' });
        }

        const registrations = getRegistrations();

        // Check if already registered for this event
        const existingRegistration = registrations.find(
            r => r.eventId === eventId && r.regNumber === regNumber
        );

        if (existingRegistration) {
            return res.status(400).json({ error: 'You are already registered for this event' });
        }

        // Create new registration
        const newRegistration = {
            id: uuidv4(),
            name,
            email,
            phone: phone || '',
            regNumber,
            department: department || '',
            year: year || '',
            eventId,
            eventTitle: eventTitle || '',
            status: 'confirmed',
            registeredAt: new Date().toISOString()
        };

        registrations.push(newRegistration);
        saveRegistrations(registrations);

        res.status(201).json({
            message: 'Registration successful',
            registration: newRegistration
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register for event' });
    }
});

// Get all registrations (admin only)
router.get('/all', authenticate, requireAdmin, (req, res) => {
    try {
        const registrations = getRegistrations();
        res.json(registrations);
    } catch (error) {
        console.error('Get all registrations error:', error);
        res.status(500).json({ error: 'Failed to get registrations' });
    }
});

// Get registrations (optionally filtered by user)
router.get('/', (req, res) => {
    try {
        const { email, regNumber } = req.query;
        let registrations = getRegistrations();

        // Filter by email or registration number if provided
        if (email) {
            registrations = registrations.filter(r => r.email === email);
        }
        if (regNumber) {
            registrations = registrations.filter(r => r.regNumber === regNumber);
        }

        res.json(registrations);
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({ error: 'Failed to get registrations' });
    }
});

// Get user's registrations (requires auth)
router.get('/my-registrations', authenticate, (req, res) => {
    try {
        const registrations = getRegistrations();
        const userRegistrations = registrations.filter(r => r.email === req.user.email);
        res.json(userRegistrations);
    } catch (error) {
        console.error('Get user registrations error:', error);
        res.status(500).json({ error: 'Failed to get registrations' });
    }
});

// Cancel registration
router.delete('/:id', authenticate, (req, res) => {
    try {
        const registrations = getRegistrations();
        const index = registrations.findIndex(r => r.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        // Check if user owns this registration or is admin
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        const currentUser = users.find(u => u.id === req.user.id);
        const isAdmin = currentUser && currentUser.role === 'admin';

        if (registrations[index].email !== req.user.email && !isAdmin) {
            return res.status(403).json({ error: 'Not authorized to cancel this registration' });
        }

        registrations.splice(index, 1);
        saveRegistrations(registrations);

        res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        console.error('Cancel registration error:', error);
        res.status(500).json({ error: 'Failed to cancel registration' });
    }
});

module.exports = router;
