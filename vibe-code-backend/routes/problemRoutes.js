// problemRoutes.js
import express from 'express';
import Problem from '../models/Problem.js';

const router = express.Router();

// GET all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find({ isPublished: true });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new problem
router.post('/', async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET a single problem by slug (only if published)
router.get('/:slug', async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug, isPublished: true });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
