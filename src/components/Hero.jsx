import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import { supabase } from "../lib/supabaseClient";

const Hero = () => {
  const [settings, setSettings] = useState({
    resume_url: "",
    linkedin_url: "https://www.linkedin.com/in/salim-bdirina-1a6702293/",
    github_url: "https://github.com/salimbdi?tab=repositories",
    instagram_url: "https://www.instagram.com/sal_im2005/",
    facebook_url: "https://www.facebook.com/sa.iim.10/",
    telegram_url: "https://web.telegram.org/k/#5715336522"
  });

  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "resume_url",
          "linkedin_url",
          "github_url",
          "instagram_url",
          "facebook_url",
          "telegram_url",
        ]);
      if (error) {
        console.error(error);
        return;
      }
      const next = { ...settings };
      (data || []).forEach((row) => {
        next[row.key] = row.value;
      });
      setSettings(next);
    };

    loadSettings();
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResumeDownload = () => {
    if (settings.resume_url) {
      window.open(settings.resume_url, '_blank');
    } else {
      alert("Resume link has not been set in the dashboard yet.");
    }
  };

  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 z-10 pointer-events-none`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        <div className="w-full flex flex-wrap justify-between items-start gap-10">
          <div className="pointer-events-auto">
            <h1 className={`${styles.heroHeadText} text-white`}>
              Hi, I'm <span className='text-[#915EFF]'>Salim</span>
            </h1>
            <p className={`${styles.heroSubText} mt-2 text-white-100`}>
              AI Engineer Student   <br className='sm:block hidden' />
& web developer & mobile developer
            </p>
          </div>

          <div className="flex flex-col items-end gap-6 mt-4 sm:mt-0 pointer-events-auto">
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-end gap-4 mt-6">
              <button
                onClick={scrollToProjects}
                className="flex items-center gap-2 bg-[#00cea8] hover:bg-[#00b894] text-[#050816] px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-[#00cea8]/40 hover:-translate-y-1 cursor-pointer"
              >
                View My Work
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>

              <button
                onClick={handleResumeDownload}
                className="flex items-center gap-2 bg-[#151030] hover:bg-[#1f1b3a] text-white px-6 py-3 rounded-full font-bold transition-all duration-300 border border-[#232323] hover:border-[#00cea8] cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Resume
              </button>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center">
              <span className="text-secondary text-sm font-medium mr-2 hidden sm:block">Find me on</span>

              {/* GitHub */}
              {settings.github_url && (
                <a
                  href={settings.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#151030] border border-[#232323] flex items-center justify-center text-secondary hover:text-[#00cea8] hover:border-[#00cea8] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  title="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}

              {/* LinkedIn */}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#151030] border border-[#232323] flex items-center justify-center text-secondary hover:text-[#00cea8] hover:border-[#00cea8] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}

              {/* Instagram */}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#151030] border border-[#232323] flex items-center justify-center text-secondary hover:text-[#00cea8] hover:border-[#00cea8] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  title="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}

              {/* Facebook */}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#151030] border border-[#232323] flex items-center justify-center text-secondary hover:text-[#00cea8] hover:border-[#00cea8] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  title="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <ComputersCanvas />

      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center z-10 pointer-events-none'>
        <a href='#about' className="pointer-events-auto cursor-pointer">
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
