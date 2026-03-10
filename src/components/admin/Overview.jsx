import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, change, icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-[#100d25] p-6 rounded-2xl border border-[#232323] relative overflow-hidden group"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${color} opacity-10 group-hover:scale-150 transition-transform duration-500`} />

    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
        {icon}
      </div>
      {change && (
        <span className={`text-sm font-medium ${change.startsWith("+") ? "text-[#00cea8]" : "text-red-500"} bg-[#151030] px-2 py-1 rounded-md`}>
          {change}
        </span>
      )}
    </div>

    <h3 className="text-secondary text-sm font-medium tracking-wide uppercase mb-1">{title}</h3>
    <p className="text-white text-3xl font-bold">{value}</p>
  </motion.div>
);

const Overview = () => {
  const [stats, setStats] = React.useState({
    views: 0,
    projects: 0
  });

  React.useEffect(() => {
    const calculateStats = () => {
      const stored = localStorage.getItem("portfolio_projects");
      if (stored) {
        const projects = JSON.parse(stored);
        const totalViews = projects.reduce((acc, curr) => acc + (curr.views || 0), 0);
        const activeProjects = projects.filter(p => p.status === "Published").length;
        setStats({ views: totalViews, projects: activeProjects });
      }
    };

    calculateStats();
    // Listen for updates
    window.addEventListener('portfolio_projects_updated', calculateStats);
    return () => window.removeEventListener('portfolio_projects_updated', calculateStats);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-secondary mt-1">Welcome back, Salim! Here's what's happening today.</p>
        </div>
        <button className="bg-[#151030] hover:bg-[#1f1b3a] text-white px-4 py-2 rounded-lg border border-[#232323] transition-colors text-sm">
          Last 30 Days ▼
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Views"
          value={stats.views.toLocaleString()}
          change="+15%"
          color="bg-blue-500"
          icon={<svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
        />
        <StatCard
          title="Active Projects"
          value={stats.projects}
          change="+2"
          color="bg-[#00cea8]"
          icon={<svg className="w-6 h-6 text-[#00cea8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
        />
        <StatCard
          title="New Messages"
          value="24"
          change="+5%"
          color="bg-purple-500"
          icon={<svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          title="Avg. Visit"
          value="4m 32s"
          change="-2%"
          color="bg-orange-500"
          icon={<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#100d25] p-6 rounded-2xl border border-[#232323]">
          <h3 className="text-white text-lg font-bold mb-6">Traffic Analysis</h3>
          <div className="h-64 bg-[#151030]/50 rounded-xl flex items-center justify-center border border-[#232323] border-dashed">
            <span className="text-secondary">Chart Visualization Placeholder</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#100d25] p-6 rounded-2xl border border-[#232323]">
          <h3 className="text-white text-lg font-bold mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full bg-[#151030] hover:bg-[#1f1b3a] p-4 rounded-xl flex items-center gap-4 transition-all group border border-[#232323] hover:border-[#00cea8]">
              <div className="w-10 h-10 rounded-full bg-[#00cea8]/10 flex items-center justify-center text-[#00cea8]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <div className="text-left">
                <h4 className="text-white font-medium group-hover:text-[#00cea8] transition-colors">Add Project</h4>
                <p className="text-secondary text-xs">Create a new portfolio item</p>
              </div>
            </button>

            <button className="w-full bg-[#151030] hover:bg-[#1f1b3a] p-4 rounded-xl flex items-center gap-4 transition-all group border border-[#232323] hover:border-[#00cea8]">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <div className="text-left">
                <h4 className="text-white font-medium group-hover:text-purple-500 transition-colors">Edit Content</h4>
                <p className="text-secondary text-xs">Update your bio or skills</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
