// src/App.jsx
import { useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function Support() {
  const faqData = [
    {
      title: "Payments & billing",
      items: ["Payment methods", "View receipts", "Update billing info"],
    },
    {
      title: "Manage your account",
      items: ["Profile settings", "Change email", "Close account"],
    },
    { title: "Premium plans", items: ["Individual", "Family", "Student"] },
    {
      title: "In-app features",
      items: ["Playlists", "Search", "Offline mode"],
    },
    {
      title: "Devices & troubleshooting",
      items: ["Connect devices", "App issues", "Web player"],
    },
    {
      title: "Safety & privacy",
      items: ["Privacy settings", "Security tips", "Data protection"],
    },
  ];

  const quickHelp = [
    "Can't log in to Spotify",
    "Failed payment help",
    "Charged too much",
    "Invite or remove Family plan members",
    "How to change your payment details",
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-500">
      {/* Header */}
      <Navbar />

      {/* Search */}
      <div className="px-6 py-6">
        <input
          type="text"
          placeholder="Search help articles"
          className="w-full bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none"
        />
      </div>

      {/* FAQ Sections */}
      <div className="px-6 space-y-2">
        {faqData.map((faq, i) => (
          <div key={i} className="border-b border-gray-700">
            <button
              className="w-full flex justify-between items-center py-4 text-left text-gray-500 hover:text-white"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="text-lg font-medium">{faq.title}</span>
              <span className="text-gray-400">
                {openIndex === i ? "-" : "+"}
              </span>
            </button>
            {openIndex === i && (
              <ul className="pl-4 pb-3 space-y-2 text-gray-400 text-sm">
                {faq.items.map((item, j) => (
                  <li key={j} className="hover:text-white cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Quick Help */}
      <div className="px-6 py-10">
        <h2 className="text-xl font-semibold mb-4">Quick help</h2>
        <ul className="space-y-2 text-gray-400">
          {quickHelp.map((q, i) => (
            <li key={i} className="hover:text-white cursor-pointer">
              {q}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
