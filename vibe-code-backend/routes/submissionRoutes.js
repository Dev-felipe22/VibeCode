import express from 'express';
import Submission from '../models/Submission.js';

const router = express.Router();

// Example GET route to get all submissions for a user
router.get('/:email', async (req, res) => {
  try {
    const submissions = await Submission.find({ email: req.params.email });
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Example POST to create or update submission
router.post('/', async (req, res) => {
  const { email, slug, latest, bestRuntime, bestMemory } = req.body;

  try {
    const submission = await Submission.findOneAndUpdate(
      { email, slug },
      { email, slug, latest, bestRuntime, bestMemory },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
