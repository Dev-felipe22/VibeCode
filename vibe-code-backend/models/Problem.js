// models/Problem.js
import mongoose from "mongoose";

const langBundle = {
  python: String,
  java:   String,
  cpp:    String,
};

const problemSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    slug:        { type: String, required: true, unique: true },
    difficulty:  { type: Number, min: 1, max: 5, required: true },
    tags:        [String],

    description: String,
    constraints: [String],

    examples: [
      {
        input:       String,
        output:      String,
        explanation: String,
      },
    ],

    hints: [String],

    starterCode: langBundle,   // what the user sees / edits
    driverCode:  langBundle,   // hidden harness concatenated at submit time

    testCases: [
      {
        input:          String,  // fed to stdin
        expectedOutput: String,  // compared to stdout
      },
    ],

    author:       String,
    isPublished:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;