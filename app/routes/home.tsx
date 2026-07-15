import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import Resumecard from "~/components/Resumecard";
import { resumes } from "../../constant/index";
import React, { useEffect } from "react";
import { usePuterStore } from "../lib/Puter";
import { useLocation, useNavigate } from "react-router";
import auth from "./auth";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "resumind" },
    { name: "description", content: "AI-powered resume builder and matcher" },
  ];
}

export default function Home() {


   const { auth, isLoading } = usePuterStore();
   const navigate = useNavigate();

   useEffect(() => {
     if (!isLoading && !auth.isAuthenticated) navigate('/auth?next=/');
   }, [auth.isAuthenticated, isLoading, navigate]);

  return <main className ="bg-[url('/images/bg-main.svg')] bg-cover ">
    <Navbar/>
  <section className ="main-section">
    <div className="page-heading  py-16">
      <h1>Track Your Application & Resume Rating  </h1>
      <h2> review your submission  and check Ai-prowered feedback. </h2>
      </div>

  

  
{resumes.length > 0 && (
  <div className="resumes-section">
    {resumes.map((resume) => (
      <Resumecard key={resume.id} resume={resume} />
    ))}
  </div>
)}

</section>

  </main>
}
