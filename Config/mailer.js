const nodemailer = require('nodemailer');
require('dotenv').config(); // Make sure to load your environment variables

// Create transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.COMPANY_EMAIL, // Your company email
    pass: process.env.COMPANY_EMAIL_PASSWORD, // Your email password or app password
  },
});

// Function to send email to the company
const sendCompanyEmail = async (applicantDetails, cvFilePath, companyEmail) => {
  const { firstName, lastName, email, mobileNumber, roleAppliedFor } = applicantDetails;
  const mailOptions = {
    from: process.env.COMPANY_EMAIL,
    to: companyEmail, // 
    subject: `New Job Application for ${roleAppliedFor}`,
    text: `You have received a new job application.
    Applicant Name: ${firstName} ${lastName}
    Email: ${email}
    Mobile: ${mobileNumber}
    CV: ${cvFilePath}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending company email:", error);
    throw new Error('Failed to send email to the company.');
  }
};

// Function to send confirmation email to the applicant
const sendApplicantEmail = async (applicantDetails) => {
  const { firstName, email, roleAppliedFor } = applicantDetails;
  const mailOptions = {
    from: process.env.COMPANY_EMAIL,
    to: email, // Applicant's email
    subject: 'Application Received',
    text: `Dear ${firstName},

    Thank you for applying for the ${roleAppliedFor} role. 
    We have received your application and will contact you if you are shortlisted.

    Best regards,
    The Company`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending applicant email:", error);
    throw new Error('Failed to send email to the applicant.');
  }
};

module.exports = {
  sendCompanyEmail,
  sendApplicantEmail,
};


