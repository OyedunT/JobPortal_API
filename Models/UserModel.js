const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  FullName: { type: String, required: [true, "FullName is Required"] },
  UserName: { type: String, required: [true, "UserName is Required"] },
  Email: { 
    type: String, 
    required: [true, "Email is Required"],
    unique: [true, "Email already in use"]
  },
  Password: { 
    type: String, 
    required: true,
    minlength: [6, "Password must not be less than 6 characters"],
  },
  UserType: { 
    type: String, 
    enum: ['employee', 'company'], 
    required: true 
  },

}, { timestamps: true });

let UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
