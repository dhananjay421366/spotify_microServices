import { Router } from "express";
import {
  getAllAlbums,
  getAllArtists,
  getAllSongs,
  getAllSongsOfAlbum,
  getArtistWiseSongs,
  getSingleSong,
} from "../controller/song.controller.js";

const router = Router();
router.get("/album/all", getAllAlbums);
router.get("/artist/all", getAllArtists);
router.get("/artist/:id", getArtistWiseSongs);
router.get("/all", getAllSongs);
router.get("/album/:id", getAllSongsOfAlbum);
router.get("/:id", getSingleSong);

export default router;
