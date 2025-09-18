const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Initialize Firestore
const db = admin.firestore();

// GET last visit for a section
router.get('/last-visit', async (req, res) => {
  const { section } = req.query;
  try {
    const doc = await db.collection('lastVisits').doc(section).get();
    if (doc.exists) {
      res.status(200).json({ lastVisited: doc.data().timestamp });
    } else {
      res.status(200).json({ lastVisited: null });
    }
  } catch (err) {
    console.error('Error getting last visit:', err);
    res.status(500).json({ error: 'Server error retrieving last visit.' });
  }
});

// POST update last visit for a section
router.post('/last-visit', async (req, res) => {
  const { section } = req.body;
  try {
    await db.collection('lastVisits').doc(section).set({
      timestamp: new Date().toISOString()
    });
    res.status(200).json({ message: 'Last visit updated successfully.' });
  } catch (err) {
    console.error('Error updating last visit:', err);
    res.status(500).json({ error: 'Server error updating last visit.' });
  }
});

module.exports = router;
