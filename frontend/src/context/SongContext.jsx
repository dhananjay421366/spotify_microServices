import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

const server = "https://spotify-song.onrender.com";
const SongContext = createContext();

export const useSong = () => useContext(SongContext);

export const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [index, setIndex] = useState(0);
  const [albums, setAlbums] = useState([]);
  const [song, setSong] = useState(null);
  const [artist, setArtist] = useState(null);

  // 🔑 Track the currently playing audio element globally
  const [currentAudio, setCurrentAudio] = useState(null);

  // ✅ Fetch all songs (runs once, safe in StrictMode)
  useEffect(() => {
    const controller = new AbortController();

    const fetchAllSongs = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${server}/api/v1/song/all`, {
          withCredentials: true,
          signal: controller.signal,
        });
        setSongs(data.data || []);
        setIsPlayingSong(false);
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching songs:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllSongs();
    return () => controller.abort(); // cleanup to prevent duplicate updates
  }, []);

  // ✅ Fetch all albums (once)
  useEffect(() => {
    const controller = new AbortController();

    const fetchAllAlbums = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${server}/api/v1/song/album/all`, {
          withCredentials: true,
          signal: controller.signal,
        });
        setAlbums(data.data || []);
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching albums:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllAlbums();
    return () => controller.abort();
  }, []);

  // ✅ Fetch single song when selection changes
  useEffect(() => {
    if (!selectedSong) return;
    const controller = new AbortController();

    const fetchSingleSong = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${server}/api/v1/song/${selectedSong}`,
          { withCredentials: true, signal: controller.signal }
        );
        setSong(data.data);
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching single song:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSingleSong();
    return () => controller.abort();
  }, [selectedSong]);

  // ✅ Fetch all artists (once)
  useEffect(() => {
    const controller = new AbortController();

    const getAllArtist = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${server}/api/v1/song/artist/all`, {
          signal: controller.signal,
        });
        setArtist(data.data || []);
      } catch (error) {
        if (error.name !== "CanceledError") {
          toast.error("Error fetching all artists");
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    getAllArtist();
    return () => controller.abort();
  }, []);

  // ✅ Next song
  const nextSong = useCallback(() => {
    setIndex((prev) => {
      const newIndex = prev === songs.length - 1 ? 0 : prev + 1;
      setSelectedSong(songs[newIndex]?.id?.toString());
      return newIndex;
    });
  }, [songs]);

  // ✅ Previous song
  const prevSong = useCallback(() => {
    setIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : songs.length - 1;
      setSelectedSong(songs[newIndex]?.id?.toString());
      return newIndex;
    });
  }, [songs]);

  // ✅ Play a song (only one at a time)
  const playSong = (audioEl) => {
    if (currentAudio && currentAudio !== audioEl) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setCurrentAudio(audioEl);
    audioEl.play();
    setIsPlayingSong(true);
  };

  // ✅ Stop song
  const stopSong = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlayingSong(false);
      setCurrentAudio(null);
    }
  };

  return (
    <SongContext.Provider
      value={{
        songs,
        setSongs,
        loading,
        setLoading,
        selectedSong,
        setSelectedSong,
        isPlayingSong,
        setIsPlayingSong,
        albums,
        setAlbums,
        song,
        setSong,
        nextSong,
        prevSong,
        playSong,
        stopSong,
        currentAudio,
        artist,
        setArtist,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};
