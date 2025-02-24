// Load environment variables and necessary modules
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import referralRoutes from './routes/referralRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS to allow cross-origin requests from the frontend
app.use(cors());

// Use body-parser middleware to handle JSON request bodies
app.use(bodyParser.json());

// Use the referral routes for any requests to /api/referrals
app.use('/api/referrals', referralRoutes);

// Start the Express server and log the port to the console
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
