// Import Express to create a router and the createReferral controller function
import express from 'express';
import { createReferral } from '../controllers/referralController.js';

const router = express.Router();

// Define a POST route for creating a referral
router.post('/', createReferral);

// Export the router so it can be used in our main server file
export default router;
