import { sql } from "../db/index.js";
import { redisClient } from "../middleware/Redis.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";

// ----------------- Add Album -----------------
export const addAlbum = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({ message: "You are not admin" });
    return;
  }

  const { title, description } = req.body;
  const file = req.files?.thumbnail?.[0];

  if (!file) {
    res.status(400).json({ message: "No file to upload" });
    return;
  }

  const cloud = await uploadOnCloudinary(file.path);
  if (!cloud) {
    res.status(500).json({ message: "File upload failed" });
    return;
  }

  const result = await sql`
    INSERT INTO albums (title, description, thumbnail) 
    VALUES (${title}, ${description}, ${cloud.secure_url}) 
    RETURNING *
  `;

  if (redisClient.isReady) {
    await redisClient.del("albums");
    console.log("Cache invalidated for albums");
  }

  res.json({ message: "Album Created", album: result[0] });
});

// ----------------- Add Song -----------------
export const addSong = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({ message: "You are not admin" });
    return;
  }

  const { title, description, albumId } = req.body;
  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${albumId}`;

  if (isAlbum.length === 0) {
    res.status(404).json({ message: "No album with this id" });
    return;
  }

  const file = req.files?.audio?.[0];
  if (!file) {
    res.status(400).json({ message: "No file to upload" });
    return;
  }

  const cloud = await uploadOnCloudinary(file.path);
  if (!cloud) {
    res.status(500).json({ message: "File upload failed" });
    return;
  }

  await sql`
    INSERT INTO songs (title, description, audio, album_id) 
    VALUES (${title}, ${description}, ${cloud.secure_url}, ${albumId})
  `;

  if (redisClient.isReady) {
    await redisClient.del("songs");
    console.log("Cache invalidated for songs");
  }

  res.json({ message: "Song Added" });
});

// ----------------- Get Songs by Album -----------------
export const AlbumBySongs = asyncHandler(async (req, res) => {
  const album_id = req.params.id;

  // Validate input
  if (!album_id || isNaN(album_id)) {
    return res.status(400).json({ message: "Valid album id is required!" });
  }

  // Check cache first
  const cacheKey = `album:${album_id}:songs`;
  if (redisClient.isReady) {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("Cache hit for album songs");
      return res.json({ songs: JSON.parse(cached), cached: true });
    }
  }

  // Verify album exists
  const album = await sql`SELECT * FROM albums WHERE id = ${album_id}`;
  if (album.length === 0) {
    return res.status(404).json({ message: "Album not found" });
  }

  // Fetch songs for this album
  const songs = await sql`
    SELECT id, title, description, audio, thumbnail, album_id 
    FROM songs 
    WHERE album_id = ${album_id}
    ORDER BY id DESC
  `;

  if (songs.length === 0) {
    return res
      .status(200)
      .json({ message: "No songs in this album", songs: [] });
  }

  // Store in cache for next time
  if (redisClient.isReady) {
    await redisClient.set(cacheKey, JSON.stringify(songs), { EX: 60 * 5 }); // cache for 5 min
    console.log("Cache set for album songs");
  }

  res.json({ songs });
});

// ----------------- Add Thumbnail -----------------
export const addThumbnail = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({ message: "You are not admin" });
    return;
  }

  const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;
  if (song.length === 0) {
    res.status(404).json({ message: "No song with this id" });
    return;
  }

  const file = req.files?.thumbnail?.[0];
  if (!file) {
    res.status(400).json({ message: "No file to upload" });
    return;
  }

  const cloud = await uploadOnCloudinary(file.path);
  if (!cloud) {
    res.status(500).json({ message: "File upload failed" });
    return;
  }

  const result = await sql`
    UPDATE songs SET thumbnail = ${cloud.secure_url} 
    WHERE id = ${req.params.id} 
    RETURNING *
  `;

  if (redisClient.isReady) {
    await redisClient.del("songs");
    console.log("Cache invalidated for songs");
  }

  res.json({ message: "Thumbnail added", song: result[0] });
});

// ----------------- Delete Album -----------------
export const deleteAlbum = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({ message: "You are not admin" });
    return;
  }

  const { id } = req.params;
  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${id}`;

  if (isAlbum.length === 0) {
    res.status(404).json({ message: "No album with this id" });
    return;
  }

  await sql`DELETE FROM songs WHERE album_id = ${id}`;
  await sql`DELETE FROM albums WHERE id = ${id}`;

  if (redisClient.isReady) {
    await redisClient.del("albums");
    await redisClient.del("songs");
    console.log("Cache invalidated for albums and songs");
  }

  res.json({ message: "Album deleted successfully" });
});

// ----------------- Delete Song -----------------
export const deleteSong = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({ message: "You are not admin" });
    return;
  }

  const { id } = req.params;
  const song = await sql`SELECT * FROM songs WHERE id = ${id}`;

  if (song.length === 0) {
    res.status(404).json({ message: "No song with this id" });
    return;
  }

  await sql`DELETE FROM songs WHERE id = ${id}`;

  if (redisClient.isReady) {
    await redisClient.del("songs");
    console.log("Cache invalidated for songs");
  }

  res.json({ message: "Song deleted successfully" });
});
