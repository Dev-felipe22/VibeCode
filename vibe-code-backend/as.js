import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Submission from './models/Submission.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to MongoDB');

await Submission.updateMany({}, {
  $unset: {
    'latest.results': "",
    'bestRuntime.results': "",
    'bestMemory.results': ""
  }
});

console.log('Removed `results` fields inside latest, bestRuntime, and bestMemory');

await mongoose.disconnect();
