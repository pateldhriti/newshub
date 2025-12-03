import React from "react";

export default function Toast({ message, show }) {
  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in z-[9999]">
      {message}
    </div>
  );
}
