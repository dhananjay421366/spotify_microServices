import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";

// Register User
export const Register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Validate the fields
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // 2. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(406).json({ error: "User already exists" });
  }

  // 3. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Create verification token
  const verification_token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const verification_link = `${process.env.BACKEND_URL}/verify/${verification_token}`;

  // 5. Send verification email
  const mailSuccess = await sendVerificationEmail(email, verification_link);
  if (!mailSuccess) {
    return res.status(500).json({ error: "Failed to send verification email" });
  }

  // 6. Save user in DB
  const user = new User({
    username,
    email,
    password: hashedPassword,
    playList: [],
    verification_token,
    isVerified: false, // new users start as unverified
  });

  await user.save();

  // 7. Success response
  res.status(201).json({
    success: true,
    message:
      "User registered successfully. Please check your email for verification link.",
  });
});

// verifyEmail
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  console.log(token);
  try {
    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user by email and token
    const user = await User.findOne({
      email: decoded.email,
      verification_token: token,
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // mark user as verified
    user.isVerified = true; // you should add `isVerified: { type: Boolean, default: false }` in User schema
    user.verification_token = null; // clear token after success
    await user.save();

    res.status(200).json({ success: "Email verified successfully!" });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(400).json({ error: "Invalid or expired token" });
  }
});

// Login user
export const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required!",
      success: false,
    });
  }

  // 2. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User not found with this email",
      success: false,
    });
  }

  // 3. Check if verified
  if (!user.isVerified) {
    // Re-send verification email
    const verification_token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user.verification_token = verification_token; // update in DB
    await user.save();

    const verification_link = `${process.env.BACKEND_URL}/verify/${verification_token}`;

    const mailSuccess = await sendVerificationEmail(email, verification_link);
    if (!mailSuccess) {
      return res
        .status(500)
        .json({ error: "Failed to send verification email" });
    }

    return res.status(400).json({
      error: "Email not verified. A new verification email has been sent.",
    });
  }

  // 4. Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
      success: false,
    });
  }

  // 5. Assign admin role if email matches
  if (email === process.env.ADMIN_EMAIL) {
    user.role = "admin";
    await user.save();
  }

  // 6. Generate JWT
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // 7. Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only secure in prod
    sameSite: "None",
    maxAge: 60 * 60 * 1000,
  };

  // 8. Send success response
  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json({
      message:
        user.role === "admin"
          ? "Admin login successful"
          : `Welcome ${user.username}`,
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
    });
});

// Forgot Password Controller
export const forgot_password = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1. Validate input
  if (!email) {
    return res.status(400).json({
      message: "Email is required!",
      success: false,
    });
  }

  // 2. Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found", success: false });
  }

  // 3. Generate reset token (valid for 15 minutes)
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  // 4. Save token to user (optional, if you want DB validation)
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  // 5. Create reset link
  // const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`; production
  const resetLink = `${process.env.FRONTEND_URI}/reset-password/${resetToken}`;
  console.log(resetLink);

  // 6. Send email
  const mailSuccess = await sendResetPassword(email, resetLink);
  if (!mailSuccess) {
    return res
      .status(500)
      .json({ error: "Failed to send reset email", success: false });
  }

  return res
    .status(200)
    .json({ message: "Password reset link sent", resetLink, success: true });
});

// Reset Password Controller
export const reset_password = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // 1. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Invalid or expired token", success: false });
  }

  // 2. Find user by ID
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(404).json({ error: "User not found", success: false });
  }

  // (optional) Check stored resetPasswordToken & expiry
  if (
    !user.resetPasswordToken ||
    user.resetPasswordExpire < Date.now() ||
    user.resetPasswordToken !== token
  ) {
    return res
      .status(400)
      .json({ error: "Reset token expired or invalid", success: false });
  }

  // 3. Hash and save new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res
    .status(200)
    .json({ message: "Password reset successful!", success: true });
});

export const getProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Session expired or user not authenticated",
    });
  }

  // Fetch full user from DB
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
});

// logout
export const Logout = asyncHandler(async (req, res) => {
  // 1. Clear JWT cookie
  res.clearCookie("token"); // JWT cookie

  return res.status(200).json({ message: "Logged out successfully" });
});

//  Toggle Add / Remove playlist item
export const addToPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - no token " });
  }

  const user = await User.findById(new mongoose.Types.ObjectId(userId));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // toggle playlist item
  if (user.playList.includes(req.params?.id)) {
    user.playList = user.playList.filter((item) => item !== req.params.id);
    await user.save();
    return res.json({ message: "Removed from playlist", isBookmarked: false });
  }

  user.playList.push(req.params.id);
  await user.save();

  res.status(200).json({ message: "Added to playlist", isBookmarked: true });
});

//  Check bookmark status (for reload)
export const checkBookmarkStatus = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - no token" });
  }

  const user = await User.findById(userId).select("playList");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Compare ObjectIds properly
  const isBookmarked = user.playList.some(
    (item) => item.toString() === req.params.id
  );

  res.status(200).json({ isBookmarked });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, "-password");

  if (!users) {
    return res.status(404).json({
      success: false,
      message: "No users found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    users, // array of user objects
  });
});





/* Email services */
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

// Use secure SMTP instead of 'service' for production reliability
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,   // log everything to console
  debug: true,    // show SMTP connection logs
});


// Send verification email
export const sendVerificationEmail = async (email, verificationLink) => {
  try {
    console.log("📨 Sending verification email...");
    const mailOptions = {
      from: `"Gana11 App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email ✔",
      text: `Click this link to verify your email: ${verificationLink}`,
      html: `<p>Click the button below to verify your email:</p>
             <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;background:#22c55e;color:white;border-radius:5px;text-decoration:none;">Verify Email</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    return false;
  }
};

// Send password reset email
export const sendResetPassword = async (email, link) => {
  try {
    console.log("📨 Sending password reset email...");
    const mailOptions = {
      from: `"Gana11 App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset ✔",
      text: `Click this link to reset your password: ${link}`,
      html: `<p>Click the button below to reset your password:</p>
             <a href="${link}" style="display:inline-block;padding:10px 20px;background:#3b82f6;color:white;border-radius:5px;text-decoration:none;">Reset Password</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Error sending reset email:", error);
    return false;
  }
};
