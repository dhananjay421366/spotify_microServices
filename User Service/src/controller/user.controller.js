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

// login the user 
export const Login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // ✅ Validate input (check both, not OR)
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required!", success: false });
    }

    // ✅ Find user by email
    const existedUser = await User.findOne({ email });

    if (!existedUser) {
        return res.status(404).json({
            message: "User not found",
            success: false
        });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, existedUser.password);
    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid credentials",
            success: false
        });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
        { _id: existedUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
    );

    // ✅ Cookie options
    const cookiesOptions = {
        httpOnly: true,
        secure: true,        // ❌ remove in local development if not using https
        sameSite: "None",    // ❌ change to "Lax" if CORS issues
        maxAge: 60 * 60 * 1000
    };

    // ✅ Send response
    return res
        .status(200)
        .cookie("token", token, cookiesOptions)
        .json({
            message: `Welcome ${existedUser.name}`,
            success: true,
            data: {
                token,
                user: {
                    _id: existedUser._id,
                    name: existedUser.name,
                    email: existedUser.email,
                    username: existedUser.username,
                }
            }
        });
});


export const getProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: req.user,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Session expired or user not authenticated",
    });
  }
});

// logout
export const Logout = asyncHandler(async (req, res) => {
  // 1. Clear JWT cookie
  res.clearCookie("token"); // JWT cookie

  return res.status(200).json({ message: "Logged out successfully" });
});

// ✅ Toggle Add / Remove playlist item
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
  if (user.playList.includes(req.params.id)) {
    user.playList = user.playList.filter((item) => item !== req.params.id);
    await user.save();
    return res.json({ message: "Removed from playlist", isBookmarked: false });
  }

  user.playList.push(req.params.id);
  await user.save();

  res.status(200).json({ message: "Added to playlist", isBookmarked: true });
});

// ✅ Check bookmark status (for reload)
export const checkBookmarkStatus = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - no token " });
  }

  const user = await User.findById(userId).select("playList");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isBookmarked = user.playList.includes(req.params.id);

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
