import { Router } from "express";
import {
  addToPlaylist,
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
router.post("/playlist/:id", verifyJWT, addToPlaylist);

export default router;
