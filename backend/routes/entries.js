import express from 'express';
import { db } from '../config/database.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { user_id, name, serial_numbers, id_number, phone_number, van_shop, allocation_date, location } = req.body;
    
    const [result] = await db.execute(
      `INSERT INTO entries (user_id, name, serial_numbers, id_number, phone_number, 
        van_shop, allocation_date, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, name, serial_numbers, id_number, phone_number, van_shop, allocation_date, location]
    );

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM entries ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;