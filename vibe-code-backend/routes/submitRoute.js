import express from 'express';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

// POST /submit
router.post('/', async (req, res) => {
  const { slug, language, code } = req.body;

  if (!slug || !language || !code) {
    return res.status(400).json({ error: 'slug, language, and code are required' });
  }

  try {
    // Get the problem from the database
    const problem = await Problem.findOne({ slug });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const testCases = problem.testCases;
    const results = [];

    // Submit each test case
    for (const testCase of testCases) {
      const payload = {
        language_id: getLanguageId(language),
        source_code: code,
        stdin: testCase.input,
      };

      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'x-rapidapi-key': process.env.JUDGE0_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.stdout?.trim() || '',
        passed: result.stdout?.trim() === testCase.expectedOutput,
        status: result.status?.description,
      });
    }

    res.json({ results });

  } catch (err) {
    console.error('Error submitting code:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper to map language to Judge0 language_id
function getLanguageId(language) {
  const map = {
    python: 71,
    cpp: 54,
    java: 62,
  };
  return map[language.toLowerCase()] || 71; // Default to Python
}

export default router;
