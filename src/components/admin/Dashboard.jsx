import React, { useState, useEffect } from "react";
import Login from "./Login";
import Overview from "./Overview";
import ProjectsManager from "./ProjectsManager";
import ReviewsManager from "./ReviewsManager";
import SettingsManager from "./SettingsManager";
import ContentManager from "./ContentManager";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";

const SidebarItem = ({ icon, text, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 transform active:scale-95 ${active
            ? "bg-[#00cea8]/10 text-[#00cea8] border-l-4 border-[#00cea8]"
            : "text-secondary hover:text-white hover:bg-[#151030] hover:translate-x-1"
            }`}
    >
        {icon}
        <span className="font-medium text-sm">{text}</span>
    </button>
);

const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const initAuth = async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user) {
                setUser(data.user);
                setIsAuthenticated(true);
            }
        };
        initAuth();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        });

        return () => {
            sub.subscription.unsubscribe();
        };
    }, []);

    const handleLogin = (signedInUser) => {
        setUser(signedInUser);
        setIsAuthenticated(true);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setUser(null);
    };

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-primary text-white overflow-hidden font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-[#100d25] border-r border-[#232323] flex flex-col justify-between hidden md:flex z-50 shadow-2xl">
                <div>
                    <div className="p-6 border-b border-[#232323]">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-[#00cea8] bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300 cursor-default">
                            Admin Panel
                        </h1>
                        <p className="text-xs text-secondary mt-1 tracking-wider uppercase font-semibold">v2.1.0 Stable</p>
                        {user && (
                            <p className="text-[10px] text-gray-500 mt-1 break-all">
                                Signed in as {user.email}
                            </p>
                        )}
                    </div>

                    <nav className="p-4 space-y-2 mt-4">
                        <SidebarItem
                            active={activeTab === "overview"}
                            onClick={() => setActiveTab("overview")}
                            text="Overview"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                        />
                        <SidebarItem
                            active={activeTab === "content"}
                            onClick={() => setActiveTab("content")}
                            text="Content"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h10M4 14h16M4 18h10" /></svg>}
                        />
                        <SidebarItem
                            active={activeTab === "projects"}
                            onClick={() => setActiveTab("projects")}
                            text="Projects"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                        />
                        <SidebarItem
                            active={activeTab === "reviews"}
                            onClick={() => setActiveTab("reviews")}
                            text="Reviews"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                        />
                        <SidebarItem
                            active={activeTab === "settings"}
                            onClick={() => setActiveTab("settings")}
                            text="Settings"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        />
                        <SidebarItem
                            active={activeTab === "analytics"}
                            onClick={() => setActiveTab("analytics")}
                            text="Analytics"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2h-6a2 2 0 01-2-2z" /></svg>}
                        />
                    </nav>
                </div>

                <div className="p-4 border-t border-[#232323]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors group"
                    >
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-primary relative scrollbar-thin scrollbar-thumb-[#232323] scrollbar-track-transparent">
                {/* Header Mobile */}
                <div className="md:hidden flex items-center justify-between p-4 bg-[#100d25] border-b border-[#232323] sticky top-0 z-40">
                    <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                    <button onClick={() => alert('Mobile menu not implemented for demo')} className="text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>

                <main className="p-6 md:p-10 max-w-7xl mx-auto min-h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "overview" && <Overview />}
                            {activeTab === "content" && <ContentManager />}
                            {activeTab === "projects" && <ProjectsManager />}
                            {activeTab === "reviews" && <ReviewsManager />}
                            {activeTab === "settings" && <SettingsManager />}
                            {activeTab === "analytics" && (
                                <div className="text-center py-20 text-secondary bg-[#100d25] rounded-xl border border-[#232323]">
                                    <div className="w-20 h-20 bg-[#151030] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#232323]">
                                        <svg className="w-10 h-10 text-[#00cea8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2h-6a2 2 0 01-2-2z" /></svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Detailed Analytics</h2>
                                    <p className="max-w-md mx-auto">Connect Google Analytics or similar service to view detailed traffic reports and user behavior.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
