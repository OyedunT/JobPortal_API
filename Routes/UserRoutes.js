const express = require("express");
const { signUp, login, getOtp, DeleteAccount, getCurrentUser } = require("../Controllers/UserControllers");
const verifyToken = require("../Middlewares/VerifyToken");
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/getOtp", getOtp);
router.post("/getCurrentUserDetails", verifyToken, getCurrentUser);
router.post("/deleteAccount", verifyToken, DeleteAccount);

module.exports = router;

