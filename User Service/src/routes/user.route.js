import { Router } from "express";
import {
  addToPlaylist,
  checkBookmarkStatus,
  getAllUsers,
  getProfile,
  Login,
  Logout,
  Register,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/me", verifyJWT, getProfile);
router.get("/logout", Logout);
// Toggle add/remove
router.post("/playlist/:id", verifyJWT, addToPlaylist);

// Check bookmark status
router.get("/playlist/:id", verifyJWT, checkBookmarkStatus);
router.get("/all", verifyJWT, getAllUsers);

export default router;
