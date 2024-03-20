import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import UserDropdown from "../components/userdropdown";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = auth.currentUser?.email || "Not logged in";
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Implement the Firebase logout logic here
    auth
      .signOut()
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to CodeHub</h1>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <i className="fas fa-user-circle text-2xl"></i>
            </button>
            {isOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <div className="p-4">
                  <p className="mb-2">{userEmail}</p>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* <h1 className="text-3xl font-bold mb-8 text-center">
          Welcome to CodeHub
        </h1> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            onClick={() => {
              navigate("/code_editor");
            }}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out h-70 transform hover:scale-105 flex flex-col justify-between cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-4">Coding</h2>
            <div className="space-y-4 bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <i className="fas fa-code text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Editor</h3>
                  <p>Comprehensive code editor for all your coding needs.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <i className="fas fa-sync-alt text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Real-time</h3>
                  <p>Experience real-time code execution.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <i className="fas fa-comment text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Insight</h3>
                  <p>Get immediate insight about your errors.</p>
                </div>
              </div>
            </div>
          </div>
          {/* ... Similar structure for other cards ... */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out h-70 transform hover:scale-105 flex flex-col justify-between cursor-pointer">
            <h2 className="text-xl font-semibold mb-4">Quiz</h2>
            <div className="space-y-4 bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <i className="fas fa-code text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Challenge</h3>
                  <p>Variety of coding challenges.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <i className="fas fa-sync-alt text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Difficulty</h3>
                  <p>Different difficulty levels.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <i className="fas fa-comment text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Progress</h3>
                  <p>Track progress and achievements.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out h-70 transform hover:scale-105 flex flex-col justify-between cursor-pointer">
            <h2 className="text-xl font-semibold mb-4">Learning</h2>
            <div className="space-y-4 bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <i className="fas fa-code text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Environtment</h3>
                  <p>Rich learning environment</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <i className="fas fa-sync-alt text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Curation</h3>
                  <p>Curated tutorials and resources</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <i className="fas fa-comment text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Paths</h3>
                  <p>Personalized learning paths</p>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              navigate("/forum");
            }}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out h-70 transform hover:scale-105 flex flex-col justify-between cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-4">Forum</h2>
            <div className="space-y-4 bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <i className="fas fa-code text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Collaboration</h3>
                  <p>Collaborative discussion forums.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <i className="fas fa-sync-alt text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Peer</h3>
                  <p>Engage in peer learning.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <i className="fas fa-comment text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Sharing</h3>
                  <p>Share insights and solutions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
