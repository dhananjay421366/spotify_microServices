import { useNavigate } from "react-router-dom";

export const ArtistCard = ({ image, name, bio, id }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/artist/" + id)}
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <img
        src={image}
        alt={name}
        className="w-38 h-38 rounded-full  object-cover bg-black"
      />
      <p className="font-bold mt-2 mb-1 ">{name.slice(0, 12)}...</p>
      <p className="text-slate-200 text-sm ">Artist</p>
    </div>
  );
};
