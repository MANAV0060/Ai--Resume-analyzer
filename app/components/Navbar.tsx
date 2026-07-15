import { Link } from "react-router";
import React from 'react';
import { usePuterStore } from "../lib/Puter";

const Navbar = () => {
  const { auth } = usePuterStore();

  return (
    <nav className="navbar">
      <Link to="/">     
        <p className="text-2xl font text-gradient">RESUMIND</p>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/upload" className="primary-button w-fit text-center whitespace-nowrap">
          Upload Resume
        </Link>
        {auth.isAuthenticated && (
          <button 
            onClick={auth.signOut} 
            className="border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer"
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;