import React from "react";
import { styles } from "../styles";
import { github } from "../assets"; // Using existing assets where possible, or SVGs

const Footer = () => {
    return (
        <footer className='w-full bg-primary py-10 border-t border-[#1f1f1f]'>
            <div className='max-w-7xl mx-auto px-6 sm:px-16 flex flex-wrap justify-between gap-10'>

                {/* Follow Me Section */}
                <div className='flex flex-col gap-4 min-w-[150px]'>
                    <h3 className='text-[#00cea8] font-bold text-[16px] tracking-wider uppercase mb-2'>Follow Me</h3>

                    <a href="https://github.com/salimbd" target="_blank" rel="noopener noreferrer"
                        className='flex items-center gap-3 text-secondary hover:text-white transition-colors group'>
                        <div className='w-8 h-8 rounded-lg bg-[#151030] border border-[#232323] flex justify-center items-center group-hover:border-[#00cea8] transition-colors'>
                            <img src={github} alt="github" className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                        </div>
                        <span>GitHub</span>
                    </a>

                    <a href="https://www.linkedin.com/in/salim-bdirina-1a6702293/" target="_blank" rel="noopener noreferrer"
                        className='flex items-center gap-3 text-secondary hover:text-white transition-colors group'>
                        <div className='w-8 h-8 rounded-lg bg-[#151030] border border-[#232323] flex justify-center items-center group-hover:border-[#00cea8] transition-colors'>
                            <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </div>
                        <span>LinkedIn</span>
                    </a>

                    <a href="#" target="_blank" rel="noopener noreferrer"
                        className='flex items-center gap-3 text-secondary hover:text-white transition-colors group'>
                        <div className='w-8 h-8 rounded-lg bg-[#151030] border border-[#232323] flex justify-center items-center group-hover:border-[#00cea8] transition-colors'>
                            <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        </div>
                        <span>LeetCode</span>
                    </a>
                </div>

                {/* Navigation Section */}
                <div className='flex flex-col gap-4 min-w-[150px]'>
                    <h3 className='text-[#00cea8] font-bold text-[16px] tracking-wider uppercase mb-2'>Navigation</h3>
                    <ul className='flex flex-col gap-3'>
                        <li><a href="#about" className='text-secondary hover:text-white hover:translate-x-1 transition-all inline-block'>About</a></li>
                        <li><a href="#experience" className='text-secondary hover:text-white hover:translate-x-1 transition-all inline-block'>Experience</a></li>
                        <li><a href="#projects" className='text-secondary hover:text-white hover:translate-x-1 transition-all inline-block'>Projects</a></li>
                        <li><a href="#skills" className='text-secondary hover:text-white hover:translate-x-1 transition-all inline-block'>Skills</a></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div className='flex flex-col gap-4 min-w-[200px]'>
                    <h3 className='text-[#00cea8] font-bold text-[16px] tracking-wider uppercase mb-2'>Contact</h3>

                    <div className='flex items-center gap-3 text-secondary group'>
                        <div className='w-8 h-8 rounded-lg bg-[#151030] border border-[#232323] flex justify-center items-center'>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <span className='text-[14px]'>salimbdirina@gmail.com</span>
                    </div>

                    <div className='flex items-center gap-3 text-secondary group'>
                        <div className='w-8 h-8 rounded-lg bg-[#151030] border border-[#232323] flex justify-center items-center'>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <span className='text-[14px]'>+213 6 59 24 34 51</span>
                    </div>

                    <div className='flex items-center gap-3 text-secondary group'>
                        <div className='w-8 h-8 rounded-lg bg-[#151030] border border-[#232323] flex justify-center items-center'>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <span className='text-[14px]'>Algiers, Algeria</span>
                    </div>
                </div>

                {/* Resume Section */}
                <div className='flex flex-col gap-4'>
                    <h3 className='text-[#00cea8] font-bold text-[16px] tracking-wider uppercase mb-2'>Resume</h3>
                    <button
                        onClick={() => window.open('/resume.pdf', '_blank')}
                        className="flex items-center gap-2 bg-[#00cea8] hover:bg-[#00b894] text-[#050816] px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-[#00cea8]/40 hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        Download CV
                    </button>
                </div>

            </div>

            {/* Copyright */}
            <div className='max-w-7xl mx-auto px-6 sm:px-16 mt-16 pt-8 border-t border-[#232323] flex flex-col md:flex-row justify-between items-center gap-4'>
                <p className='text-secondary text-[14px] text-center md:text-left'>
                    © {new Date().getFullYear()} <span className='text-[#00cea8]'>Salim</span>. All Rights Reserved.
                </p>

                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className='w-10 h-10 rounded-full bg-[#151030] text-secondary hover:text-[#00cea8] border border-[#232323] hover:border-[#00cea8] flex justify-center items-center transition-all duration-300'
                    title="Back to Top"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </button>
            </div>
        </footer>
    );
};

export default Footer;
