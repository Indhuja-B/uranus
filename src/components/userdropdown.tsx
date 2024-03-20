import React, { useState } from "react";

const UserDropdown: React.FC<{ email: string; onLogout: () => void }> = ({
  email,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <i className="fas fa-user-circle text-2xl"></i>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg">
          <div className="p-4">
            <p className="mb-2">{email}</p>
            <button
              onClick={onLogout}
              className="text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
