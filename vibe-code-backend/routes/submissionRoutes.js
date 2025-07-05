import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();

// ----- Configuration for Judge0 API -----
const JUDGE0_BASE_URL = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_HEADERS = {
  'Content-Type': 'application/json',
  'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
};

// Acceptable languages and mapping to Judge0 language IDs
const VALID_LANGUAGES = ['python', 'cpp', 'java'];
const LANGUAGE_ID_MAP = {
  python: 71,
  cpp: 54,
  java: 62
};

// Helper: submit a single test to Judge0 and return its result
async function submitToJudge0(languageId, source_code, stdin) {
  const payload = {
    language_id: languageId,
    source_code,
    stdin
  };
  const url = `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`;
  const response = await axios.post(url, payload, { headers: JUDGE0_HEADERS });
  return response.data;
}

// Helper: calculate average of an array of numbers
function getAverage(arr) {
  if (!arr.length) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

// ----- New: Evaluate user code against all test cases -----
// POST /api/submissions/evaluate
router.post('/evaluate', async (req, res) => {
  const { email, slug, code, language } = req.body;

  if (!email || !slug || !code || !language) {
    return res.status(400).json({ error: 'email, slug, code, and language are required' });
  }
  if (typeof language !== 'string' || !VALID_LANGUAGES.includes(language.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid language' });
  }

  try {
    // Verify user and problem exist
    const userExists = await User.exists({ email });
    if (!userExists) return res.status(404).json({ error: 'User not found' });

    const problem = await Problem.findOne({ slug });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const testCases = problem.testCases || [];
    let allPassed = true;
    const runtimes = [];
    const memories = [];

    // Execute each test case sequentially
    for (const { input, expectedOutput } of testCases) {
      const langId = LANGUAGE_ID_MAP[language.toLowerCase()];
      const result = await submitToJudge0(langId, code, input);

      // Compare outputs (trimmed)
      const actual = (result.stdout || '').trim();
      const expected = (expectedOutput || '').trim();
      if (actual !== expected) allPassed = false;

      runtimes.push(result.time ? parseFloat(result.time) : 0);
      memories.push(result.memory ? parseInt(result.memory, 10) : 0);
    }

    const avgRuntime = getAverage(runtimes);
    const avgMemory = getAverage(memories);

    // Upsert submission record
    let submission = await Submission.findOne({ email, slug });
    const latest = { code, language, runtime: avgRuntime, memory: avgMemory, passed: allPassed };

    if (!submission) {
      submission = new Submission({
        email,
        slug,
        latest,
        bestRuntime: allPassed ? latest : null,
        bestMemory: allPassed ? latest : null
      });
    } else {
      submission.latest = latest;
      if (allPassed) {
        if (!submission.bestRuntime || avgRuntime < submission.bestRuntime.runtime) {
          submission.bestRuntime = latest;
        }
        if (!submission.bestMemory || avgMemory < submission.bestMemory.memory) {
          submission.bestMemory = latest;
        }
      }
    }
    await submission.save();

    // Respond with overall result and details
    res.json({
      passed: allPassed,
      avgRuntime,
      avgMemory,
      details: { runtimes, memories }
    });

  } catch (error) {
    console.error('Error in /evaluate:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ----- Existing: Create or update a single submission record -----
// POST /api/submissions
router.post('/', async (req, res) => {
  const { email, slug, latest } = req.body;

  // Validate presence
  if (!email || !slug || !latest) {
    return res.status(400).json({ error: 'email, slug, and latest submission data are required' });
  }
  // Validate structure
  if (typeof latest.language !== 'string' || !VALID_LANGUAGES.includes(latest.language.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid language' });
  }
  if (typeof latest.code !== 'string' || latest.code.trim() === '') {
    return res.status(400).json({ error: 'Code must be a non-empty string' });
  }
  if (typeof latest.passed !== 'boolean') {
    return res.status(400).json({ error: 'Passed must be a boolean' });
  }
  if (!Number.isInteger(latest.runtime) || latest.runtime < 0) {
    return res.status(400).json({ error: 'Runtime must be a non-negative integer' });
  }
  if (!Number.isInteger(latest.memory) || latest.memory < 0) {
    return res.status(400).json({ error: 'Memory must be a non-negative integer' });
  }

  try {
    // Verify problem and user exist
    const problemExists = await Problem.exists({ slug });
    if (!problemExists) return res.status(404).json({ error: 'Problem slug does not exist' });
    const userExists = await User.exists({ email });
    if (!userExists) return res.status(404).json({ error: 'User email does not exist' });

    // Upsert logic
    let submission = await Submission.findOne({ email, slug });
    if (!submission) {
      submission = new Submission({
        email,
        slug,
        latest,
        bestRuntime: latest.passed ? latest : null,
        bestMemory: latest.passed ? latest : null
      });
    } else {
      submission.latest = latest;
      if (latest.passed) {
        if (!submission.bestRuntime || latest.runtime < submission.bestRuntime.runtime) {
          submission.bestRuntime = latest;
        }
        if (!submission.bestMemory || latest.memory < submission.bestMemory.memory) {
          submission.bestMemory = latest;
        }
      }
    }

    await submission.save();
    res.status(201).json(submission);

  } catch (err) {
    console.error('Error creating/updating submission:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ----- Existing: Get all submissions for a user -----
// GET /api/submissions/:email
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const userExists = await User.exists({ email });
    if (!userExists) return res.status(404).json({ error: 'User email does not exist' });

    const submissions = await Submission.find({ email });
    if (!submissions.length) return res.status(404).json({ error: 'No submissions found for this user' });

    res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;