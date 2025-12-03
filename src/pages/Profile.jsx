import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <p className="text-xl text-gray-600 mb-4">You are not logged in.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header with gradient */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

        {/* Avatar and Name */}
        <div className="px-8 pb-8">
          <div className="flex flex-col items-center -mt-16">
            <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
              <div className="w-28 h-28 rounded-full bg-blue-600 text-white flex items-center justify-center text-5xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          {/* User Information */}
          <div className="mt-8 space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Account Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm mb-1">Full Name</p>
                  <p className="text-lg font-medium text-gray-800">{user.name}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm mb-1">Email Address</p>
                  <p className="text-lg font-medium text-gray-800">{user.email}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm mb-1">Account Type</p>
                  <p className="text-lg font-medium text-gray-800">Standard User</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm mb-1">Member Since</p>
                  <p className="text-lg font-medium text-gray-800">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
