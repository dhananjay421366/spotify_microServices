import { useNavigate } from "react-router-dom";
import { GrInstallOption } from "react-icons/gr";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const { HandleLogout } = useAuth();

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold">
        {/* Navigation arrows */}
        <div className="flex items-center gap-2">
          <img
            src="/left_arrow.png"
            alt="Back"
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <img
            src="/right_arrow.png"
            alt="Forward"
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            onClick={() => window.history.forward()}
          />
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-4">
          <p className="px-4 py-1 bg-white text-black text-[15px] rounded-full cursor-pointer hidden md:block">
            Explore Premium
          </p>

          <a
            href="https://www.spotify.com/de-en/download/windows/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="px-4 py-1 md:flex items-center gap-2 bg-white text-black text-[15px] rounded-full cursor-pointer hidden">
              <GrInstallOption />
              Install App
            </p>
          </a>

          <p
            className="px-4 py-1 bg-white text-black text-[15px] rounded-full cursor-pointer"
            onClick={HandleLogout}
          >
            Logout
          </p>
        </div>
      </div>

      {/* Category buttons */}
      <div className="flex items-center gap-2 mt-4">
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">
          All
        </p>
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hidden md:block">
          Music
        </p>
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hidden md:block">
          Podcasts
        </p>
        <p
          className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer md:hidden"
          onClick={() => navigate("/playlist")}
        >
          PlayList
        </p>
      </div>
    </>
  );
};
