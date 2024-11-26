const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");
const { sendMail, SendOtp } = require("../Config/mailer");

// Generate a 6-digit random number
let genRandomNum = () => {
  let six = '';
  for (let index = 0; index < 6; index++) {
    let randomNum = Math.floor(Math.random() * 10);
    six += randomNum;
  }
  return six;
};

// Signup Controller
const signUp = async (req, res, next) => {
  const { FullName, UserName, Email, Password, UserType } = req.body;
  
  // Validate the input fields
  if (!FullName || !UserName || !Email || !Password || !UserType) {
    return res.status(400).json({ message: "All Fields are mandatory" });
  }

  // console.log(req.body); // Log request data for debugging
  
  try {
    const ValidateUser = await UserModel.findOne({ Email });
    if (ValidateUser) {
      return res
        .status(403)
        .json({ message: "User already exists, try logging in to your account" });
    }

    // Hash the password before saving the user
    const hashPassword = await bcrypt.hash(Password, 10);

    const newUser = await UserModel.create({
      FullName,
      UserName,
      Email,
      Password: hashPassword,
      UserType,
    });

    if (newUser) {
      // Send confirmation email
      // sendMail(UserName, Email);
      return res.status(200).json({
        message: `Account created successfully for ${newUser.UserName}`,
        status: "success",
      });
    } else {
      return res.status(400).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.log("Error during signup", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login Controller

const login = async (req, res) => {
  const { Email, Password } = req.body;

  // Validate input fields
  if (!Email || !Password) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  try {
    // Check if the user exists
    const user = await UserModel.findOne({ Email });
    if (!user) {
      return res.status(403).json({
        message: "User not found, please create an account.",
      });
    }

    // Compare provided password with stored password
    const isMatch = await bcrypt.compare(Password, user.Password);
  
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid login details." });
    }

    // Generate JWT token
    const SecretKey = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        user: {
          username: user.UserName,
          email: user.Email,
          usertype: user.UserType,
          name: user.FullName
        },
      },
      SecretKey,
      { expiresIn: "90d" } 
    );

    // Send successful response
    return res.status(200).json({
      token, 
      status: "success",
    });
  } catch (error) {
    console.error("Error during login", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};




// Get current user details
const getCurrentUser = async (req, res) => {
  const user = req.user;

  try {
    // Fetch the current user using the email from the JWT token
    const fetchCurrentUser = await UserModel.findOne({ Email: user.Email });

    if (!fetchCurrentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Return limited user details
    const userDetails = {
      UserName: fetchCurrentUser.UserName,
      Email: fetchCurrentUser.Email,
    };

    return res.status(200).json({
      message: "User details retrieved successfully",
      userDetails,
    });
  } catch (error) {
    console.error("Error fetching user", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// Delete Account
const DeleteAccount = async (req, res) => {
  const user = req.user;
  
  if (!user) {
    return res.status(400).json({ message: "Authentication not provided" });
  }

  try {
    const userToDelete = await UserModel.findOneAndDelete({ Email: user.Email });
    if (!userToDelete) {
      return res.status(400).json({
        message: "Unable to delete user at the moment",
        status: "false",
      });
    }

    return res.status(200).json({ message: "User successfully deleted", status: "okay" });
  } catch (error) {
    console.log("Error deleting user", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// OTP Generation
const getOtp = async (req, res) => {
  const { Email } = req.body;

  if (!Email) {
    return res.status(400).json({ message: "Email is mandatory" });
  }

  try {
    const validateEmail = await UserModel.findOne({ Email });
    if (!validateEmail) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    let otp = genRandomNum();
    SendOtp(otp, validateEmail.FullName, Email);

    return res.status(200).json({ message: "Your OTP has been sent successfully" });
  } catch (error) {
    console.log("Error sending OTP", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { signUp, login, getOtp, DeleteAccount, getCurrentUser };
