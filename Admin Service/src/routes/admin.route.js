import { Router } from "express";
import {
  addAlbum,
  addArtist,
  addSong,
  addThumbnail,
  AlbumBySongs,
  deleteAlbum,
  deleteSong
} from "../controller/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Create album
router.post(
  "/album/new",
  verifyJWT,
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  addAlbum
);

// Create song (audio + thumbnail)
router.post(
  "/song/new",
  verifyJWT,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  addSong
);

// Update song thumbnail separately (if needed)
router.post(
  "/song/:id",
  verifyJWT,
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  addThumbnail
);

// Get all songs from an album (public)
router.get("/album/songs/:id", AlbumBySongs);

// Delete album
router.delete("/album/:id", verifyJWT, deleteAlbum);

// Delete song
router.delete("/song/:id", verifyJWT, deleteSong);

// Add artist
router.post(
  "/artist",
  verifyJWT,
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  addArtist
);

export default router;
