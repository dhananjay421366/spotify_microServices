import { Router } from "express";
import {
  getAllAlbums,
  getAllSongs,
  getAllSongsOfAlbum,
  getSingleSong,
} from "../controller/song.controller.js";

const router = Router();
router.get("/album/all", getAllAlbums);
router.get("/song/all", getAllSongs);
router.get("/album/:id", getAllSongsOfAlbum);
router.get("/song/:id", getSingleSong);

export default router;
