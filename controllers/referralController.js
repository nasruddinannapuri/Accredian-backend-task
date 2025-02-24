// Import PrismaClient for database operations, sendReferralEmail to notify users, and Joi for input validation
import { PrismaClient } from '@prisma/client';
import { sendReferralEmail } from '../utils/emailService.js';
import Joi from 'joi';

// Initialize Prisma client for interacting with our MySQL database
const prisma = new PrismaClient();

// Define a validation schema for referral data using Joi
// This ensures that every referral has all required fields and that emails follow a proper format
const referralSchema = Joi.object({
  referrerName: Joi.string().trim().min(1).required(),
  referrerEmail: Joi.string().email().required(),
  refereeName: Joi.string().trim().min(1).required(),
  refereeEmail: Joi.string().email().required(),
});

// Helper function to determine the next available ID, ensuring gap-free numbering.
// This function retrieves all referral IDs in ascending order and finds the smallest missing number.
async function getNextAvailableId() {
  // Retrieve referral IDs sorted in ascending order
  const referrals = await prisma.referral.findMany({
    orderBy: { id: 'asc' },
    select: { id: true },
  });
  
  let nextId = 1;
  // Loop through existing IDs to find a gap
  for (const ref of referrals) {
    if (ref.id === nextId) {
      nextId++;
    } else if (ref.id > nextId) {
      // Found a gap, so break out and use nextId
      break;
    }
  }
  return nextId;
}

// Main function to create a new referral.
// This function validates input, checks for duplicates, assigns a custom gap-free ID, and then creates the referral record.
export const createReferral = async (req, res) => {
  try {
    // Validate incoming referral data against our schema
    const { error, value } = referralSchema.validate(req.body);
    if (error) {
      // Return a 400 Bad Request if validation fails
      return res.status(400).json({ error: error.details[0].message });
    }

    // Destructure validated fields
    const { referrerName, referrerEmail, refereeName, refereeEmail } = value;

    // Check if this candidate has already been referred by any referrer
    const existingCandidate = await prisma.referral.findFirst({
      where: { refereeEmail: refereeEmail },
    });
    if (existingCandidate) {
      // Return a 409 Conflict error if candidate referral exists
      return res.status(409).json({ error: 'This candidate has already been referred.' });
    }

    // Optionally, check if the same referrer has already referred this candidate (extra precaution)
    const existingReferral = await prisma.referral.findFirst({
      where: { referrerEmail: referrerEmail, refereeEmail: refereeEmail },
    });
    if (existingReferral) {
      // Return a 409 Conflict error if the same referrer already referred the candidate
      return res.status(409).json({ error: 'You have already referred this candidate.' });
    }

    // Determine the next available ID so that our IDs remain gap-free
    const nextId = await getNextAvailableId();

    // Create a new referral record using the computed ID and validated data
    const referral = await prisma.referral.create({
      data: {
        id: nextId,
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
      },
    });

    // Attempt to send an email confirmation; if it fails, log the error but don't stop the process
    try {
      await sendReferralEmail({ referrerName, referrerEmail, refereeName, refereeEmail });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    // Respond with a success message and the created referral object
    res.status(201).json({ message: 'Referral submitted successfully', referral });
  } catch (error) {
    // Log unexpected errors and send a generic server error message
    console.error(error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};
