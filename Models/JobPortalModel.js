const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    jobTitle: { 
      type: String, 
      required: [true, "Job title is required"] 
    },
    companyName: { 
      type: String, 
      required: [true, "Company name is required"] 
    },
    companyLogo: { 
      type: String, // This will store the path to the uploaded logo
      default: null 
    },
    minPrice: { 
      type: Number, 
      required: [true, "Minimum salary is required"] 
    },
    maxPrice: { 
      type: Number, 
      required: [true, "Maximum salary is required"] 
    },
    salaryType: { 
      type: String, 
      enum: ["Hourly", "Monthly", "Yearly"], 
      required: [true, "Salary type is required"] 
    },
    jobLocation: { 
      type: String, 
      required: [true, "Job location is required"] 
    },
    postingDate: { 
      type: Date, 
      required: [true, "Posting date is required"] 
    },
    // experienceLevel: { 
    //   type: String, 
    //   enum: ["Internship", "Work remotely", "Any experience"], 
    //   required: [true, "Experience level is required"] 
    // },
    // employmentType: { 
    //   type: String, 
    //   enum: ["Full-time", "Part-time", "Temporary"], 
    //   required: [true, "Employment type is required"] 
    // },
    // skills: {
    //   type: [String], 
    //   required: [true, "At least one skill is required"]
    // },
    // roleAppliedFor: { 
    //   type: String, 
    //   required: true 
    // },
    companyEmail: { 
      type: String, 
      required: true ,
      unique: [true, "Email already in use"]
    },
    
    // description: { 
    //   type: String 
    // }
  },

  { timestamps: true }
);

const JobModel = mongoose.model("Job", JobSchema);

module.exports = JobModel;

