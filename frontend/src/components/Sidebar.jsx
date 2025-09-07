import { useNavigate } from "react-router-dom";
import { PlayListCard } from "./PlayListCard";

export const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around ">
        <div
          className="flex ic gap-3 pl-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/home.png" alt="" className="w-6  hover:scale-110 " />
          <p className="font-bold  hover:scale-110">Home </p>
        </div>
        <div className="flex ic gap-3 pl-8 cursor-pointer">
          <img src="/search.png" alt="" className="w-6  hover:scale-110" />
          <p className="font-bold  hover:scale-110">Search </p>
        </div>
      </div>
      <div className="bg[#121212] h-[85%] rounded">
        <div className="p-4 flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <img src="/stack.png" alt="" className="w-8 hover:scale-110" />
            <p className="font-semibold  hover:scale-110"> Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <img src="/arrow.png" alt="" className="w-6 hover:scale-110" />
            <img src="/plus.png" alt="" className="w-6 hover:scale-110" />
          </div>
        </div>
        <div onClick={() => navigate("/playlist")}>
          <PlayListCard />
        </div>
        <div className="p-4 m-2 bg-[#121212] rounded font-semibold flex flex-col items-start gap-1 pl-4 mt-4">
          <h1>Let's find some podcasts to follow</h1>
          <p className="font-light "> we'll keep you update on new episodes</p>
          <button className="px-4 py-1.5 bg-white text-black text[15px] rounded-full mt-4">
            Browse Podcasts
          </button>
        </div>
      </div>
    </div>
  );
};
