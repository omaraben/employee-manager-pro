import express from 'express';
import cors from 'cors';
import { query } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    res.json({
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User routes
app.post('/api/users', async (req, res) => {
  try {
    const result = await query(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [req.body.email, req.body.password, req.body.name, req.body.role]
    );
    res.json({
      id: result.insertId.toString(),
      ...req.body
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role FROM users');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Entry routes
app.post('/api/entries', async (req, res) => {
  try {
    const result = await query(
      `INSERT INTO entries (
        user_id, name, serial_numbers, id_number, 
        phone_number, van_shop, allocation_date, location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.user_id,
        req.body.name,
        req.body.serial_numbers,
        req.body.id_number,
        req.body.phone_number,
        req.body.van_shop,
        req.body.allocation_date,
        req.body.location
      ]
    );
    res.json({
      id: result.insertId.toString(),
      ...req.body,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/entries', async (req, res) => {
  try {
    const entries = await query('SELECT * FROM entries ORDER BY created_at DESC');
    res.json(entries);
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/entries/user/:userId', async (req, res) => {
  try {
    const entries = await query(
      'SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.json(entries);
  } catch (error) {
    console.error('Get user entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});