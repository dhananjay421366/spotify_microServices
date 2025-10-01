// =======================
// Imports
// =======================
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { User } from "../models/user.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";

dotenv.config();

// =======================
// Register User
// =======================
export const Register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields are required!" });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(406).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    playList: [],
    isVerified: true // since no email verification
  });
  await user.save();

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    user: { _id: user._id, username: user.username, email: user.email }
  });
});

// =======================
// Login User
// =======================
export const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required!", success: false });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found", success: false });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials", success: false });

  if (email === process.env.ADMIN_EMAIL) { 
    user.role = "admin"; 
    await user.save(); 
  }

  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "None", maxAge: 60*60*1000 };

  res.status(200).cookie("token", token, cookieOptions).json({
    message: user.role === "admin" ? "Admin login successful" : `Welcome ${user.username}`,
    success: true,
    data: { token, user: { _id: user._id, username: user.username, email: user.email, role: user.role, isVerified: user.isVerified } }
  });
});

// =======================
// Forgot Password
// =======================
export const forgot_password = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required!", success: false });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found", success: false });

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 15*60*1000;
  await user.save();

  res.status(200).json({ message: "Password reset token generated.", resetToken, success: true });
});

// =======================
// Reset Password
// =======================
export const reset_password = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  let decoded;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET); }
  catch { return res.status(400).json({ error: "Invalid or expired token", success: false }); }

  const user = await User.findById(decoded.id);
  if (!user) return res.status(404).json({ error: "User not found", success: false });

  if (!user.resetPasswordToken || user.resetPasswordExpire < Date.now() || user.resetPasswordToken !== token)
    return res.status(400).json({ error: "Reset token expired or invalid", success: false });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful!", success: true });
});

// =======================
// Profile, Logout & Playlist
// =======================
export const getProfile = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Session expired" });
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.status(200).json({ success: true, message: "User fetched successfully", user });
});

export const Logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

export const addToPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = await User.findById(new mongoose.Types.ObjectId(userId));
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.playList.includes(req.params?.id)) {
    user.playList = user.playList.filter(item => item !== req.params.id);
    await user.save();
    return res.json({ message: "Removed from playlist", isBookmarked: false });
  }

  user.playList.push(req.params.id);
  await user.save();
  res.status(200).json({ message: "Added to playlist", isBookmarked: true });
});

export const checkBookmarkStatus = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = await User.findById(userId).select("playList");
  if (!user) return res.status(404).json({ error: "User not found" });

  const isBookmarked = user.playList.some(item => item.toString() === req.params.id);
  res.status(200).json({ isBookmarked });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, "-password");
  if (!users) return res.status(404).json({ success: false, message: "No users found" });
  res.status(200).json({ success: true, message: "Users fetched successfully", users });
});
