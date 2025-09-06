import { sql } from "../db/index.js";
import { redisClient } from "../middleware/Redis.js";
import { asyncHandler } from "../utility/asyncHandler.js";

// ----------------- Get All Albums -----------------
export const getAllAlbums = asyncHandler(async (req, res) => {
  const CACHE_EXPIRY = 1800; // 30 minutes
  let albums;

  if (redisClient.isReady) {
    albums = await redisClient.get("albums");
  }

  if (albums) {
    console.log("Cache hit: albums");
    return res.status(200).json({
      success: true,
      message: "Albums fetched successfully (from cache)",
      data: JSON.parse(albums),
    });
  }

  console.log("Cache miss: albums");
  albums = await sql`SELECT * FROM albums`;

  if (redisClient.isReady) {
    await redisClient.set("albums", JSON.stringify(albums), { EX: CACHE_EXPIRY });
  }

  res.status(200).json({
    success: true,
    message: "Albums fetched successfully",
    data: albums,
  });
});

// ----------------- Get All Songs -----------------
export const getAllSongs = asyncHandler(async (req, res) => {
  const CACHE_EXPIRY = 1800; // 30 minutes
  let songs;

  if (redisClient.isReady) {
    songs = await redisClient.get("songs");
  }

  if (songs) {
    console.log("Cache hit: songs");
    return res.status(200).json({
      success: true,
      message: "Songs fetched successfully (from cache)",
      data: JSON.parse(songs),
    });
  }

  console.log("Cache miss: songs");
  songs = await sql`SELECT * FROM songs`;

  if (redisClient.isReady) {
    await redisClient.set("songs", JSON.stringify(songs), { EX: CACHE_EXPIRY });
  }

  res.status(200).json({
    success: true,
    message: "Songs fetched successfully",
    data: songs,
  });
});

// ----------------- Get All Songs of Album -----------------
export const getAllSongsOfAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const CACHE_EXPIRY = 1800;

  if (redisClient.isReady) {
    const cached = await redisClient.get(`album_songs_${id}`);
    if (cached) {
      console.log("Cache hit: album_songs");
      return res.status(200).json({
        success: true,
        message: "Album with songs fetched successfully (from cache)",
        data: JSON.parse(cached),
      });
    }
  }

  const album = await sql`SELECT * FROM albums WHERE id = ${id}`;
  if (album.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No album found with this id",
    });
  }

  const songs = await sql`SELECT * FROM songs WHERE album_id = ${id}`;
  const response = { album: album[0], songs };

  if (redisClient.isReady) {
    await redisClient.set(`album_songs_${id}`, JSON.stringify(response), { EX: CACHE_EXPIRY });
  }

  console.log("Cache miss: album_songs");
  res.status(200).json({
    success: true,
    message: "Album with songs fetched successfully",
    data: response,
  });
});

// ----------------- Get Single Song -----------------
export const getSingleSong = asyncHandler(async (req, res) => {
  const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

  if (song.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No song found with this id",
    });
  }

  res.status(200).json({
    success: true,
    message: "Song fetched successfully",
    data: song[0],
  });
});
