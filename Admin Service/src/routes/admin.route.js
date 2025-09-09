import { Router } from "express";
import {
  addAlbum,
  addArtist,
  addSong,
  addThumbnail,
  AlbumBySongs,
  deleteAlbum,
  deleteSong,
} from "../controller/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
router.post(
  "/album/new",
  verifyJWT,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  addAlbum
);
router.post(
  "/song/new",
  verifyJWT,
  upload.fields([{ name: "audio", maxCount: 1 }]),
  addSong
);
router.post(
  "/song/:id",
  verifyJWT,
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  addThumbnail
);
router.get("/album/songs/:id", AlbumBySongs);
router.delete("/album/:id", verifyJWT, deleteAlbum);
router.delete("/song/:id", verifyJWT, deleteSong);
router.post("/artist" , addArtist);

export default router;
