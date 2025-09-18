import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Heart, Pause, UserPlus, UserMinus } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function ArtistSongs() {
  const { id: artistId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // const server = `https://spotify-song.onrender.com`
  const server = `http://localhost:7000`

  // Likes
  const [likes, setLikes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("likes")) || {};
    } catch {
      return {};
    }
  });

  // Play counts
  const [playCounts, setPlayCounts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("playCounts")) || {};
    } catch {
      return {};
    }
  });

  // Followed artists
  const [followedArtists, setFollowedArtists] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("followedArtists")) || {};
    } catch {
      return {};
    }
  });

  // Persist localStorage
  useEffect(() => {
    localStorage.setItem("likes", JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    localStorage.setItem("playCounts", JSON.stringify(playCounts));
  }, [playCounts]);

  useEffect(() => {
    localStorage.setItem("followedArtists", JSON.stringify(followedArtists));
  }, [followedArtists]);

  // Fetch artist data
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await axios.get(
          `${server}/api/v1/song/artist/${artistId}`
        );
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching artist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

  // Handle play / pause
  const togglePlay = (song) => {
    if (currentSong && currentSong.id === song.id) {
      // Pause if same song
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentSong(null);
    } else {
      // Play new song
      setCurrentSong(song);
      if (audioRef.current) {
        audioRef.current.src = song.audio || song.file_url || "";
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error("Audio play error:", err));
      }
      setPlayCounts((prev) => {
        const newCounts = { ...prev, [song.id]: (prev[song.id] || 0) + 1 };
        return newCounts;
      });
    }
  };

  // Handle like toggle
  const toggleLike = (songId) => {
    setLikes((prev) => {
      const updated = { ...prev, [songId]: !prev[songId] };
      return updated;
    });
  };

  // Handle follow/unfollow
  const toggleFollow = (artistId) => {
    setFollowedArtists((prev) => {
      const updated = { ...prev, [artistId]: !prev[artistId] };
      return updated;
    });
  };

  if (loading) {
    return <p className="text-white p-6">Loading artist info...</p>;
  }

  if (!data) {
    return <p className="text-red-400 p-6">Failed to load artist.</p>;
  }

  const { artist, albums, songs } = data;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white p-4 md:p-8">
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onEnded={() => {
            setCurrentSong(null);
            setIsPlaying(false);
          }}
        />

        {/* Hero Section */}
        <div className="relative flex flex-col md:flex-row md:items-end gap-6 md:gap-10 mb-10">
          <motion.img
            src={artist.thumbnail || "https://via.placeholder.com/300"}
            alt={artist.name}
            className="w-40 h-40 md:w-56 md:h-56 rounded-2xl object-cover shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <div>
            <h1 className="text-4xl md:text-6xl font-bold">{artist.name}</h1>
            <p className="text-neutral-400 mt-2">
              {artist.monthly_listeners || 0} monthly listeners
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  if (songs.length > 0) togglePlay(songs[0]);
                }}
                className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-full flex items-center gap-2 transition"
              >
                {currentSong && currentSong.id === songs[0]?.id && isPlaying ? (
                  <>
                    <Pause size={18} /> Pause
                  </>
                ) : (
                  <>
                    <Play size={18} /> Play
                  </>
                )}
              </button>
              <button
                onClick={() => toggleFollow(artist.id)}
                className="px-6 py-2 rounded-full border border-neutral-700 hover:bg-neutral-800 transition flex items-center gap-2"
              >
                {followedArtists[artist.id] ? (
                  <>
                    <UserMinus size={16} /> Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> Follow
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Songs */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Popular</h2>
            <div className="space-y-2">
              {songs.length > 0 ? (
                songs.map((song, i) => (
                  <motion.div
                    key={song.id}
                    className={`flex items-center justify-between p-3 rounded-xl transition cursor-pointer ${
                      currentSong && currentSong.id === song.id
                        ? "bg-neutral-800"
                        : "hover:bg-neutral-800"
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-neutral-400 w-6">{i + 1}</span>
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-xs text-neutral-500">
                          {song.streams || 0} streams • Played{" "}
                          {playCounts[song.id] || 0} times
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => togglePlay(song)}
                        className="p-2 rounded-full hover:bg-neutral-700 transition"
                      >
                        {currentSong &&
                        currentSong.id === song.id &&
                        isPlaying ? (
                          <Pause size={18} />
                        ) : (
                          <Play size={18} />
                        )}
                      </button>
                      <button onClick={() => toggleLike(song.id)}>
                        <Heart
                          className={`transition ${
                            likes[song.id]
                              ? "text-pink-500"
                              : "text-neutral-500"
                          }`}
                          size={18}
                        />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex justify-center  font-bold items-center">
                  <h1>No Song Found</h1>
                </div>
              )}
            </div>
          </div>

          {/* Artist Pick (First Album) */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Artist pick</h2>
            {albums.length > 0 && (
              <div className="bg-neutral-800 rounded-xl shadow-lg p-4 flex flex-col gap-3">
                <img
                  src={albums[0].thumbnail || "https://via.placeholder.com/300"}
                  alt={albums[0].title}
                  className="rounded-xl shadow-lg"
                />
                <p className="text-lg font-medium">{albums[0].title}</p>
                <div className="flex gap-2">
                  <span>❤️❤️❤️</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Player Bar */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{currentSong.title}</p>
              <p className="text-xs text-neutral-500">
                Played {playCounts[currentSong.id] || 0} times
              </p>
            </div>
            <button
              onClick={() => togglePlay(currentSong)}
              className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-full flex items-center gap-2 transition"
            >
              {isPlaying ? (
                <>
                  <Pause size={18} /> Pause
                </>
              ) : (
                <>
                  <Play size={18} /> Play
                </>
              )}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
