import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
    loadProjects();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from("project_categories")
      .select("*")
      .order("name", { ascending: true });
    if (error) {
      console.error(error);
      alert(error.message || "Failed to load project categories.");
      return;
    }
    setCategories(data || []);
  };

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_categories(id, name)")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      alert(error.message || "Failed to load projects from Supabase.");
      return;
    }
    const mapped =
      data?.map((p) => ({
        ...p,
        category_name: p.project_categories?.name || "",
      })) || [];
    setProjects(mapped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.target);

    const tagsString = formData.get("tags") || "";
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((t) => t.length > 0);

    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      // If we have a new image URL from upload, use it, otherwise keep existing
      image: formData.get("image"),
      source_code_link: formData.get("source_code_link"),
      live_demo_link: formData.get("live_demo_link"),
      category_id: formData.get("category_id")
        ? Number(formData.get("category_id"))
        : null,
      status: formData.get("status"),
      tags,
    };

    let error;
    if (editingProject) {
      ({ error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingProject.id));
    } else {
      ({ error } = await supabase.from("projects").insert(payload));
    }
    setIsSaving(false);
    if (error) {
      console.error(error);
      alert(error.message || "Failed to save project.");
      return;
    }

    setIsEditing(false);
    setEditingProject(null);
    e.target.reset();
    loadProjects();
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      console.error(error);
      alert(error.message || "Failed to delete project.");
      return;
    }
    loadProjects();
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    let error;
    if (editingCategory) {
      ({ error } = await supabase
        .from("project_categories")
        .update({ name: categoryName.trim() })
        .eq("id", editingCategory.id));
    } else {
      ({ error } = await supabase
        .from("project_categories")
        .insert({ name: categoryName.trim() }));
    }
    if (error) {
      console.error(error);
      alert(error.message || "Failed to save category.");
      return;
    }
    setCategoryName("");
    setEditingCategory(null);
    loadCategories();
  };

  const handleCategoryEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name || "");
  };

  const handleCategoryDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this category? Projects referencing it will have a null category."
      )
    )
      return;
    const { error } = await supabase
      .from("project_categories")
      .delete()
      .eq("id", id);
    if (error) {
      console.error(error);
      alert(error.message || "Failed to delete category.");
      return;
    }
    loadCategories();
    loadProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Projects Manager</h2>
        <button
          onClick={() => {
            setIsEditing((prev) => !prev);
            setEditingProject(null);
          }}
          className="bg-[#00cea8] hover:bg-[#00b894] text-[#050816] px-4 py-2 rounded-lg font-bold transition-colors"
        >
          {isEditing ? "Cancel" : "+ Add Project"}
        </button>
      </div>

      {/* Category CRUD */}
      <div className="bg-[#100d25] p-4 rounded-xl border border-[#232323] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">Project Categories</h3>
          <form
            onSubmit={handleCategorySubmit}
            className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center"
          >
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name (e.g. Web, Mobile)"
              className="bg-[#151030] text-white px-3 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <button
              type="submit"
              className="bg-[#00cea8] hover:bg-[#00b894] text-[#050816] px-4 py-2 rounded-lg font-bold transition-colors"
            >
              {editingCategory ? "Update Category" : "Add Category"}
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 bg-[#151030] border border-[#232323] rounded-full px-3 py-1 text-xs text-secondary"
            >
              <span>{cat.name}</span>
              <button
                onClick={() => handleCategoryEdit(cat)}
                className="text-[#00cea8] hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleCategoryDelete(cat.id)}
                className="text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-secondary text-xs">
              No categories yet. Create at least one to better organize your
              projects.
            </p>
          )}
        </div>
      </div>

      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#100d25] p-6 rounded-xl border border-[#232323] space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              defaultValue={editingProject?.name || ""}
              required
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <select
              name="category_id"
              defaultValue={editingProject?.category_id || ""}
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="description"
            placeholder="Project Description"
            defaultValue={editingProject?.description || ""}
            required
            rows="3"
            className="w-full bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-secondary text-sm">Project Image</label>
              <input
                type="url"
                name="image"
                placeholder="Image URL"
                defaultValue={editingProject?.image || ""}
                className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setIsUploading(true);
                    try {
                      const fileExt = file.name.split('.').pop();
                      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                      const filePath = `${fileName}`;
                      let { error: uploadError } = await supabase.storage
                        .from('projects')
                        .upload(filePath, file);

                      if (uploadError) {
                        throw uploadError;
                      }

                      const { data } = supabase.storage
                        .from('projects')
                        .getPublicUrl(filePath);

                      if (data?.publicUrl) {
                        // Update the text input value
                        const urlInput = document.querySelector('input[name="image"]');
                        if (urlInput) urlInput.value = data.publicUrl;
                      }
                    } catch (error) {
                      console.error('Error uploading image:', error);
                      alert('Error uploading image. Make sure you have a "projects" bucket with public access.');
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  className="text-secondary text-sm"
                />
                {isUploading && <span className="text-yellow-500 text-xs">Uploading...</span>}
              </div>
            </div>
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma separated)"
              defaultValue={Array.isArray(editingProject?.tags) ? editingProject.tags.join(", ") : ""}
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="url"
              name="source_code_link"
              placeholder="Source Code Link"
              defaultValue={editingProject?.source_code_link || ""}
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <input
              type="url"
              name="live_demo_link"
              placeholder="Live Demo Link"
              defaultValue={editingProject?.live_demo_link || ""}
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
          </div>

          <select
            name="status"
            defaultValue={editingProject?.status || "Published"}
            className="w-full bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
          >
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#00cea8] hover:bg-[#00b894] disabled:bg-gray-600 disabled:cursor-not-allowed text-[#050816] px-4 py-2 rounded-lg font-bold transition-colors"
          >
            {isSaving
              ? "Saving..."
              : editingProject
                ? "Update Project"
                : "Add Project"}
          </button>
        </form>
      )}

      <div className="bg-[#100d25] rounded-xl border border-[#232323] overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#151030] text-secondary text-sm uppercase tracking-wider border-b border-[#232323]">
              <th className="p-4 font-medium">Project Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Views</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-[#232323] hover:bg-[#151030] transition-colors">
                <td className="p-4 text-white font-medium">{project.name}</td>
                <td className="p-4 text-secondary">{project.category_name || "—"}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'Published' ? 'bg-green-500/10 text-green-500' :
                    project.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                    {project.status}
                  </span>
                </td>
                <td className="p-4 text-secondary">{project.views || 0}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-[#00cea8] hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsManager;
