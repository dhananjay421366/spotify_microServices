import { AlbumCard } from "../components/AlbumCard";
import { SongCard } from "../components/SongCard";
import { useSong } from "../context/SongContext";

export const Home = () => {
  const { albums, songs } = useSong();
  return (
    <>
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

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>

        <div
          className="
          flex gap-4
          overflow-x-auto
          scroll-smooth
          scrollbar-hidden
          snap-x snap-mandatory
          pb-2
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
    </>
  );
};
