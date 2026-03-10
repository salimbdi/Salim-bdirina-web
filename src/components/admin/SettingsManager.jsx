import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

const SettingsManager = () => {
    const [settings, setSettings] = useState({
        resume_url: "",
        linkedin_url: "",
        github_url: "",
        instagram_url: "",
        facebook_url: "",
        telegram_url: "",
        email: "",
    });
    const [cvFile, setCvFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            const { data, error } = await supabase
                .from("site_settings")
                .select("key, value");
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
        // Optional: could subscribe to real-time changes if enabled
    }, []);

    const upsertSetting = async (key, value) => {
        const { error } = await supabase.from("site_settings").upsert(
            { key, value },
            { onConflict: "key" }
        );
        if (error) throw error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);

            // Handle CV upload to Supabase Storage if a new file is chosen
            if (cvFile) {
                const ext = cvFile.name.split(".").pop();
                const path = `cv/${Date.now()}.${ext}`;
                const { error: uploadError } = await supabase.storage
                    .from("assets")
                    .upload(path, cvFile, { upsert: true });
                if (uploadError) throw uploadError;

                const { data: publicData } = supabase.storage
                    .from("assets")
                    .getPublicUrl(path);
                const publicUrl = publicData?.publicUrl;
                if (publicUrl) {
                    settings.resume_url = publicUrl;
                }
            }

            const entries = Object.entries(settings);
            for (const [key, value] of entries) {
                await upsertSetting(key, value);
            }

            setIsSaving(false);
            setCvFile(null);
            alert("Settings saved to Supabase.");
        } catch (err) {
            console.error(err);
            setIsSaving(false);
            alert(err.message || "Failed to save settings to Supabase.");
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">General Settings</h2>
                <div className="text-sm text-secondary">Manage site-wide links & information</div>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#100d25] p-8 rounded-xl border border-[#232323] space-y-6">

                {/* Resume Section */}
                <div className="space-y-4 pb-6 border-b border-[#232323]">
                    <h3 className="text-lg font-semibold text-[#00cea8]">Resume / CV</h3>
                    <div>
                        <label className="block text-secondary text-sm mb-2">Current CV URL (stored in Supabase)</label>
                        <input
                            type="text"
                            name="resume_url"
                            value={settings.resume_url || ""}
                            onChange={handleChange}
                            placeholder="Supabase public URL of your CV"
                            className="w-full bg-[#151030] text-white px-4 py-3 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">This is automatically set when you upload a file below, but you can also paste a Supabase public URL directly.</p>

                        <div className="mt-4">
                            <label className="block text-secondary text-sm mb-2">Upload / Replace CV (PDF)</label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                className="w-full text-sm text-secondary file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00cea8]/10 file:text-[#00cea8] hover:file:bg-[#00cea8]/20"
                            />
                            <p className="text-xs text-gray-500 mt-1">File will be uploaded to Supabase Storage bucket (e.g. <code>assets/cv</code>) and linked here.</p>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="space-y-4 pb-6 border-b border-[#232323]">
                    <h3 className="text-lg font-semibold text-[#00cea8]">Social Connectivity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-secondary text-sm mb-2">LinkedIn URL</label>
                            <input
                                type="url"
                                name="linkedin_url"
                                value={settings.linkedin_url || ""}
                                onChange={handleChange}
                                className="w-full bg-[#151030] text-white px-4 py-3 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-secondary text-sm mb-2">GitHub URL</label>
                            <input
                                type="url"
                                name="github_url"
                                value={settings.github_url || ""}
                                onChange={handleChange}
                                className="w-full bg-[#151030] text-white px-4 py-3 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-secondary text-sm mb-2">Instagram URL</label>
                            <input
                                type="url"
                                name="instagram_url"
                                value={settings.instagram_url || ""}
                                onChange={handleChange}
                                className="w-full bg-[#151030] text-white px-4 py-3 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-secondary text-sm mb-2">Facebook URL</label>
                            <input
                                type="url"
                                name="facebook_url"
                                value={settings.facebook_url || ""}
                                onChange={handleChange}
                                className="w-full bg-[#151030] text-white px-4 py-3 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#00cea8]">Contact Information</h3>
                    <div>
                        <label className="block text-secondary text-sm mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                                value={settings.email || ""}
                            onChange={handleChange}
                            className="w-full bg-[#151030] text-white px-4 py-3 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold text-[#050816] transition-all transform active:scale-95 ${isSaving ? "bg-gray-500 cursor-not-allowed" : "bg-[#00cea8] hover:bg-[#00b894] hover:shadow-lg hover:shadow-[#00cea8]/20"
                            }`}
                    >
                        {isSaving ? "Saving Changes..." : "Save Settings"}
                    </button>
                    {isSaving && <p className="text-green-500 text-sm mt-2 font-medium">Settings updated successfully!</p>}
                </div>
            </form>
        </div>
    );
};

export default SettingsManager;
