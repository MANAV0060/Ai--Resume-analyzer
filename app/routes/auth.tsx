import React, { useEffect } from "react";
import { usePuterStore } from "../lib/Puter";
import { useLocation, useNavigate } from "react-router";

export const meta = () => {
  return [
    { title: "Resumind - Secure Authentication" },
    { name: "description", content: "Sign in to your Resumind account securely using Puter.js" },
  ];
};

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  const next = new URLSearchParams(location.search).get("next") || "/";

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(next);
    }
  }, [auth.isAuthenticated, next, navigate]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8e98ff]/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5171FF]/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      <div className="backdrop-blur-xl bg-white/75 border border-white/40 shadow-[0_24px_50px_-12px_rgba(96,107,235,0.15)] rounded-3xl max-w-md w-full p-8 flex flex-col gap-6 text-center animate-in fade-in zoom-in-95 duration-500 relative z-10">
        
        {/* Animated Brand Header */}
        <div className="flex flex-col gap-3">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-[#8e98ff]/20 to-[#606beb]/20 rounded-2xl flex items-center justify-center border border-[#8e98ff]/30 shadow-inner">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8e98ff] to-[#5171FF]">Resumind</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Unlock AI-powered ATS scoring, format evaluation, and professional feedback for your resume.
          </p>
        </div>

        {/* Feature Summary Grid */}
        <div className="flex flex-col gap-3 text-left bg-gray-50/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100">
          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">📊</span>
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">ATS Readiness Scan</h3>
              <p className="text-xs text-gray-500 leading-normal mt-0.5">Verify matches, readability, and spacing suitability against top scanners.</p>
            </div>
          </div>
          <div className="h-px bg-gray-200/50 my-1"></div>
          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">🧠</span>
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">AI Content Analysis</h3>
              <p className="text-xs text-gray-500 leading-normal mt-0.5">Get advice on phrasing, grammar choice, action verbs, and skills.</p>
            </div>
          </div>
          <div className="h-px bg-gray-200/50 my-1"></div>
          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">🔒</span>
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Secure Private Storage</h3>
              <p className="text-xs text-gray-500 leading-normal mt-0.5">All resume uploads and ratings are saved privately in your personal vault.</p>
            </div>
          </div>
        </div>

        {/* Authentication Options */}
        <div className="mt-2 flex flex-col gap-4">
          {isLoading ? (
            <button className="primary-button flex items-center justify-center gap-3 py-4 shadow-lg opacity-85 cursor-not-allowed">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold">Initializing Security...</span>
            </button>
          ) : auth.isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-green-600 font-bold flex items-center justify-center gap-1">
                ✓ Successfully Authenticated
              </p>
              <button 
                className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-full font-medium transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                onClick={auth.signOut}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              className="primary-button py-4 text-sm font-semibold hover:shadow-[0_8px_20px_rgba(96,107,235,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              onClick={auth.signIn}
            >
              Sign In with Puter.js
            </button>
          )}

          {/* Secure System Explainer */}
          <div className="text-[11px] text-gray-400 leading-relaxed mt-2">
            Authentication is securely managed by **Puter.js**. Sign in with Email, Google, or GitHub in seconds. No credit card or password registration is required.
          </div>
        </div>

      </div>
    </main>
  );
};

export default Auth;
