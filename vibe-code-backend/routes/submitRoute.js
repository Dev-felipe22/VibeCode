import express from 'express';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

// Helper: map a language name to Judge0 language_id
function getLanguageId(language) {
  const map = {
    python: 71,
    cpp: 54,
    java: 62,
  };
  return map[language.toLowerCase()] || 71; // default to Python
}

// POST /api/submit
router.post('/', async (req, res) => {
  const { slug, language, code } = req.body;
  if (!slug || !language || !code) {
    return res
      .status(400)
      .json({ error: 'slug, language, and code are required' });
  }

  try {
    // Load problem and its test cases
    const problem = await Problem.findOne({ slug });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    const testCases = problem.testCases || [];

    const results = [];
    for (const tc of testCases) {
      const payload = {
        language_id: getLanguageId(language),
        source_code: code,
        stdin: tc.input,
      };

      const apiRes = await fetch(
        'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'x-rapidapi-key': process.env.JUDGE0_API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );
      const jr = await apiRes.json();

      const actualOutput = (jr.stdout || '').trim();
      const expectedOutput = (tc.expectedOutput || '').trim();
      const passed = actualOutput === expectedOutput;

      results.push({
        input: tc.input,
        expectedOutput,
        actualOutput,
        passed,
        status: jr.status?.description,
        time: jr.time ?? null,
        memory: jr.memory ?? null,
      });
    }

    const overallPassed = results.every(r => r.passed);
    const avgTime = results.reduce((sum, r) => sum + (parseFloat(r.time) || 0), 0) / results.length;
    const avgMemory = results.reduce((sum, r) => sum + (parseInt(r.memory) || 0), 0) / results.length;

    return res.json({
      passed: overallPassed,
      avgTime,
      avgMemory,
      results,
    });

  } catch (err) {
    console.error('Error in /api/submit:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
