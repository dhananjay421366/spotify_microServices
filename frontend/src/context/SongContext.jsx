import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const server = "http://localhost:7000";
const SongContext = createContext();
import toast from "react-hot-toast";

export const useSong = () => useContext(SongContext);

export const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [index, setIndex] = useState(0);
  const [albums, setAlbums] = useState([]);
  const [song, setSong] = useState(null);

  // 🔑 Track the currently playing audio element globally
  const [currentAudio, setCurrentAudio] = useState(null);

  // Fetch all songs
  useEffect(() => {
    const fetchAllSongs = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${server}/api/v1/song/all`, {
          withCredentials: true,
        });

        console.log(data.data, "all songs");
        setSongs(data.data || []);

        // if (data.data?.length > 0) {
        //   setSelectedSong(data.data[0]?.id.toString());
        // }
        setIsPlayingSong(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSongs();
  }, []);

  // Fetch all albums (once)
  useEffect(() => {
    const fetchAllAlbums = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${server}/api/v1/song/album/all`, {
          withCredentials: true,
        });
        setAlbums(data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAlbums();
  }, []);

  // Next song
  const nextSong = useCallback(() => {
    setIndex((prev) => {
      const newIndex = prev === songs.length - 1 ? 0 : prev + 1;
      setSelectedSong(songs[newIndex]?.id?.toString());
      return newIndex;
    });
  }, [songs]);

  // Prev song
  const prevSong = useCallback(() => {
    setIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : songs.length - 1;
      setSelectedSong(songs[newIndex]?.id?.toString());
      return newIndex;
    });
  }, [songs]);

  // Fetch single song when selection changes
  useEffect(() => {
    const fetchSingleSong = async () => {
      if (!selectedSong) return;
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${server}/api/v1/song/${selectedSong}`,
          { withCredentials: true }
        );
        setSong(data.data);
      } catch (error) {
        console.error("Error fetching single song:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleSong();
  }, [selectedSong]);

  // 🔑 Play a song (only one at a time)
  const playSong = (audioEl) => {
    if (currentAudio && currentAudio !== audioEl) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setCurrentAudio(audioEl);
    audioEl.play();
    setIsPlayingSong(true);
  };

  // 🔑 Stop song
  const stopSong = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlayingSong(false);
      setCurrentAudio(null);
    }
  };

  const [artist, setArtist] = useState(null);
  useEffect(() => {
    const getAllArtist = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${server}/api/v1/song/artist/all`);
        console.log(data.data, "fetching all artist");
        setArtist(data.data || []);
      } catch (error) {
        toast.error("Error to fetching all artist", error);
      }
    };
    getAllArtist();
  }, []);

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
