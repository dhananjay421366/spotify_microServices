import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register User
export const Register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);

  // validate the fields
  if (!username || !email || !password) {
    return res.status(400).json({
      error: "All fields are required !",
    });
  }

  // check user is already exists by Email
  const ExistingUserByEmail = await User.findOne({ email });

  if (ExistingUserByEmail) {
    return res.status(406).json({ error: "User is already exists" });
  }
  // hash the password

  const hashedPassword = await bcrypt.hash(password, 8);

  // create new user
  const user = new User({
    username,
    email,
    password: hashedPassword,
    playList: [],
  });

  // save the user in db
  await user.save();
  res.status(201).json({
    success: "User registered successfully",
  });
});

// Login user
export const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validate fields
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // check user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ error: "User does not exist with this email" });
  }

  // check password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // force role to admin if email matches
  if (email === process.env.ADMIN_EMAIL) {
    user.role = "admin";
    await user.save(); // ✅ update role permanently in DB
  }

  // create JWT token
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // store JWT in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  // store token also in session
  req.session.user = {
    _id: user._id,
    email: user.email,
    role: user.role,
    token,
  };

  return res.status(200).json({
    message:
      user.role === "admin" ? "Admin login successful" : "Login successful",
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});


export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    user,
    success: "get profile successfully",
  });
});

// logout
export const Logout = asyncHandler(async (req, res) => {
  // 1. Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res
        .status(500)
        .json({ error: "Could not log out, please try again" });
    }

    // 2. Clear the session cookie
    res.clearCookie("connect.sid"); // session cookie

    // 3. Clear JWT cookie
    res.clearCookie("token"); // JWT cookie

    return res.status(200).json({ message: "Logged out successfully" });
  });
});

// addToPlaylist
export const addToPlaylist = asyncHandler(async (req, res) => {
  const userId = req.session?.user?._id || req.user?._id; // session OR JWT

  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized - no token or session",
    });
  }

  const user = await User.findById(new mongoose.Types.ObjectId(userId));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // toggle playlist item
  if (user.playList.includes(req.params.id)) {
    user.playList = user.playList.filter((item) => item !== req.params.id);
    await user.save();
    return res.json({ message: "Removed from playlist" });
  }

  user.playList.push(req.params.id);
  await user.save();

  res.status(200).json({ message: "Added to playlist" });
});
