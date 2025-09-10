import { AlbumCard } from "../components/AlbumCard";
import { ArtistCard } from "../components/ArtistCard";
import { SongCard } from "../components/SongCard";
import { useSong } from "../context/SongContext";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export const AllAlbum = () => {
  const { albums, songs, artist } = useSong();
  console.log(artist);
  return (
    <>
      <Navbar />
      <div className="p-8">
        {/* Today's biggest hits */}
        <div className="mb-4 ">
          <h1 className="my-4 p-4 font-bold text-2xl text-white">
            Today's biggest hits
          </h1>

          <div
            className="
           flex gap-4
    overflow-x-auto
    scroll-smooth
    scrollbar-hidden
    snap-x snap-mandatory
    pb-2
    items-center
    ml-10
    flex-wrap      
        "
          >
            {songs?.map((e, i) => (
              <div key={i} className="snap-start">
                <SongCard
                  id={e.id}
                  title={e.title}
                  description={e.description}
                  thumbnail={e.thumbnail}
                  audio={e.audio}
                />
              </div>
            ))}
          </div>
        </div>
        {/* feature charts  */}
        <div className="mb-4">
          <h1 className="my-5 font-bold text-white p-4 text-2xl">
            Featured Charts
          </h1>

          <div
            className="
           flex gap-4
    overflow-x-auto
    scroll-smooth
    scrollbar-hidden
    snap-x snap-mandatory
    pb-2
    items-center
    ml-10
    flex-wrap      
        "
          >
            {albums?.map((e, i) => (
              <div key={i} className="snap-start">
                <AlbumCard
                  image={e.thumbnail}
                  name={e.title}
                  desc={e.description}
                  id={e.id}
                />
              </div>
            ))}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};
