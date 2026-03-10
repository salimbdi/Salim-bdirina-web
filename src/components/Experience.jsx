import React, { useEffect, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { supabase } from "../lib/supabaseClient";

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.date_range}
      iconStyle={{ background: "#383E56" }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          <span className="text-white font-bold text-lg">
            {experience.company?.[0] || "W"}
          </span>
        </div>
      }
    >
      <div>
        <h3 className='text-white text-[24px] font-bold'>{experience.role}</h3>
        <p
          className='text-secondary text-[16px] font-semibold'
          style={{ margin: 0 }}
        >
          {experience.company}
        </p>
      </div>

      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {experience.description && (
          <li className='text-white-100 text-[14px] pl-1 tracking-wider'>
            {experience.description}
          </li>
        )}
        {experience.tags &&
          String(experience.tags)
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
            .map((tag, index) => (
              <li
                key={`experience-tag-${index}`}
                className='text-white-100 text-[13px] pl-1 tracking-wider'
              >
                <span className="text-[#00cea8] font-semibold mr-1">
                  Tag:
                </span>
                {tag}
              </li>
            ))}
        {experience.attachments &&
          experience.attachments.length > 0 && (
            <li className='text-white-100 text-[13px] pl-1 tracking-wider'>
              <span className="text-[#00cea8] font-semibold mr-1">
                Attachments:
              </span>
              {experience.attachments.map((file) => (
                <button
                  key={file.id}
                  onClick={() => window.open(file.file_url, "_blank")}
                  className="text-sm text-secondary hover:text-white underline mr-3"
                >
                  {file.file_name || "View file"}
                </button>
              ))}
            </li>
          )}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [{ data: expData, error: expError }, { data: fileData, error: fileError }] =
        await Promise.all([
          supabase
            .from("work_experiences")
            .select("*")
            .order("sort_order", { ascending: true }),
          supabase
            .from("work_experience_files")
            .select("*")
            .order("created_at", { ascending: true }),
        ]);

      if (expError) {
        console.error(expError);
      }
      if (fileError) {
        console.error(fileError);
      }

      const byExperience =
        (fileData || []).reduce((acc, file) => {
          const key = file.experience_id;
          if (!acc[key]) acc[key] = [];
          acc[key].push(file);
          return acc;
        }, {}) || {};

      const mapped =
        (expData || []).map((exp) => ({
          ...exp,
          attachments: byExperience[exp.id] || [],
        })) || [];

      setItems(mapped);
    };

    load();
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          What I have done so far
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Work Experience.
        </h2>
      </motion.div>

      <div className='mt-20 flex flex-col'>
        <VerticalTimeline>
          {items.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
        {items.length === 0 && (
          <p className="text-center text-secondary text-sm mt-8">
            No work experiences found. Add them from the admin dashboard
            (Content tab).
          </p>
        )}
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
