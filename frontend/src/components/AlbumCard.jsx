import { useNavigate } from "react-router-dom";

export const AlbumCard = ({ image, name, desc, id }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/album/" + id)}
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <img
        src={image}
        alt={name}
        className="rounded w-[160px] h-48 object-cover bg-black"
      />
      <p className="font-bold mt-2 mb-1 ">{name.slice(0, 12)}...</p>
      <p className="text-slate-200 text-sm ">{desc.slice(0, 18)}...</p>
    </div>
  );
};
