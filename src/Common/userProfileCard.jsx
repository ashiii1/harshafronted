/* eslint-disable react/prop-types */

import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { API_URL } from "../Utils/constants";
import { useNavigate } from "react-router-dom";

const UserProfileCard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("about");
  const navigate = useNavigate();

  // Check if there's data to display for each section
  const loggedInUser = useSelector((state) => state.user);
  const [isCurrentUser, setCurrentUser] = useState(
    loggedInUser._id === user._id
  );
  const hasEducation = user?.education;
  const hasInterests = user?.interests && user?.interests.length > 0;
  const hasLocation = user?.city || user?.state || user?.country;
  const hasProjects = user?.projectList && user?.projectList.length > 0;
  const hasFriends = user?.friendList && user?.friendList.length > 0;
  const [requestSent, setRequestSent] = useState(false);

  const handleConnection = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/connection/request/send/interested/${user?._id}`,
        {},
        { withCredentials: true }
      );
      if (response.status !== 404) setRequestSent(!requestSent);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden my-4">
      {/* Banner and Profile Image */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="absolute -bottom-12 left-6">
          <div className="rounded-full border-4 border-white overflow-hidden h-24 w-24">
            <img
              src={user?.profileImageUrl}
              alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Connection/Edit Button */}
        <div className="absolute bottom-2 right-4">
          {isCurrentUser ? (
            <button
              onClick={() => {
                navigate("/register");
              }}
              className="bg-white text-blue-700 px-4 py-1 rounded-full text-sm font-semibold shadow hover:bg-gray-100"
            >
              Edit Profile
            </button>
          ) : (
            <button
              className="bg-blue-700 text-white px-4 py-1 rounded-full text-sm font-semibold shadow hover:bg-blue-800"
              onClick={handleConnection}
            >
              {!requestSent ? "+ Connect" : "Pending"}
            </button>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="pt-14 px-6">
        <h2 className="text-xl font-bold">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-gray-600 text-sm">@{user?.username}</p>

        {/* Stats Overview */}
        <div className="flex justify-between mt-4 border-t border-b border-gray-200 py-3">
          <div className="text-center">
            <p className="font-bold text-blue-700">
              {user?.projectList?.length || 0}
            </p>
            <p className="text-xs text-gray-600">Projects</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-blue-700">
              {user?.companyList?.filter((c) => c.founded)?.length || 0}
            </p>
            <p className="text-xs text-gray-600">Companies</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-blue-700">
              {user?.ideaList?.length || 0}
            </p>
            <p className="text-xs text-gray-600">Ideas</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-blue-700">
              {user?.friendList?.length || 0}
            </p>
            <p className="text-xs text-gray-600">Connections</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mt-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "about"
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "skills"
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("skills")}
          >
            Skills & Interests
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "network"
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("network")}
          >
            Network
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-4 min-h-40">
          {activeTab === "about" && (
            <div>
              <p className="text-sm text-gray-700 mb-3">
                {user?.about || "No bio provided yet."}
              </p>

              {hasLocation && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {[user?.city, user?.state, user?.country]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}

              {hasEducation && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                    />
                  </svg>
                  {user?.education}
                </div>
              )}

              {user?.phoneNumber && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {user?.phoneNumber}
                </div>
              )}
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              {hasInterests ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Interests & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No skills or interests added yet.
                </p>
              )}
            </div>
          )}

          {activeTab === "network" && (
            <div>
              {hasFriends ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Connections
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.friendList.slice(0, 5).map((friend, index) => (
                      <Link
                        key={index}
                        to={`/profile/${friend._id}`}
                        className="hover:opacity-75"
                      >
                        <img
                          src={
                            friend.profileImageUrl ||
                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          }
                          alt={friend.username}
                          className="w-10 h-10 rounded-full border border-gray-200"
                        />
                      </Link>
                    ))}
                    {user.friendList.length > 5 && (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                        +{user.friendList.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No connections yet.</p>
              )}

              {hasProjects && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Active Projects
                  </h3>
                  <div className="space-y-2">
                    {user.projectList.slice(0, 3).map((projectItem, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-md p-2 text-xs"
                      >
                        <p className="font-medium">
                          {projectItem.project?.name || "Unnamed Project"}
                        </p>
                        <p className="text-gray-500">
                          {projectItem.owner ? "Owner" : "Collaborator"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
