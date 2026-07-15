import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Navbar from "~/components/Navbar";
import ScoreCircle from "~/components/Scorecircle";
import { usePuterStore } from "../lib/Puter";
import { resumes } from "../../constant/index";

export default function ResumeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fs, kv, auth, isLoading } = usePuterStore();

  const [resume, setResume] = useState<any | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [auth.isAuthenticated, isLoading, id, navigate]);

  useEffect(() => {
    async function loadResume() {
      if (!id) return;
      setIsLoadingData(true);
      try {
        // 1. Try to load from Puter KV store
        const kvKey = `resume:${id}`;
        const dataStr = await kv.get(kvKey);
        
        if (dataStr) {
          try {
            const data = JSON.parse(dataStr);
            if (data && typeof data === "object") {
              setResume(data);
              setIsLoadingData(false);
              return;
            }
          } catch (e) {
            console.error("Failed to parse KV resume data:", e);
          }
        }

        // 2. Fallback to static resumes
        const staticResume = resumes.find((r) => r.id === id);
        if (staticResume) {
          setResume(staticResume);
          setIsLoadingData(false);
          return;
        }

        setErrorMsg("Resume not found");
      } catch (err) {
        console.error("Error loading resume details:", err);
        setErrorMsg(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoadingData(false);
      }
    }

    loadResume();
  }, [id, kv]);

  // Load preview image from local/static source or Puter filesystem
  useEffect(() => {
    if (!resume) return;

    if (
      resume.imagePath.startsWith("/images/") ||
      resume.imagePath.startsWith("http")
    ) {
      setImageSrc(resume.imagePath);
    } else {
      // It's a path on Puter fs (e.g. uploaded via user)
      fs.read(resume.imagePath)
        .then((blob) => {
          if (blob) {
            setImageSrc(URL.createObjectURL(blob));
          }
        })
        .catch((err) => {
          console.error("Failed to load image from Puter fs:", err);
        });
    }
  }, [resume, fs]);

  if (isLoadingData) {
    return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-[#8e98ff] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading resume feedback...</p>
        </div>
      </main>
    );
  }

  if (errorMsg || !resume) {
    return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
        <Navbar />
        <div className="max-w-xl mx-auto py-20 px-6 text-center">
          <div className="gradient-border p-8 bg-white/80 backdrop-blur-sm">
            <h2 className="text-red-500 font-semibold mb-4">Error loading feedback</h2>
            <p className="text-gray-600 mb-6">{errorMsg || "Resume data is unavailable."}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gradient-to-r from-[#8e98ff] to-[#606beb] text-white rounded-full font-medium shadow-md hover:opacity-90 transition-all cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  const { feedback } = resume;

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen pb-16">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex max-sm:flex-col sm:items-center sm:justify-between mb-8 pb-4 border-b border-gray-200/50 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 cursor-pointer"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {resume.companyName || "Resume Feedback"}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">{resume.jobTitle || "ATS Evaluation"}</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Resume Preview */}
          <div className="w-full lg:w-[45%] sticky top-6 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
            <div className="gradient-border bg-white p-2 w-full flex items-center justify-center min-h-[400px]">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Resume preview"
                  className="w-full h-auto object-contain rounded-lg border border-gray-100 shadow-sm"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-gray-400 gap-2">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
                  <p className="text-sm">Loading preview image...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Feedback Details */}
          <div className="w-full lg:w-[55%] flex flex-col gap-8">
            {/* Overall Score Card */}
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Evaluation Result</h3>
                <p className="text-gray-500 mt-1 max-w-sm">
                  We evaluated your resume based on modern ATS criteria, content quality, and job matching guidelines.
                </p>
              </div>
              <div className="flex-shrink-0 scale-110">
                <ScoreCircle score={feedback?.overallScore || 0} />
              </div>
            </div>

            {/* Resume Summary Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "ATS Score", score: feedback?.ATS?.score || 0, color: "text-[#8e98ff]" },
                { label: "Tone & Style", score: feedback?.toneAndStyle?.score || 0, color: "text-indigo-600" },
                { label: "Content", score: feedback?.content?.score || 0, color: "text-purple-600" },
                { label: "Structure", score: feedback?.structure?.score || 0, color: "text-pink-600" },
                { label: "Skills Matched", score: feedback?.skills?.score || 0, color: "text-[#5171FF]" },
              ].map((category, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-between gap-2 text-center"
                >
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {category.label}
                  </span>
                  <span className={`text-xl font-extrabold ${category.color}`}>
                    {category.score}%
                  </span>
                </div>
              ))}
            </div>

            {/* Detailed Category Sections */}
            <div className="flex flex-col gap-6">
              {/* Category Helper Renderer */}
              {[
                {
                  title: "ATS Optimization",
                  score: feedback?.ATS?.score || 0,
                  tips: feedback?.ATS?.tips || [],
                  description: "ATS optimization determines how easily candidate parsing algorithms read and match your skills to descriptions.",
                },
                {
                  title: "Tone & Style",
                  score: feedback?.toneAndStyle?.score || 0,
                  tips: feedback?.toneAndStyle?.tips || [],
                  description: "Tone and Style evaluations verify sentence structures, action verb choice, and professional voice consistency.",
                },
                {
                  title: "Content Quality",
                  score: feedback?.content?.score || 0,
                  tips: feedback?.content?.tips || [],
                  description: "Content analyses measure readability, formatting details, quantitative metrics, and experience impact.",
                },
                {
                  title: "Resume Structure",
                  score: feedback?.structure?.score || 0,
                  tips: feedback?.structure?.tips || [],
                  description: "Structure tests verify section splits, correct chronologies, document margins, layout spacing, and readability.",
                },
                {
                  title: "Core & Technical Skills",
                  score: feedback?.skills?.score || 0,
                  tips: feedback?.skills?.tips || [],
                  description: "Skills testing compares resume core skills directly to specified job profile requirements.",
                },
              ].map((section, sectionIdx) => (
                <div
                  key={sectionIdx}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50 gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{section.title}</h4>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed max-w-md">
                        {section.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 bg-gradient-to-br from-[#8e98ff]/10 to-[#5171FF]/10 px-4 py-2 rounded-xl border border-[#8e98ff]/20 text-center min-w-[70px]">
                      <div className="text-[10px] uppercase font-bold text-[#606beb] tracking-wider">Score</div>
                      <div className="text-lg font-black text-[#5171FF]">{section.score}%</div>
                    </div>
                  </div>

                  {/* Tips List */}
                  <div className="flex flex-col gap-4">
                    {section.tips && section.tips.length > 0 ? (
                      section.tips.map((item: any, tipIdx: number) => {
                        const isGood = item.type === "good";
                        return (
                          <div
                            key={tipIdx}
                            className={`p-4 rounded-xl border flex gap-3 ${
                              isGood
                                ? "bg-[#d5faf1]/30 border-[#d5faf1]/50 text-[#254d4a]"
                                : "bg-[#fceed8]/30 border-[#fceed8]/50 text-[#73321b]"
                            }`}
                          >
                            <span className="text-lg mt-0.5">{isGood ? "✨" : "💡"}</span>
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-sm leading-snug">
                                {item.tip}
                              </span>
                              {"explanation" in item && (
                                <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                                  {item.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-400 text-sm italic">No feedback tips available for this section.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
