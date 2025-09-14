import { sql } from "../db/index.js";
import { redisClient } from "../middleware/Redis.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";

// ----------------- Add Album -----------------
export const addAlbum = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({ message: "You are not admin" });
  }

  const { title, description, artistId } = req.body;
  const file = req.files?.thumbnail?.[0];

  if (!title || !description || !artistId) {
    return res
      .status(400)
      .json({ message: "Title, description, and artistId are required" });
  }
  const audioFile = req.files?.audio?.[0];
  const thumbFile = req.files?.thumbnail?.[0];

  if (audioFile && thumbFile) {
    return res
      .status(400)
      .json({ message: "Audio file and Thumbnail file are required" });
  }
  const audioCloud = await uploadOnCloudinary(audioFile.path);
  let thumbnailUrl = null;

  const thumbCloud = await uploadOnCloudinary(thumbFile.path);
  thumbnailUrl = thumbCloud?.secure_url || null;

  // insert with thumbnailUrl
  await sql`
  INSERT INTO songs (title, description, audio, thumbnail, album_id, artist_id)
  VALUES (${title}, ${description}, ${audioCloud.secure_url}, ${thumbCloud.secure_url}, ${albumId}, ${artistId})
`;

  const result = await sql`
    INSERT INTO albums (title, description, thumbnail, artist_id) 
    VALUES (${title}, ${description}, ${cloud.secure_url}, ${artistId}) 
    RETURNING *
  `;

  if (redisClient.isReady) {
    await redisClient.del("albums");
  }

  res.json({ message: "Album Created", album: result[0] });
});

// ----------------- Add Song -----------------
export const addSong = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({ message: "You are not admin" });
  }

  const { title, description, albumId, artistId } = req.body;
  const audioFile = req.files?.audio?.[0];
  const thumbFile = req.files?.thumbnail?.[0];

  // Validate fields
  if (!title || !description || !albumId || !artistId) {
    return res.status(400).json({ message: "Title, description, albumId and artistId are required" });
  }

  if (!audioFile || !thumbFile) {
    return res.status(400).json({ message: "Audio file and Thumbnail file are required" });
  }

  // Upload files to Cloudinary
  const audioCloud = await uploadOnCloudinary(audioFile.path);
  const thumbCloud = await uploadOnCloudinary(thumbFile.path);

  if (!audioCloud || !thumbCloud) {
    return res.status(500).json({ message: "File upload failed" });
  }

  // Insert song into DB
  const result = await sql`
    INSERT INTO songs (title, description, audio, thumbnail, album_id, artist_id)
    VALUES (${title}, ${description}, ${audioCloud.secure_url}, ${thumbCloud.secure_url}, ${albumId}, ${artistId})
    RETURNING *
  `;

  // (Optional) clear Redis cache for songs if you are caching
  if (redisClient.isReady) {
    await redisClient.del(`songs:album:${albumId}`);
  }

  res.json({ message: "Song Created", song: result[0] });
});

// ----------------- Get Songs by Album -----------------
export const AlbumBySongs = asyncHandler(async (req, res) => {
  const album_id = req.params.id;

  if (!album_id || isNaN(album_id)) {
    return res.status(400).json({ message: "Valid album id is required!" });
  }

  const cacheKey = `album:${album_id}:songs`;
  if (redisClient.isReady) {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ songs: JSON.parse(cached), cached: true });
    }
  }

  const album = await sql`SELECT * FROM albums WHERE id = ${album_id}`;
  if (album.length === 0) {
    return res.status(404).json({ message: "Album not found" });
  }

  const songs = await sql`
    SELECT id, title, description, audio, thumbnail, album_id, artist_id 
    FROM songs 
    WHERE album_id = ${album_id}
    ORDER BY id DESC
  `;

  if (songs.length === 0) {
    return res
      .status(200)
      .json({ message: "No songs in this album", songs: [] });
  }

  if (redisClient.isReady) {
    await redisClient.set(cacheKey, JSON.stringify(songs), { EX: 60 * 5 });
  }

  res.json({ songs });
});

// ----------------- Add Thumbnail to Song -----------------
export const addThumbnail = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({ message: "You are not admin" });
  }

  const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;
  if (song.length === 0) {
    return res.status(404).json({ message: "No song with this id" });
  }

  const file = req.files?.thumbnail?.[0];
  if (!file) {
    return res.status(400).json({ message: "No file to upload" });
  }

  const cloud = await uploadOnCloudinary(file.path);
  if (!cloud) {
    return res.status(500).json({ message: "File upload failed" });
  }

  const result = await sql`
    UPDATE songs SET thumbnail = ${cloud.secure_url} 
    WHERE id = ${req.params.id} 
    RETURNING *
  `;

  if (redisClient.isReady) {
    await redisClient.del("songs");
  }

  res.json({ message: "Thumbnail added", song: result[0] });
});

// ----------------- Delete Album -----------------
export const deleteAlbum = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({ message: "You are not admin" });
  }

  const { id } = req.params;
  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${id}`;

  if (isAlbum.length === 0) {
    return res.status(404).json({ message: "No album with this id" });
  }

  await sql`DELETE FROM songs WHERE album_id = ${id}`;
  await sql`DELETE FROM albums WHERE id = ${id}`;

  if (redisClient.isReady) {
    await redisClient.del("albums");
    await redisClient.del("songs");
  }

  res.json({ message: "Album deleted successfully" });
});

// ----------------- Delete Song -----------------
export const deleteSong = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({ message: "You are not admin" });
  }

  const { id } = req.params;
  const song = await sql`SELECT * FROM songs WHERE id = ${id}`;

  if (song.length === 0) {
    return res.status(404).json({ message: "No song with this id" });
  }

  await sql`DELETE FROM songs WHERE id = ${id}`;

  if (redisClient.isReady) {
    await redisClient.del("songs");
  }

  res.json({ message: "Song deleted successfully" });
});

// ----------------- Add Artist -----------------
export const addArtist = asyncHandler(async (req, res) => {
  const { name, bio } = req.body;
  const file = req.files?.thumbnail?.[0];

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Artist name is required" });
  }

  let thumbnail = null;
  if (file) {
    const cloud = await uploadOnCloudinary(file.path);
    if (!cloud) {
      return res
        .status(500)
        .json({ success: false, message: "Thumbnail upload failed" });
    }
    thumbnail = cloud.secure_url;
  }

  const newArtist = await sql`
    INSERT INTO artists (name, bio, thumbnail)
    VALUES (${name}, ${bio || null}, ${thumbnail})
    RETURNING *
  `;

  if (redisClient.isReady) {
    await redisClient.del("artists");
  }

  res.status(201).json({
    success: true,
    message: "Artist created successfully",
    data: newArtist[0],
  });
});
