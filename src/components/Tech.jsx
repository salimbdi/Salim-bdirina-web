import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { styles } from "../styles";
import { textVariant, fadeIn } from "../utils/motion";

// Augmented skills data with categories
const allSkills = [
  // Frontend
  { name: "React JS", icon: technologies.find(t => t.name === "React JS")?.icon, category: "Frontend" },
  { name: "Next.js", icon: "https://cdn.worldvectorlogo.com/logos/next-js.svg", category: "Frontend" },
  { name: "TypeScript", icon: technologies.find(t => t.name === "TypeScript")?.icon, category: "Frontend" },
  { name: "Tailwind CSS", icon: technologies.find(t => t.name === "Tailwind CSS")?.icon, category: "Frontend" },
  { name: "Three JS", icon: technologies.find(t => t.name === "Three JS")?.icon, category: "Frontend" },
  { name: "JavaScript", icon: technologies.find(t => t.name === "JavaScript")?.icon, category: "Frontend" },
  { name: "HTML 5", icon: technologies.find(t => t.name === "HTML 5")?.icon, category: "Frontend" },
  { name: "CSS 3", icon: technologies.find(t => t.name === "CSS 3")?.icon, category: "Frontend" },


  // Backend
  { name: "Node JS", icon: technologies.find(t => t.name === "Node JS")?.icon, category: "Backend" },
  { name: "MongoDB", icon: technologies.find(t => t.name === "MongoDB")?.icon, category: "Backend" },
  { name: "REST APIs", icon: technologies.find(t => t.name === "Redux Toolkit")?.icon, category: "Backend" },
  { name: "PostgreSQL", icon: "https://cdn.worldvectorlogo.com/logos/postgresql.svg", category: "Backend" },

  // DevOps
  { name: "Git", icon: technologies.find(t => t.name === "git")?.icon, category: "DevOps" },
  { name: "GitHub", icon: "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg", category: "DevOps" },
  { name: "Docker", icon: technologies.find(t => t.name === "docker")?.icon, category: "DevOps" },
  { name: "CI/CD", icon: technologies.find(t => t.name === "Node JS")?.icon , category: "DevOps" },

  // Soft Skills
  { name: "Problem Solving", icon: technologies.find(t => t.name === "Node JS")?.icon ,category: "Soft Skills" },
  { name: "Team Leadership", icon: technologies.find(t => t.name === "Node JS")?.icon ,category: "Soft Skills" },
  { name: "Communication", icon: technologies.find(t => t.name === "Node JS")?.icon ,category: "Soft Skills" },
  { name: "Time Mngmt", icon: technologies.find(t => t.name === "Node JS")?.icon ,category: "Soft Skills" }
];

const TechCard = ({ name, icon, index }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center gap-2 group cursor-pointer"
  >
    <div className="w-24 h-24 rounded-full bg-[#100d25] border border-[#232323] flex items-center justify-center relative overflow-hidden group-hover:border-[#00cea8] transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(0,206,168,0.3)]">
      <div className="absolute inset-0 bg-[#00cea8] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      <img src={icon} alt={name} className="w-12 h-12 object-contain filter group-hover:brightness-110 transition-all duration-300" />
    </div>
    <span className="text-secondary text-sm font-medium group-hover:text-white transition-colors">{name}</span>
  </motion.div>
);

const Tech = () => {
  const [activeTab, setActiveTab] = useState("All");
  const categories = ["All", "Frontend", "Backend", "DevOps", "Soft Skills"];

  const filteredSkills = activeTab === "All"
    ? allSkills
    : allSkills.filter(skill => skill.category === activeTab);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>My Expertise</p>
        <h2 className={`${styles.sectionHeadText} text-center !text-[#00cea8]`}>Skills & Expertise.</h2>
        <p className="text-secondary text-center max-w-2xl mx-auto mt-2 text-[16px]">
          A comprehensive set of skills and technologies I've mastered to deliver exceptional digital experiences and solutions.
        </p>
      </motion.div>

      {/* Categories Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mt-10 mb-16">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${activeTab === category
              ? "bg-[#00cea8] text-[#050816] border-[#00cea8] shadow-[0_0_10px_rgba(0,206,168,0.4)]"
              : "bg-[#100d25] text-secondary border-[#232323] hover:border-[#00cea8] hover:text-white"
              }`}
          >
            {category === "All" ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                All
              </span>
            ) : category === "Frontend" ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Frontend
              </span>
            ) : category === "Backend" ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                Backend
              </span>
            ) : category === "DevOps" ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                DevOps
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Soft Skills
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center"
      >
        <AnimatePresence>
          {filteredSkills.map((skill, index) => (
            <TechCard
              key={skill.name}
              index={index}
              {...skill}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default SectionWrapper(Tech, "");
