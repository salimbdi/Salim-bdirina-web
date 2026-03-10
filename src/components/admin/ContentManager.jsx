import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Simple helper to map Supabase errors
const notifyError = (error) => {
  console.error(error);
  alert(error.message || "Something went wrong with Supabase.");
};

const ContentManager = () => {
  // About intro / bio text (stored in `site_settings` table with key = 'about_intro')
  const [aboutIntro, setAboutIntro] = useState("");
  const [isSavingIntro, setIsSavingIntro] = useState(false);

  // Work experiences
  const [experiences, setExperiences] = useState([]);
  const [experienceForm, setExperienceForm] = useState({
    id: null,
    role: "",
    company: "",
    company_link: "",
    date_range: "",
    description: "",
    tags: "",
    has_attestation: false,
  });
  const [isSavingExperience, setIsSavingExperience] = useState(false);
  const [attachmentUploadingId, setAttachmentUploadingId] = useState(null);
  const [attachmentFile, setAttachmentFile] = useState(null);

  // Education
  const [educations, setEducations] = useState([]);
  const [educationForm, setEducationForm] = useState({
    id: null,
    degree: "",
    school: "",
    school_link: "",
    date_range: "",
  });
  const [isSavingEducation, setIsSavingEducation] = useState(false);

  // Certifications
  const [certifications, setCertifications] = useState([]);
  const [certForm, setCertForm] = useState({
    id: null,
    name: "",
    issuer: "",
    year: "",
    color: "bg-blue-500",
    file_url: "",
  });
  const [certFile, setCertFile] = useState(null);
  const [isSavingCert, setIsSavingCert] = useState(false);

  useEffect(() => {
    loadIntro();
    loadExperiences();
    loadEducations();
    loadCertifications();
  }, []);

  const loadIntro = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "about_intro")
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      // ignore "not found" style error
      console.error(error);
      return;
    }
    if (data?.value) {
      setAboutIntro(data.value);
    }
  };

  const handleSaveIntro = async (e) => {
    e.preventDefault();
    setIsSavingIntro(true);
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "about_intro",
        value: aboutIntro,
      },
      { onConflict: "key" }
    );
    setIsSavingIntro(false);
    if (error) return notifyError(error);
    alert("About intro updated.");
  };

  const loadExperiences = async () => {
    const [{ data, error }, { data: files, error: filesError }] =
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
    if (error) return notifyError(error);
    if (filesError) console.error(filesError);
    const byExperience =
      (files || []).reduce((acc, file) => {
        const key = file.experience_id;
        if (!acc[key]) acc[key] = [];
        acc[key].push(file);
        return acc;
      }, {}) || {};
    const merged =
      (data || []).map((exp) => ({
        ...exp,
        attachments: byExperience[exp.id] || [],
      })) || [];
    setExperiences(merged);
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    setIsSavingExperience(true);
    const payload = {
      role: experienceForm.role,
      company: experienceForm.company,
      company_link: experienceForm.company_link,
      date_range: experienceForm.date_range,
      description: experienceForm.description,
      tags: experienceForm.tags,
      has_attestation: experienceForm.has_attestation,
    };
    let error;
    if (experienceForm.id) {
      ({ error } = await supabase
        .from("work_experiences")
        .update(payload)
        .eq("id", experienceForm.id));
    } else {
      ({ error } = await supabase.from("work_experiences").insert(payload));
    }
    setIsSavingExperience(false);
    if (error) return notifyError(error);
    setExperienceForm({
      id: null,
      role: "",
      company: "",
      company_link: "",
      date_range: "",
      description: "",
      tags: "",
      has_attestation: false,
    });
    loadExperiences();
  };

  const handleExperienceEdit = (exp) => {
    setExperienceForm({
      id: exp.id,
      role: exp.role || "",
      company: exp.company || "",
      company_link: exp.company_link || "",
      date_range: exp.date_range || "",
      description: exp.description || "",
      tags: exp.tags || "",
      has_attestation: !!exp.has_attestation,
    });
  };

  const handleExperienceDelete = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    const { error } = await supabase
      .from("work_experiences")
      .delete()
      .eq("id", id);
    if (error) return notifyError(error);
    loadExperiences();
  };

  const handleAttachmentUpload = async (experienceId) => {
    if (!attachmentFile) {
      alert("Please choose a file to upload.");
      return;
    }
    try {
      setAttachmentUploadingId(experienceId);
      const ext = attachmentFile.name.split(".").pop();
      const path = `work_experiences/${experienceId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("assets")
        .upload(path, attachmentFile, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage
        .from("assets")
        .getPublicUrl(path);
      const publicUrl = publicData?.publicUrl;
      if (!publicUrl) throw new Error("Failed to get public URL for file.");

      const { error: insertError } = await supabase
        .from("work_experience_files")
        .insert({
          experience_id: experienceId,
          file_name: attachmentFile.name,
          file_url: publicUrl,
        });
      if (insertError) throw insertError;
      setAttachmentFile(null);
      setAttachmentUploadingId(null);
      await loadExperiences();
    } catch (err) {
      console.error(err);
      setAttachmentUploadingId(null);
      alert(err.message || "Failed to upload attachment.");
    }
  };

  const handleAttachmentDelete = async (fileId) => {
    if (!window.confirm("Delete this attachment?")) return;
    const { error } = await supabase
      .from("work_experience_files")
      .delete()
      .eq("id", fileId);
    if (error) return notifyError(error);
    loadExperiences();
  };

  const loadEducations = async () => {
    const { data, error } = await supabase
      .from("educations")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) return notifyError(error);
    setEducations(data || []);
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    setIsSavingEducation(true);
    const payload = {
      degree: educationForm.degree,
      school: educationForm.school,
      school_link: educationForm.school_link,
      date_range: educationForm.date_range,
    };
    let error;
    if (educationForm.id) {
      ({ error } = await supabase
        .from("educations")
        .update(payload)
        .eq("id", educationForm.id));
    } else {
      ({ error } = await supabase.from("educations").insert(payload));
    }
    setIsSavingEducation(false);
    if (error) return notifyError(error);
    setEducationForm({
      id: null,
      degree: "",
      school: "",
      school_link: "",
      date_range: "",
    });
    loadEducations();
  };

  const handleEducationEdit = (edu) => {
    setEducationForm({
      id: edu.id,
      degree: edu.degree || "",
      school: edu.school || "",
      school_link: edu.school_link || "",
      date_range: edu.date_range || "",
    });
  };

  const handleEducationDelete = async (id) => {
    if (!window.confirm("Delete this education?")) return;
    const { error } = await supabase.from("educations").delete().eq("id", id);
    if (error) return notifyError(error);
    loadEducations();
  };

  const loadCertifications = async () => {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("year", { ascending: false });
    if (error) return notifyError(error);
    setCertifications(data || []);
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setIsSavingCert(true);

    let fileUrl = certForm.file_url;
    if (certFile) {
      const fileExt = certFile.name.split(".").pop();
      const filePath = `certifications/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("assets")
        .upload(filePath, certFile, { upsert: true });
      if (uploadError) {
        setIsSavingCert(false);
        return notifyError(uploadError);
      }
      const { data: publicData } = supabase.storage
        .from("assets")
        .getPublicUrl(filePath);
      fileUrl = publicData?.publicUrl || "";
    }

    const payload = {
      name: certForm.name,
      issuer: certForm.issuer,
      year: certForm.year,
      color: certForm.color,
      file_url: fileUrl,
    };

    let error;
    if (certForm.id) {
      ({ error } = await supabase
        .from("certifications")
        .update(payload)
        .eq("id", certForm.id));
    } else {
      ({ error } = await supabase.from("certifications").insert(payload));
    }
    setIsSavingCert(false);
    if (error) return notifyError(error);
    setCertForm({
      id: null,
      name: "",
      issuer: "",
      year: "",
      color: "bg-blue-500",
      file_url: "",
    });
    setCertFile(null);
    loadCertifications();
  };

  const handleCertEdit = (cert) => {
    setCertForm({
      id: cert.id,
      name: cert.name || "",
      issuer: cert.issuer || "",
      year: cert.year || "",
      color: cert.color || "bg-blue-500",
      file_url: cert.file_url || "",
    });
    setCertFile(null);
  };

  const handleCertDelete = async (id) => {
    if (!window.confirm("Delete this certification?")) return;
    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", id);
    if (error) return notifyError(error);
    loadCertifications();
  };

  return (
    <div className="space-y-8">
      {/* About Intro */}
      <section className="bg-[#100d25] p-6 rounded-xl border border-[#232323] space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            About Page Intro Text
          </h2>
          <span className="text-xs text-secondary">
            This controls the main bio paragraph.
          </span>
        </div>
        <form onSubmit={handleSaveIntro} className="space-y-3">
          <textarea
            value={aboutIntro}
            onChange={(e) => setAboutIntro(e.target.value)}
            rows={4}
            className="w-full bg-[#151030] text-white px-4 py-3 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            placeholder="Write your about/bio text here..."
          />
          <button
            type="submit"
            disabled={isSavingIntro}
            className={`px-6 py-2 rounded-lg font-bold text-[#050816] ${
              isSavingIntro
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#00cea8] hover:bg-[#00b894]"
            }`}
          >
            {isSavingIntro ? "Saving..." : "Save Intro"}
          </button>
        </form>
      </section>

      {/* Work Experiences */}
      <section className="bg-[#100d25] p-6 rounded-xl border border-[#232323] space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Work Experiences</h2>
        </div>

        <form
          onSubmit={handleExperienceSubmit}
          className="space-y-4 border-b border-[#232323] pb-4 mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Role / Title"
              value={experienceForm.role}
              onChange={(e) =>
                setExperienceForm((p) => ({ ...p, role: e.target.value }))
              }
              required
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <input
              type="text"
              placeholder="Company"
              value={experienceForm.company}
              onChange={(e) =>
                setExperienceForm((p) => ({ ...p, company: e.target.value }))
              }
              required
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <input
              type="url"
              placeholder="Company Link"
              value={experienceForm.company_link}
              onChange={(e) =>
                setExperienceForm((p) => ({
                  ...p,
                  company_link: e.target.value,
                }))
              }
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <input
              type="text"
              placeholder="Date Range (e.g. 2024 - Present)"
              value={experienceForm.date_range}
              onChange={(e) =>
                setExperienceForm((p) => ({
                  ...p,
                  date_range: e.target.value,
                }))
              }
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
          </div>
          <textarea
            placeholder="Description"
            value={experienceForm.description}
            onChange={(e) =>
              setExperienceForm((p) => ({ ...p, description: e.target.value }))
            }
            rows={3}
            className="w-full bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
          />
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={experienceForm.tags}
              onChange={(e) =>
                setExperienceForm((p) => ({ ...p, tags: e.target.value }))
              }
              className="flex-1 bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <label className="flex items-center gap-2 text-secondary text-sm">
              <input
                type="checkbox"
                checked={experienceForm.has_attestation}
                onChange={(e) =>
                  setExperienceForm((p) => ({
                    ...p,
                    has_attestation: e.target.checked,
                  }))
                }
              />
              Has attestation file uploaded in storage
            </label>
          </div>
          <button
            type="submit"
            disabled={isSavingExperience}
            className={`px-6 py-2 rounded-lg font-bold text-[#050816] ${
              isSavingExperience
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#00cea8] hover:bg-[#00b894]"
            }`}
          >
            {experienceForm.id ? "Update Experience" : "Add Experience"}
          </button>
        </form>

        <div className="space-y-2">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="border border-[#232323] rounded-lg px-4 py-3 space-y-3"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-white font-semibold">{exp.role}</span>
                    <span className="text-secondary text-sm">
                      @ {exp.company}
                    </span>
                    {exp.date_range && (
                      <span className="text-xs text-[#00cea8] bg-[#00cea8]/10 px-2 py-0.5 rounded-full border border-[#00cea8]/30">
                        {exp.date_range}
                      </span>
                    )}
                  </div>
                  <p className="text-secondary text-sm mt-1">
                    {exp.description}
                  </p>
                  {exp.tags && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      Tags: {exp.tags}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  {exp.has_attestation && (
                    <span className="text-[#00cea8]">Has attestation</span>
                  )}
                  <button
                    onClick={() => handleExperienceEdit(exp)}
                    className="text-[#00cea8] hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleExperienceDelete(exp.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Attachments list and upload */}
              <div className="border-t border-[#232323] pt-3 mt-2 space-y-2">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <p className="text-xs text-secondary font-semibold uppercase tracking-wide">
                    Attachments
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      type="file"
                      onChange={(e) =>
                        setAttachmentFile(e.target.files?.[0] || null)
                      }
                      className="text-xs text-secondary file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#00cea8]/10 file:text-[#00cea8] hover:file:bg-[#00cea8]/20"
                    />
                    <button
                      type="button"
                      disabled={
                        attachmentUploadingId === exp.id || !attachmentFile
                      }
                      onClick={() => handleAttachmentUpload(exp.id)}
                      className="text-xs bg-[#00cea8] disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-[#00b894] text-[#050816] px-3 py-1 rounded-lg font-semibold"
                    >
                      {attachmentUploadingId === exp.id
                        ? "Uploading..."
                        : "Upload File"}
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exp.attachments && exp.attachments.length > 0 ? (
                    exp.attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-2 bg-[#151030] border border-[#232323] rounded-full px-3 py-1 text-[11px] text-secondary"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            window.open(file.file_url, "_blank")
                          }
                          className="hover:text-white underline"
                        >
                          {file.file_name || "Attachment"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAttachmentDelete(file.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-500">
                      No attachments yet for this experience.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {experiences.length === 0 && (
            <p className="text-secondary text-sm">
              No work experiences yet. Use the form above to add one.
            </p>
          )}
        </div>
      </section>

      {/* Education */}
      <section className="bg-[#100d25] p-6 rounded-xl border border-[#232323] space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Education</h2>
        </div>

        <form
          onSubmit={handleEducationSubmit}
          className="space-y-4 border-b border-[#232323] pb-4 mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Degree"
              value={educationForm.degree}
              onChange={(e) =>
                setEducationForm((p) => ({ ...p, degree: e.target.value }))
              }
              required
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <input
              type="text"
              placeholder="School"
              value={educationForm.school}
              onChange={(e) =>
                setEducationForm((p) => ({ ...p, school: e.target.value }))
              }
              required
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <input
              type="url"
              placeholder="School Link"
              value={educationForm.school_link}
              onChange={(e) =>
                setEducationForm((p) => ({
                  ...p,
                  school_link: e.target.value,
                }))
              }
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <input
              type="text"
              placeholder="Date Range"
              value={educationForm.date_range}
              onChange={(e) =>
                setEducationForm((p) => ({
                  ...p,
                  date_range: e.target.value,
                }))
              }
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSavingEducation}
            className={`px-6 py-2 rounded-lg font-bold text-[#050816] ${
              isSavingEducation
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#00cea8] hover:bg-[#00b894]"
            }`}
          >
            {educationForm.id ? "Update Education" : "Add Education"}
          </button>
        </form>

        <div className="space-y-2">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="flex justify-between items-start gap-4 border border-[#232323] rounded-lg px-4 py-3"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white font-semibold">
                    {edu.degree}
                  </span>
                  <span className="text-secondary text-sm">{edu.school}</span>
                  {edu.date_range && (
                    <span className="text-xs text-[#00cea8] bg-[#00cea8]/10 px-2 py-0.5 rounded-full border border-[#00cea8]/30">
                      {edu.date_range}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <button
                  onClick={() => handleEducationEdit(edu)}
                  className="text-[#00cea8] hover:text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleEducationDelete(edu.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {educations.length === 0 && (
            <p className="text-secondary text-sm">
              No education items yet. Use the form above to add one.
            </p>
          )}
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-[#100d25] p-6 rounded-xl border border-[#232323] space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Certifications</h2>
          <span className="text-xs text-secondary">
            Files are stored in Supabase Storage.
          </span>
        </div>

        <form
          onSubmit={handleCertSubmit}
          className="space-y-4 border-b border-[#232323] pb-4 mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Certification Name"
              value={certForm.name}
              onChange={(e) =>
                setCertForm((p) => ({ ...p, name: e.target.value }))
              }
              required
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <input
              type="text"
              placeholder="Issuer"
              value={certForm.issuer}
              onChange={(e) =>
                setCertForm((p) => ({ ...p, issuer: e.target.value }))
              }
              required
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <input
              type="text"
              placeholder="Year"
              value={certForm.year}
              onChange={(e) =>
                setCertForm((p) => ({ ...p, year: e.target.value }))
              }
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <select
              value={certForm.color}
              onChange={(e) =>
                setCertForm((p) => ({ ...p, color: e.target.value }))
              }
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            >
              <option value="bg-blue-500">Blue</option>
              <option value="bg-green-500">Green</option>
              <option value="bg-purple-500">Purple</option>
              <option value="bg-orange-500">Orange</option>
              <option value="bg-gray-500">Gray</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-secondary text-sm mb-1">
                Upload Certification File
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-secondary file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00cea8]/10 file:text-[#00cea8] hover:file:bg-[#00cea8]/20"
              />
            </div>
            <div>
              <label className="block text-secondary text-sm mb-1">
                Existing File URL (optional, will be replaced if you upload a
                new file)
              </label>
              <input
                type="url"
                value={certForm.file_url}
                onChange={(e) =>
                  setCertForm((p) => ({ ...p, file_url: e.target.value }))
                }
                placeholder="https://..."
                className="w-full bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSavingCert}
            className={`px-6 py-2 rounded-lg font-bold text-[#050816] ${
              isSavingCert
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#00cea8] hover:bg-[#00b894]"
            }`}
          >
            {certForm.id ? "Update Certification" : "Add Certification"}
          </button>
        </form>

        <div className="space-y-2">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex justify-between items-center gap-4 border border-[#232323] rounded-lg px-4 py-3"
            >
              <div>
                <p className="text-white font-semibold">{cert.name}</p>
                <p className="text-secondary text-sm">
                  {cert.issuer} {cert.year && <>• {cert.year}</>}
                </p>
                {cert.file_url && (
                  <a
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00cea8] text-xs underline"
                  >
                    View file
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <button
                  onClick={() => handleCertEdit(cert)}
                  className="text-[#00cea8] hover:text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleCertDelete(cert.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {certifications.length === 0 && (
            <p className="text-secondary text-sm">
              No certifications yet. Use the form above to add one.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ContentManager;


