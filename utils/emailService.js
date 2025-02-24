// Import nodemailer to handle sending emails
import nodemailer from 'nodemailer';

// Create a transporter object using Gmail service and authentication details from environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email account to send from
    pass: process.env.EMAIL_PASS, // App password for secure authentication
  },
});

// Function to send a referral confirmation email
// It constructs an email with the referrer's name, candidate's name, and a thank-you note
export const sendReferralEmail = async ({ referrerName, referrerEmail, refereeName, refereeEmail }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: referrerEmail, // Send email to the referrer; adjust if needed
    subject: 'Referral Submitted Successfully',
    text: `Hello ${referrerName},\n\nThank you for referring ${refereeName}. We have received your referral and will process it shortly.\n\nBest regards,\nTeam`,
  };

  // Return the result of sending the email; errors are handled by the caller
  return transporter.sendMail(mailOptions);
};
