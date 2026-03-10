import React, { useEffect, useState } from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { supabase } from "../lib/supabaseClient";

// Custom components for the new layout
const ExperienceItem = ({ role, company, companyLink, date, description, tags, hasAttestation, attestationUrl, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="relative pl-8 pb-12 border-l border-[#232323] last:border-0 last:pb-0"
  >
    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#00cea8]" />

    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
      <h3 className="text-white font-bold text-xl">{role}</h3>
      <span className="px-3 py-1 rounded-full bg-[#00cea8]/10 text-[#00cea8] text-xs font-semibold border border-[#00cea8]/20">
        {date}
      </span>
    </div>

    <a href={companyLink} target="_blank" rel="noopener noreferrer" className="text-[#00cea8] hover:underline text-sm font-medium mb-3 block">
      {company} ↗
    </a>

    <p className="text-secondary text-sm leading-relaxed mb-4">
      {description}
    </p>

    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag, i) => (
        <span key={i} className={`text-xs px-2 py-1 rounded-md bg-opacity-10 ${i % 4 === 0 ? "bg-blue-500 text-blue-500" :
          i % 4 === 1 ? "bg-green-500 text-green-500" :
            i % 4 === 2 ? "bg-purple-500 text-purple-500" :
              "bg-orange-500 text-orange-500"
          } bg-opacity-10`}>
          {/* Note: bg-opacity logic above is a bit duplicated, simplifying styles */}
          <span className={
            i % 4 === 0 ? "text-blue-400" :
              i % 4 === 1 ? "text-green-400" :
                i % 4 === 2 ? "text-purple-400" :
                  "text-orange-400"
          }>{tag}</span>
        </span>
      ))}
    </div>

    {hasAttestation && attestationUrl && (
      <button
        onClick={() => window.open(attestationUrl, "_blank")}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#232323] hover:border-[#00cea8] text-sm text-secondary hover:text-white transition-all group"
      >
        <svg className="w-4 h-4 text-[#00cea8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        Attestation
      </button>
    )}
  </motion.div>
);

const EducationCard = ({ degree, school, schoolLink, date }) => (
  <div className="bg-[#100d25] p-6 rounded-2xl border border-[#232323] hover:border-[#00cea8]/50 transition-colors group">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-white font-bold text-lg leading-tight w-3/4">{degree}</h3>
      <span className="px-2 py-1 rounded bg-[#00cea8]/10 text-[#00cea8] text-[10px] font-bold border border-[#00cea8]/20">
        {date}
      </span>
    </div>
    <a href={schoolLink || "#"} className="text-secondary text-sm group-hover:text-[#00cea8] transition-colors flex items-center gap-1">
      {school}
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
    </a>
  </div>
);

const CertificationItem = ({ name, issuer, year, iconColor, fileUrl }) => (
  <div className="flex items-center gap-4 p-6 bg-[#100d25] rounded-2xl border border-[#232323] hover:border-[#00cea8]/30 transition-colors">
    <div className={`w-10 h-10 rounded-2xl ${iconColor} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
      <svg className={`w-5 h-5 ${iconColor.replace('bg-', 'text-')}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    </div>
    <div>
      <h4 className="text-white font-bold text-sm">{name}</h4>
      <p className="text-secondary text-xs">{issuer} • <span className="text-[#00cea8]">{year}</span></p>
      {fileUrl && (
        <button
          onClick={() => window.open(fileUrl, "_blank")}
          className="mt-1 text-[19px] text-[#00cea8] hover:underline"
        >
          View certificate
        </button>
      )}
    </div>
  </div>
);

const About = () => {
  const [intro, setIntro] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    const loadAll = async () => {
      // Intro text
      const [{ data: introRow }, { data: expData, error: expError }, { data: eduData, error: eduError }, { data: certData, error: certError }] =
        await Promise.all([
          supabase
            .from("site_settings")
            .select("value")
            .eq("key", "about_intro")
            .maybeSingle(),
          supabase
            .from("work_experiences")
            .select("*")
            .order("sort_order", { ascending: true }),
          supabase
            .from("educations")
            .select("*")
            .order("sort_order", { ascending: true }),
          supabase
            .from("certifications")
            .select("*")
            .order("year", { ascending: false }),
        ]);

      if (introRow?.value) setIntro(introRow.value);
      if (!expError) setExperiences(expData || []);
      if (!eduError) setEducations(eduData || []);
      if (!certError) setCertifications(certData || []);

      if (expError) console.error(expError);
      if (eduError) console.error(eduError);
      if (certError) console.error(certError);
    };

    loadAll();
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        
        <div id="work" className="scroll-mt-28" />
        <h2 className={`${styles.sectionHeadText} !text-[#00cea8]`}>Experience & Education</h2>
        <p className="text-secondary mt-2 max-w-3xl">
          A timeline of my professional background, education, and notable achievements.
        </p>
      </motion.div>

      {/* Bio / Introduction */}
      <motion.div
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-8 text-secondary text-[17px] max-w-3xl leading-[30px] mb-20'
      >
        <p>
          {intro ||
            "Update your about/bio text from the admin dashboard (Content tab) to display it here."}
        </p>
      </motion.div>

      {/* Split Layout: Experience & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-10">

        {/* Left Column: Work Experience */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-6 h-6 text-[#00cea8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <h3 className="text-2xl font-bold text-white">Work Experience</h3>
          </div>

          <div className="space-y-2">
            {experiences.map((exp, index) => (
              <ExperienceItem
                key={exp.id}
                index={index}
                role={exp.role}
                company={exp.company}
                companyLink={exp.company_link}
                date={exp.date_range}
                description={exp.description}
                tags={exp.tags ? String(exp.tags).split(",").map(t => t.trim()).filter(Boolean) : []}
                hasAttestation={!!exp.has_attestation}
                attestationUrl={exp.attestation_url}
              />
            ))}
            {experiences.length === 0 && (
              <p className="text-secondary text-sm">
                No work experiences yet. Add them in the admin dashboard under the Content tab.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Education & Certifications */}
        <div className="space-y-12">

          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <svg className="w-6 h-6 text-[#00cea8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
              <h3 className="text-2xl font-bold text-white">Education</h3>
            </div>

            <div className="space-y-4">
              {educations.map((edu) => (
                <EducationCard
                  key={edu.id}
                  degree={edu.degree}
                  school={edu.school}
                  schoolLink={edu.school_link}
                  date={edu.date_range}
                />
              ))}
              {educations.length === 0 && (
                <p className="text-secondary text-sm">
                  No education entries yet. Manage them in the admin dashboard.
                </p>
              )}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <svg className="w-6 h-6 text-[#00cea8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-2xl font-bold text-white">Certifications</h3>
            </div>

            <div className="space-y-4">
              {certifications.map((cert) => (
                <CertificationItem
                  key={cert.id}
                  name={cert.name}
                  issuer={cert.issuer}
                  year={cert.year}
                  iconColor={cert.color || "bg-blue-500"}
                  fileUrl={cert.file_url}
                />
              ))}
              {certifications.length === 0 && (
                <p className="text-secondary text-sm">
                  No certifications yet. Add them with files from the admin dashboard.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

    </>
  );
};

export default SectionWrapper(About, "about");
