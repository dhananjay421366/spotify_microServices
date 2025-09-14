// // src/Admin/Dashboard.jsx
// import { useState, useEffect } from "react";
// import Confetti from "react-confetti";
// import {
//   FaEdit,
//   FaTrash,
//   FaUsers,
//   FaMusic,
//   FaCompactDisc,
//   FaMicrophone,
//   FaPlus,
// } from "react-icons/fa";
// import toast, { Toaster } from "react-hot-toast";
// import { useAuth } from "../context/AuthContext";
// import { useSong } from "../context/SongContext";

// export const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState("users");
//   const [showConfetti, setShowConfetti] = useState(false);

//   const { users, HandleLogout } = useAuth();
//   const { albums, songs, artist: artists } = useSong();

//   const handleEdit = (item) => {
//     toast.success("Edit action triggered!");
//     setShowConfetti(true);
//     setTimeout(() => setShowConfetti(false), 3000);
//   };

//   const handleDelete = (item) => {
//     toast.success("Delete action triggered!");
//     setShowConfetti(true);
//     setTimeout(() => setShowConfetti(false), 3000);
//   };

//   const getCurrentData = () => {
//     switch (activeTab) {
//       case "users":
//         return users || [];
//       case "albums":
//         return albums || [];
//       case "songs":
//         return songs || [];
//       case "artists":
//         return artists || [];
//       default:
//         return [];
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       <Toaster position="top-right" />
//       {showConfetti && <Confetti />}

//       {/* Sidebar */}
//       <div className="w-64 bg-gray-800 p-6 flex flex-col space-y-6">
//         <h1 className="text-2xl font-bold text-green-500">Dashboard</h1>

//         {[
//           { label: "Users", icon: <FaUsers />, key: "users" },
//           { label: "Albums", icon: <FaCompactDisc />, key: "albums" },
//           { label: "Songs", icon: <FaMusic />, key: "songs" },
//           { label: "Artists", icon: <FaMicrophone />, key: "artists" },
//         ].map((tab) => (
//           <button
//             key={tab.key}
//             className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${
//               activeTab === tab.key ? "bg-gray-700" : ""
//             }`}
//             onClick={() => setActiveTab(tab.key)}
//           >
//             {tab.icon} {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-auto">
//         {/* Navbar */}
//         <div className="bg-gray-800 p-4 flex justify-between items-center">
//           <h2 className="text-xl font-bold">
//             {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
//           </h2>
//           <button
//             className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
//             onClick={() => HandleLogout()}
//           >
//             <FaTrash /> Logout
//           </button>
//         </div>

//         {/* Table */}
//         <div className="p-6 space-y-4">
//           <div className="flex justify-end">
//             <button
//               className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2"
//               onClick={() => handleEdit("New " + activeTab)}
//             >
//               <FaPlus /> Add {activeTab.slice(0, -1)}
//             </button>
//           </div>

//           <table className="min-w-full text-left text-white border-collapse">
//             <thead>
//               <tr className="border-b border-gray-600">
//                 {getCurrentData()[0] &&
//                   Object.keys(getCurrentData()[0]).map((key) => (
//                     <th key={key} className="px-4 py-2 capitalize">
//                       {key}
//                     </th>
//                   ))}
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getCurrentData().map((item, idx) => (
//                 <tr
//                   key={idx}
//                   className="border-b border-gray-700 hover:bg-gray-700 transition"
//                 >
//                   {Object.values(item).map((value, idy) => (
//                     <td key={idy} className="px-4 py-2">
//                       {value}
//                     </td>
//                   ))}
//                   <td className="px-4 py-2 flex gap-2">
//                     <button
//                       onClick={() => handleEdit(item)}
//                       className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600 transition"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(item)}
//                       className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {getCurrentData().length === 0 && (
//             <p className="text-gray-400 text-center mt-4">No data available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import { useState } from "react";
import Confetti from "react-confetti";
import {
  FaEdit,
  FaTrash,
  FaUsers,
  FaMusic,
  FaCompactDisc,
  FaMicrophone,
  FaPlus,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useSong } from "../context/SongContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Modal } from "../components/Model";
import { FileInput } from "../components/FileInput";


const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/admin", // update when deploying
  withCredentials: true,
});

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showConfetti, setShowConfetti] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({}); // store multiple files

  const { users, HandleLogout } = useAuth();
  const { albums, songs, artist: artists } = useSong();

  const getCurrentData = () => {
    switch (activeTab) {
      case "users":
        return users || [];
      case "albums":
        return albums || [];
      case "songs":
        return songs || [];
      case "artists":
        return artists || [];
      default:
        return [];
    }
  };

  // ---------------- Add Logic ----------------
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
      Object.entries(files).forEach(([field, file]) => fd.append(field, file));

      if (activeTab === "albums") {
        await api.post("/album/new", fd);
        toast.success("Album created!");
      } else if (activeTab === "songs") {
        await api.post("/song/new", fd);
        toast.success("Song created!");
      } else if (activeTab === "artists") {
        await api.post("/artist", fd);
        toast.success("Artist created!");
      }

      setOpenModal(false);
      setFormData({});
      setFiles({});
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    }
  };

  // ---------------- Delete Logic ----------------
  const handleDelete = async (item) => {
    try {
      if (activeTab === "albums") {
        await api.delete(`/album/${item.id}`);
        toast.success("Album deleted!");
      } else if (activeTab === "songs") {
        await api.delete(`/song/${item.id}`);
        toast.success("Song deleted!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Toaster position="top-right" />
      {showConfetti && <Confetti />}

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6 flex flex-col space-y-6">
        <h1 className="text-2xl font-bold text-green-500">Dashboard</h1>
        {[
          { label: "Users", icon: <FaUsers />, key: "users" },
          { label: "Albums", icon: <FaCompactDisc />, key: "albums" },
          { label: "Songs", icon: <FaMusic />, key: "songs" },
          { label: "Artists", icon: <FaMicrophone />, key: "artists" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${
              activeTab === tab.key ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Navbar */}
        <div className="bg-gray-800 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <button
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
            onClick={() => HandleLogout()}
          >
            <FaTrash /> Logout
          </button>
        </div>

        {/* Table */}
        <div className="p-6 space-y-4">
          <div className="flex justify-end">
            {activeTab !== "users" && (
              <button
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2"
                onClick={() => setOpenModal(true)}
              >
                <FaPlus /> Add {activeTab.slice(0, -1)}
              </button>
            )}
          </div>

          <table className="min-w-full text-left text-white border-collapse">
            <thead>
              <tr className="border-b border-gray-600">
                {getCurrentData()[0] &&
                  Object.keys(getCurrentData()[0]).map((key) => (
                    <th key={key} className="px-4 py-2 capitalize">
                      {key}
                    </th>
                  ))}
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentData().map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-700 hover:bg-gray-700 transition"
                >
                  {Object.values(item).map((value, idy) => (
                    <td key={idy} className="px-4 py-2">
                      {value}
                    </td>
                  ))}
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => toast("Edit clicked")}
                      className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {getCurrentData().length === 0 && (
            <p className="text-gray-400 text-center mt-4">No data available.</p>
          )}
        </div>
      </div>

      {/* Modal for Add */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={`Add ${activeTab.slice(0, -1)}`}
      >
        <form onSubmit={handleAdd} className="space-y-4">
          {activeTab === "albums" && (
            <>
              <input
                type="text"
                placeholder="Album Title"
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Artist ID"
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, artistId: e.target.value })
                }
                required
              />
              <FileInput
                label="Thumbnail"
                name="thumbnail"
                accept="image/*"
                onChange={(e) =>
                  setFiles({ ...files, thumbnail: e.target.files[0] })
                }
              />
            </>
          )}

          {activeTab === "songs" && (
            <>
              <input
                type="text"
                placeholder="Song Title"
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Album ID"
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, albumId: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Artist ID"
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, artistId: e.target.value })
                }
                required
              />
              <FileInput
                label="Audio File"
                name="audio"
                accept="audio/*"
                onChange={(e) =>
                  setFiles({ ...files, audio: e.target.files[0] })
                }
              />
              <FileInput
                label="Thumbnail"
                name="thumbnail"
                accept="image/*"
                onChange={(e) =>
                  setFiles({ ...files, thumbnail: e.target.files[0] })
                }
              />
            </>
          )}

          {activeTab === "artists" && (
            <>
              <input
                type="text"
                placeholder="Artist Name"
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Bio"
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
              <FileInput
                label="Thumbnail (optional)"
                name="thumbnail"
                accept="image/*"
                onChange={(e) =>
                  setFiles({ ...files, thumbnail: e.target.files[0] })
                }
              />
            </>
          )}

          <button
            type="submit"
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};
