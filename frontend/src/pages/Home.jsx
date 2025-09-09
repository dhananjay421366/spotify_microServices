import { AlbumCard } from "../components/AlbumCard";
import { ArtistCard } from "../components/ArtistCard";
import { SongCard } from "../components/SongCard";
import { useSong } from "../context/SongContext";

export const Home = () => {
  const { albums, songs, artist } = useSong();
  return (
    <>
      {/* Today's biggest hits */}
      <div className="mb-4 ">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>

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
    md:flex-nowrap 
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

      {/* popular artist */}
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Popular Artist</h1>

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
    md:flex-nowrap 
        "
        >
          {artist?.map((e, i) => (
            <div key={i} className="snap-start">
              <ArtistCard
                image={e.thumbnail}
                name={e.name}
                desc={e.bio}
                id={e.id}
              />
            </div>
          ))}
        </div>
      </div>
      {/* feature charts  */}
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>

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
    md:flex-nowrap 
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
      </div>
    </>
  );
};
