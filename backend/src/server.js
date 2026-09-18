const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const clubsRoutes = require('./routes/clubs');
const registrationsRoutes = require('./routes/registrations');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/registrations', registrationsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SRM Events API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 SRM Events API Server running on http://localhost:${PORT}`);
  console.log(`📝 API Endpoints:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/me`);
  console.log(`   - GET  /api/auth/users (admin)`);
  console.log(`   - GET  /api/events`);
  console.log(`   - GET  /api/events/:id`);
  console.log(`   - POST /api/events (admin)`);
  console.log(`   - PUT  /api/events/:id (admin)`);
  console.log(`   - DELETE /api/events/:id (admin)`);
  console.log(`   - GET  /api/clubs`);
  console.log(`   - POST /api/registrations`);
  console.log(`   - GET  /api/registrations`);
  console.log(`   - GET  /api/registrations/all (admin)`);
});
