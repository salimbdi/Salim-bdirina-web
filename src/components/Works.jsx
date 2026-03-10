import React, { useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { github, web as projectFallbackImage } from "../assets";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { supabase } from "../lib/supabaseClient";

const ProjectCard = ({ index, id, name, description, tags, image, source_code_link, live_demo_link, views, onInteraction }) => {
  const isBadUrl = !image || image.includes("via.placeholder.com") || image === "undefined";

  return (
    <motion.div
      layout
      initial="hidden"
      animate="show"
      exit="hidden"
      variants={fadeIn("up", "spring", Math.min(index * 0.5, 2.5), 0.75)}
    >
      <Tilt
        tiltMaxAngleX={45}
        tiltMaxAngleY={45}
        scale={1}
        transitionSpeed={450}
        className='bg-[#100d25] p-5 rounded-2xl sm:w-[360px] w-full border border-[#232323] hover:border-[#00cea8] transition-colors duration-300 h-full flex flex-col'
      >
        {/* Project Image */}
        <div className='relative w-full h-[230px] overflow-hidden rounded-2xl group'>
          <img
            src={!isBadUrl ? image : projectFallbackImage}
            alt={name}
            className='w-full h-full object-cover transform hover:scale-110 transition-transform duration-500 group-hover:opacity-80'
            onError={(e) => {
              // If the remote image fails, fall back to local placeholder once
              if (e.target.src !== projectFallbackImage) {
                e.target.onerror = null;
                e.target.src = projectFallbackImage;
              }
            }}
          />
          {/* View Overlay on Hover */}
          <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60">
            <div className="bg-black/60 px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-sm">
              <svg className="w-4 h-4 text-[#00cea8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <span className="text-white text-xs font-bold">{views || 0}</span>
            </div>
          </div>
        </div>

        <div className='mt-5 flex-grow'>
          <div className="flex justify-between items-start">
            <h3 className='text-white font-bold text-[22px] leading-tight'>{name}</h3>
          </div>

          {/* Tags */}
          <div className='mt-4 flex flex-wrap gap-2'>
            {tags && tags.map((tag) => (
              <span
                key={`${name}-${tag.name}`}
                className={`text-[12px] px-2 py-1 rounded-md font-medium ${tag.color || "text-secondary bg-gray-800"}`}
              >
                {tag.name}
              </span>
            ))}
          </div>

          <p className='mt-4 text-secondary text-[14px] leading-relaxed line-clamp-4'>
            {description}
          </p>
        </div>

        {/* Buttons */}
        <div className='mt-6 flex items-center gap-4 pt-4 border-t border-[#232323]'>
          <button
            onClick={() => {
              onInteraction(id);
              if (source_code_link) window.open(source_code_link, "_blank");
            }}
            className='flex items-center gap-2 bg-[#151030] hover:bg-[#1f1b3a] text-white px-4 py-2 rounded-full text-[14px] font-medium transition-all duration-300 border border-[#232323] hover:border-white'
          >
            <img src={github} alt="github" className="w-5 h-5" />
            Source Code
          </button>

          <button
            onClick={() => {
              onInteraction(id);
              if (live_demo_link) window.open(live_demo_link, "_blank");
            }}
            className='flex items-center gap-2 bg-[#00cea8] hover:bg-[#00b894] text-[#050816] px-4 py-2 rounded-full text-[14px] font-bold transition-all duration-300 shadow-lg hover:shadow-[#00cea8]/40'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Live Demo
          </button>
        </div>
      </Tilt>
    </motion.div>
  );
};

const FilterButton = ({ active, title, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-full flex items-center gap-2 text-[16px] font-medium transition-all duration-300 border ${active
      ? "bg-[#1f1f1f] border-[#00cea8] text-[#00cea8] shadow-[0_0_10px_rgba(0,206,168,0.2)]"
      : "bg-transparent border-[#232323] text-secondary hover:text-white"
      }`}
  >
    {title}
  </button>
);

const Works = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("Works Component - Active Filter:", activeFilter);
  console.log("Projects State:", projects);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [{ data: catData, error: catError }, { data: projData, error: projError }] =
        await Promise.all([
          supabase.from("project_categories").select("*").order("name", { ascending: true }),
          supabase
            .from("projects")
            .select("*, project_categories(id, name)")
            .order("created_at", { ascending: false }),
        ]);

      setLoading(false);
      if (catError) console.error(catError);
      if (projError) console.error(projError);

      setCategories(catData || []);

      const mapped =
        projData?.map((p) => ({
          ...p,
          category: p.project_categories?.name || null,
          tags: Array.isArray(p.tags)
            ? p.tags
            : typeof p.tags === "string" && p.tags.length > 0
              ? p.tags.split(",").map((name) => ({
                name: name.trim(),
                color: "bg-blue-500/10 text-blue-400",
              }))
              : [],
        })) || [];

      setProjects(mapped);
    };

    loadData();
  }, []);

  const handleInteraction = async (id) => {
    const current = projects.find((p) => p.id === id);
    if (!current) return;

    const newViews = (current.views || 0) + 1;
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, views: newViews } : p))
    );

    await supabase
      .from("projects")
      .update({ views: newViews })
      .eq("id", id);
  };

  const filteredProjects = projects.filter((project) => {
    const categoryMatch =
      activeFilter === "All" || project.category === activeFilter;
    const statusOk =
      project.status === null ||
      project.status === undefined ||
      (project.status !== "Draft" && project.status !== "Archived");
    return categoryMatch && statusOk;
  });

  const displayProjects = filteredProjects;

  return (
    <>
      <div className="flex flex-col items-center">
        <motion.div variants={textVariant()} className="text-center">
          <h2 className={`${styles.sectionHeadText} text-[#00cea8]`}>Featured Projects</h2>
          <p className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px] text-center">
            Here are some of my recent projects. Each project represents a unique challenge and solution.
          </p>
        </motion.div>

        {/* Filters */}
        <div className='mt-12 flex flex-wrap justify-center gap-4 bg-[#100d25] p-2 rounded-full border border-[#232323]'>
          <FilterButton
            key="All"
            title="All"
            active={activeFilter === "All"}
            onClick={() => setActiveFilter("All")}
          />
          {categories.map((category) => (
            <FilterButton
              key={category.id}
              title={category.name}
              active={activeFilter === category.name}
              onClick={() => setActiveFilter(category.name)}
            />
          ))}
        </div>
      </div>

      <div className='mt-16 flex flex-wrap justify-center gap-8 min-h-[120px]'>
        {loading && (
          <p className="text-secondary text-sm">
            Loading projects from Supabase...
          </p>
        )}
        {!loading && displayProjects.length === 0 && (
          <p className="text-secondary text-sm">
            No projects found. Create projects in the admin dashboard.
          </p>
        )}
        {!loading && (
          <AnimatePresence>
            {displayProjects.map((project, index) => (
              <ProjectCard
                key={`project-${project.id || index}`}
                index={index}
                {...project}
                onInteraction={handleInteraction}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* View All Projects Link */}
      <div className="w-full flex justify-center mt-12">
          <a
    href="https://github.com/salimbdi?tab=repositories"
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#00cea8] font-semibold text-lg hover:underline flex items-center gap-2"
  >
          View all projects
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
