import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const server = "https://spotify-song.onrender.com";
// const server = "http://localhost:7000";

export const AlbumPage = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [playsCount, setPlaysCount] = useState({}); // song play counts

  // Load play counts from localStorage
  useEffect(() => {
    const storedCounts = JSON.parse(localStorage.getItem("songPlays")) || {};
    setPlaysCount(storedCounts);
  }, []);

  // Fetch album & songs
  useEffect(() => {
    const fetchAlbumSongs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${server}/api/v1/song/album/${id}`);
        setAlbum(data.data.album);
        setSongs(data.data.songs);

        // Initialize counts for new songs if not in localStorage
        const storedCounts =
          JSON.parse(localStorage.getItem("songPlays")) || {};
        const newCounts = { ...storedCounts };
        data.data.songs.forEach((song) => {
          if (!newCounts[song.id]) newCounts[song.id] = song.plays || 0;
        });
        setPlaysCount(newCounts);
        localStorage.setItem("songPlays", JSON.stringify(newCounts));
      } catch (error) {
        toast.error("Error fetching album songs");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumSongs();
  }, [id]);

  const updatePlaysCount = (songId) => {
    setPlaysCount((prev) => {
      const updated = { ...prev, [songId]: (prev[songId] || 0) + 1 };
      localStorage.setItem("songPlays", JSON.stringify(updated)); // store in localStorage
      return updated;
    });
  };

  const playSong = () => {
    if (!songs[currentIndex]) return;
    audioRef.current.play();
    setIsPlaying(true);
    updatePlaysCount(songs[currentIndex].id);
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const prevSong = () => {
    setCurrentIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const nextSong = () => {
    setCurrentIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const addToLibrary = () => {
    toast.success("Added to Library!");
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="flex flex-col mt-4">
      {/* Album header */}
      <div className="flex items-end gap-6 bg-gradient-to-b from-purple-700 to-black p-6">
        <img
          src={album?.thumbnail || "/default_album.png"}
          alt={album?.title}
          className="w-48 h-48 rounded shadow-lg object-cover"
        />
        <div>
          <p className="uppercase text-sm text-gray-200 font-bold">Album</p>
          <h1 className="text-5xl font-extrabold text-white">{album?.title}</h1>
          <p className="text-gray-300 mt-2">{album?.description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 px-6 py-4 bg-black">
        <button
          onClick={prevSong}
          className="px-4 py-2 border border-gray-400 rounded text-gray-300 hover:text-white hover:border-white"
        >
          ⏮
        </button>
        {isPlaying ? (
          <button
            onClick={pauseSong}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 hover:scale-105 transition"
          >
            ❚❚
          </button>
        ) : (
          <button
            onClick={playSong}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 hover:scale-105 transition"
          >
            ▶
          </button>
        )}
        <button
          onClick={nextSong}
          className="px-4 py-2 border border-gray-400 rounded text-gray-300 hover:text-white hover:border-white"
        >
          ⏭
        </button>
        <button
          onClick={addToLibrary}
          className="px-4 py-2 border border-gray-400 rounded text-gray-300 hover:text-white hover:border-white"
        >
          + Add to Library
        </button>
      </div>

      {/* Current Song */}
      {songs[currentIndex] && (
        <audio
          ref={audioRef}
          src={songs[currentIndex].audio}
          onEnded={nextSong}
        />
      )}

      {/* Song List */}
      <div className="px-6 py-4">
        <table className="w-full text-left text-gray-300">
          <thead className="border-b border-gray-600 text-gray-400 text-sm uppercase">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Title</th>
              <th className="p-2">Plays</th>
              <th className="p-2">Album</th>
              <th className="p-2">⏱</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => (
              <tr
                key={song.id}
                className={`hover:bg-white/10 cursor-pointer transition ${
                  index === currentIndex ? "bg-white/20" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2 flex items-center gap-3">
                  <img
                    src={song.thumbnail || "/default_song.png"}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-white">{song.title}</p>
                    <p className="text-sm text-gray-400">{song.artist_name}</p>
                  </div>
                </td>
                <td className="p-2">{playsCount[song.id]}</td>
                <td className="p-2">{album?.title}</td>
                <td className="p-2">{song.duration || "3:00"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
