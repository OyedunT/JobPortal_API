const { ObjectId } = require('mongodb');
const JobPortalModel = require("../Models/JobPortalModel");

// POST: Create a new job
async function postJob(req, res) {
  try {
    const body = req.body;
    body.createdAt = new Date();
    const file = req.file;
    console.log(req.body.companyEmail)

    if (!file) {
      return res.status(400).send({ message: "Logo upload failed", status: false });
    }

    body.companyLogo = file.filename;
    const result = await JobPortalModel.create(body);

    if (result) {
      return res.status(200).send({ message: "Job posted successfully", data: result });
    } else {
      return res.status(404).send({ message: "Cannot insert! Try again later", status: false });
    }
  } catch (error) {
    res.status(500).send({ message: "Error posting job", error: error.message });
  }
}

// GET: All jobs
async function getAllJobs(req, res) {
  try {
    const jobs = await JobPortalModel.find();
    res.status(200).send(jobs);
  } catch (error) {
    res.status(500).send({ message: "Error fetching jobs", error: error.message });
  }
}

// GET: Single job by ID
async function getJobById(req, res) {
  try {
    const id = req.params.id;
    const job = await JobPortalModel.findOne({ _id: new ObjectId(id) });
    if (job) {
      res.status(200).send(job);
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching job", error: error.message });
  }
}

// GET: Jobs by email
async function getJobsByEmail(req, res) {
  try {
    const jobs = await JobPortalModel.find({ postedBy: req.params.email }).toArray();
    res.status(200).send(jobs);
  } catch (error) {
    res.status(500).send({ message: "Error fetching jobs by email", error: error.message });
  }
}

// PATCH: Update a job
async function updateJob(req, res) {
  try {
    const id = req.params.id;
    const jobData = req.body;
    const file = req.file;

    if (file) {
      jobData.companyLogo = file.filename;
    }

    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = { $set: { ...jobData } };

    const result = await JobPortalModel.updateOne(filter, updateDoc, options);
    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      res.status(200).send({ message: "Job updated successfully", data: result });
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error updating job", error: error.message });
  }
}

// DELETE: Remove a job
async function deleteJob(req, res) {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await JobPortalModel.deleteOne(filter);
    if (result.deletedCount > 0) {
      res.status(200).send({ message: "Job deleted successfully" });
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error deleting job", error: error.message });
  }
}

module.exports = {
  postJob,
  getAllJobs,
  getJobById,
  getJobsByEmail,
  updateJob,
  deleteJob
};
