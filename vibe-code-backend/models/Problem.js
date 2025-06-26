import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: Number, min: 1, max: 5, required: true },
  tags: [String],
  description: String,
  constraints: [String],
  examples: [
    {
      input: String,
      output: String,
      explanation: String
    }
  ],
  hints: [String],
  starterCode: {
    python: String,
    java: String,
    cpp: String
  },
  testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ],
  author: String,
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
