import { Router } from "express";
import {
  addToPlaylist,
  checkBookmarkStatus,
  getAllUsers,
  getProfile,
  Login,
  Logout,
  Register,
  verifyEmail,
  forgot_password,
  reset_password,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Auth routes
router.post("/register", Register);
router.post("/login", Login);
router.get("/logout", Logout);

// Protected routes
router.get("/me", verifyJWT, getProfile);
router.get("/all", verifyJWT, getAllUsers);

// Playlist
router.post("/playlist/:id", verifyJWT, addToPlaylist);
router.get("/playlist/:id", verifyJWT, checkBookmarkStatus);

// Email verification
router.get("/verify/:token", verifyEmail);

// Password reset
router.post("/forgot-password", forgot_password);
router.post("/reset-password/:token", reset_password);

export default router;
