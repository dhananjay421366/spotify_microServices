import { useState, useEffect } from "react";
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
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useSong } from "../context/SongContext";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showConfetti, setShowConfetti] = useState(false);

  const { users, getAllUsers } = useAuth(); // get users from AuthContext
  const { albums, songs, artist: artists } = useSong(); // albums, songs, artists

  // Fetch users on mount
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleEdit = (item) => {
    toast.success("Edit action triggered!");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleDelete = (item) => {
    toast.success("Delete action triggered!");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

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
            onClick={() => toast("Logout clicked")}
          >
            <FaTrash /> Logout
          </button>
        </div>

        {/* Table */}
        <div className="p-6 space-y-4">
          <div className="flex justify-end">
            <button
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2"
              onClick={() => handleEdit("New " + activeTab)}
            >
              <FaPlus /> Add {activeTab.slice(0, -1)}
            </button>
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
                      onClick={() => handleEdit(item)}
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
    </div>
  );
};

