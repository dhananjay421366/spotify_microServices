// import { FaPlay, FaPause } from "react-icons/fa";
// import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
// import { useRef, useState, useEffect } from "react";
// import { useSong } from "../context/SongContext";
// import axios from "axios";

// export const SongCard = ({ id, audio, title, description, thumbnail }) => {
//   const audioRef = useRef(null);
//   const { playSong } = useSong();

//   const [bookmarked, setBookmarked] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [duration, setDuration] = useState("0:00");

//   // Load duration when audio metadata is ready
//   useEffect(() => {
//     if (!audioRef.current) return;

//     const handleLoadedMetadata = () => {
//       const seconds = Math.floor(audioRef.current.duration);
//       const minutes = Math.floor(seconds / 60);
//       const remainingSeconds = seconds % 60;
//       setDuration(
//         `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
//       );
//     };

//     audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

//     return () => {
//       if (audioRef.current) {
//         audioRef.current.removeEventListener(
//           "loadedmetadata",
//           handleLoadedMetadata
//         );
//       }
//     };
//   }, []);

//   const handlePlayPause = () => {
//     if (!audioRef.current) return;

//     if (isPlaying) {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     } else {
//       playSong(audioRef.current); // uses your global context
//       audioRef.current.play();
//       setIsPlaying(true);
//     }
//   };

//   const handleBookmark = async () => {
//     try {
//       const res = await axios.post(
//         `http://localhost:8000/api/v1/users/playlist/${id}`,
//         {},
//         { withCredentials: true }
//       );

//       if (res.status === 200) {
//         setBookmarked(true);
//         console.log("✅ Added to playlist:", res.data);
//       }
//     } catch (err) {
//       console.error(
//         "❌ Error adding to playlist:",
//         err.response?.data || err.message
//       );
//     }
//   };

//   return (
//     <div className="group min-w-[200px] p-3 rounded hover:bg-[#ffffff26] transition">
//       <div className="relative">
//         <img
//           src={thumbnail || "/default-song.png"}
//           alt={title}
//           className="w-[180px] h-48 object-cover rounded"
//         />

//         {/* Play / Pause Button */}
//         <button
//           onClick={handlePlayPause}
//           className="absolute bottom-2 right-2 bg-green-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
//         >
//           {isPlaying ? <FaPause /> : <FaPlay />}
//         </button>

//         {/* Bookmark Button */}
//         <button
//           onClick={handleBookmark}
//           className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white"
//         >
//           {bookmarked ? <BsBookmarkFill /> : <BsBookmark />}
//         </button>
//       </div>

//       <div className="mt-2">
//         <p className="font-bold text-white">{title}</p>
//         {/* Show more description (30 chars instead of 20) */}
//         <p className="text-slate-300 text-sm">{description?.slice(0, 30)}...</p>
//         {/* Song Duration */}
//         <p className="text-slate-400 text-xs mt-1">Duration: {duration}</p>
//       </div>

//       <audio ref={audioRef} src={audio}></audio>
//     </div>
//   );
// };
import { FaPlay, FaPause } from "react-icons/fa";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useRef, useState, useEffect } from "react";
import { useSong } from "../context/SongContext";
import axios from "axios";

export const SongCard = ({ id, audio, title, description, thumbnail }) => {
  const audioRef = useRef(null);
  const { playSong } = useSong();

  const [bookmarked, setBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");

  // ✅ Fetch bookmark status when page reloads
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/users/playlist/${id}`,
          { withCredentials: true }
        );
        if (res.status === 200) {
          setBookmarked(res.data.isBookmarked);
        }
      } catch (err) {
        console.error("❌ Error fetching bookmark status:", err.message);
      }
    };

    checkBookmarkStatus();
  }, [id]);

  // Load audio duration
  useEffect(() => {
    if (!audioRef.current) return;

    const handleLoadedMetadata = () => {
      const seconds = Math.floor(audioRef.current.duration);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      setDuration(
        `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
      );
    };

    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playSong(audioRef.current); // global context
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // ✅ Toggle add/remove from playlist
  const handleBookmark = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/users/playlist/${id}`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        setBookmarked(res.data.isBookmarked); // update toggle state
        console.log("Playlist updated:", res.data.message);
      }
    } catch (err) {
      console.error(
        "❌ Error updating playlist:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="group min-w-[200px] p-3 rounded hover:bg-[#ffffff26] transition">
      <div className="relative">
        <img
          src={thumbnail || "/default-song.png"}
          alt={title}
          className="w-[180px] h-48 object-cover rounded"
        />

        {/* Play / Pause Button */}
        <button
          onClick={handlePlayPause}
          className="absolute bottom-2 right-2 bg-green-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white"
        >
          {bookmarked ? <BsBookmarkFill /> : <BsBookmark />}
        </button>
      </div>

      <div className="mt-2">
        <p className="font-bold text-white">{title}</p>
        <p className="text-slate-300 text-sm">{description?.slice(0, 30)}...</p>
        <p className="text-slate-400 text-xs mt-1">Duration: {duration}</p>
      </div>

      <audio ref={audioRef} src={audio}></audio>
    </div>
  );
};
