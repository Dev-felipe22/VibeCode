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
  },
  bestRuntime: {
    runtime: Number,
    memory: Number,
    code: String,
    language: String,
  },
  bestMemory: {
    runtime: Number,
	memory: Number,
    code: String,
    language: String,
  }
}, {
  timestamps: true
});

submissionSchema.index({ email: 1, slug: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
