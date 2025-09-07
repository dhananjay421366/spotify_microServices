import { useEffect, useRef, useState } from "react";
import { useSong } from "../context/SongContext";

export const MusicPlayer = () => {
  const { song } = useSong();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto play whenever a new song is set
  useEffect(() => {
    if (song?.audio && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Autoplay blocked:", err);
        });
    }
  }, [song]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div>
      {song && (
        <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
          {/* Song Info */}
          <div className="lg:flex items-center gap-4">
            <img
              src={song?.thumbnail || "/download.jpeg"}
              alt={song.title}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="hidden md:block">
              <p className="font-bold">{song.title}</p>
              <p className="text-sm text-gray-400">
                {song.description?.slice(0, 30)}
              </p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-1 m-auto">
            {song.audio && (
              <>
                <audio ref={audioRef} src={song.audio}></audio>
                <button
                  onClick={togglePlay}
                  className="bg-green-500 text-black px-4 py-2 rounded-full"
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
