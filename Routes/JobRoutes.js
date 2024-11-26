const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  postJob,
  getAllJobs,
  getJobById,
  getJobsByEmail,
  updateJob,
  deleteJob,
} = require('../Controllers/JobController');
const { sendCompanyEmail, sendApplicantEmail } = require('../Config/mailer'); 

const JobPortalModel = require("../Models/JobPortalModel");
const router = express.Router();

// Set up Multer for handling file uploads

// 1. Configuration for CV uploads
const cvStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder for CV uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Name the file with a timestamp
  }
});

// 2. Configuration for Logo uploads (images only)
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../assets/logo')); // Folder for logo uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Keep original file extension
    cb(null, `logo-${Date.now()}${ext}`); // Name logo file with a timestamp
  }
});

// 3. File filter for logo uploads (only images allowed)
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // Accept file if it is an image
  } else {
    cb(new Error('Not an image! Please upload only images.'), false); // Reject if not an image
  }
};

// 4. Middleware for CV uploads (no file filter)
const uploadCv = multer({ storage: cvStorage });

// 5. Middleware for Logo uploads (with image filter)
const uploadLogo = multer({
  storage: logoStorage,
  fileFilter: multerFilter,
});

// Routes using both configurations:

// Route for applying to a job (CV upload)
router.post('/apply-job', uploadCv.single('cv'), async (req, res) => {
  // const jobId = req.params.id;
  const {jobId, firstName, lastName, email, mobileNumber, houseAddress, gender, age, roleAppliedFor, yearsExperience, salaryExpectation} = req.body;
  const cvFilePath = req.file.path; // Access the CV file path
  const job = await JobPortalModel.findById(jobId);
  const companyEmail = job.companyEmail;

  const applicantDetails = {
    firstName,
    lastName,
    email,
    mobileNumber,
    houseAddress,
    gender,
    age,
    roleAppliedFor,
    yearsExperience,
    salaryExpectation,
    jobId,
    cvFilePath
  };

  try {
    // Send emails
    await sendCompanyEmail(applicantDetails, cvFilePath, companyEmail); // Send email to company
    await sendApplicantEmail(applicantDetails); // Send confirmation to the applicant

    res.json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error processing application:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
});

// Route for posting a job (Logo upload)
router.post('/post-job', uploadLogo.single('companyLogo'), async (req, res) => {
  try {
    await postJob(req, res);
  } catch (error) {
    res.status(500).send({ message: "Error posting job", error: error.message });
  }
});

// Route for uploading a company logo
router.post('/upload-logo', uploadLogo.single('logo'), (req, res) => {
  res.send('Logo uploaded successfully!');
});

// Other job-related routes
router.get('/all-jobs', async (req, res) => {
  try {
    await getAllJobs(req, res);
  } catch (error) {
    res.status(500).send({ message: "Error fetching jobs", error: error.message });
  }
});

router.get('/all-jobs/:id', async (req, res) => {
  try {
    await getJobById(req, res);
  } catch (error) {
    res.status(500).send({ message: "Error fetching job", error: error.message });
  }
});

router.patch('/update-job/:id', uploadLogo.single('companyLogo'), async (req, res) => {
  try {
    await updateJob(req, res);
  } catch (error) {
    res.status(500).send({ message: "Error updating job", error: error.message });
  }
});

router.delete('/job/:id', async (req, res) => {
  try {
    await deleteJob(req, res);
  } catch (error) {
    res.status(500).send({ message: "Error deleting job", error: error.message });
  }
});

module.exports = router;


