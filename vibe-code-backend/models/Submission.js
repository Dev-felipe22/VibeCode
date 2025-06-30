import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  latest: {
    code: String,
    language: String,
    runtime: Number,
    memory: Number,
    passed: Boolean,
    results: Array,
  },
  bestRuntime: {
    runtime: Number,
    memory: Number,
    code: String,
    language: String,
    results: Array,
  },
  bestMemory: {
    memory: Number,
    runtime: Number,
    code: String,
    language: String,
    results: Array,
  }
}, {
  timestamps: true
});

submissionSchema.index({ email: 1, slug: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
