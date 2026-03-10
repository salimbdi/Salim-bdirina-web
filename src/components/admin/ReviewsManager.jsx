import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

const ReviewsManager = () => {
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      console.error(error);
      alert(error.message || "Failed to load testimonials from Supabase.");
      return;
    }
    setReviews(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const payload = {
      name: formData.get("name"),
      designation: formData.get("designation"),
      company: formData.get("company"),
      testimonial: formData.get("testimonial"),
      // Optional image URL; if empty, frontend can handle missing image gracefully
      image: formData.get("image") || null,
    };

    let error;
    if (editingReview) {
      ({ error } = await supabase
        .from("testimonials")
        .update(payload)
        .eq("id", editingReview.id));
    } else {
      ({ error } = await supabase.from("testimonials").insert(payload));
    }

    if (error) {
      console.error(error);
      alert(error.message || "Failed to save testimonial to Supabase.");
      return;
    }

    setIsEditing(false);
    setEditingReview(null);
    e.target.reset();
    loadReviews();
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id);
    if (error) {
      console.error(error);
      alert(error.message || "Failed to delete testimonial from Supabase.");
      return;
    }
    loadReviews();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Reviews Manager</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-[#00cea8] hover:bg-[#00b894] text-[#050816] px-4 py-2 rounded-lg font-bold transition-colors"
        >
          {isEditing ? "Cancel" : "+ Add Review"}
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-[#100d25] p-6 rounded-xl border border-[#232323] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Author Name"
              defaultValue={editingReview?.name}
              required
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              defaultValue={editingReview?.designation}
              required
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
            <input
              type="text"
              name="company"
              placeholder="Company"
              defaultValue={editingReview?.company}
              required
              className="bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
            />
          </div>

          <textarea
            name="testimonial"
            placeholder="Testimonial"
            defaultValue={editingReview?.testimonial}
            required
            rows="4"
            className="w-full bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
          />

          <input
            type="url"
            name="image"
            placeholder="Profile Image URL"
            defaultValue={editingReview?.image}
            className="w-full bg-[#151030] text-white px-4 py-2 rounded-lg border border-[#232323] focus:border-[#00cea8] outline-none"
          />

          <button
            type="submit"
            className="w-full bg-[#00cea8] hover:bg-[#00b894] text-[#050816] px-4 py-2 rounded-lg font-bold transition-colors"
          >
            {editingReview ? "Update Review" : "Add Review"}
          </button>
        </form>
      )}

      <div className="bg-[#100d25] rounded-xl border border-[#232323] overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#151030] text-secondary text-sm uppercase tracking-wider border-b border-[#232323]">
              <th className="p-4 font-medium">Author</th>
              <th className="p-4 font-medium">Designation</th>
              <th className="p-4 font-medium">Company</th>
              <th className="p-4 font-medium">Testimonial</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-secondary text-sm"
                >
                  Loading testimonials from Supabase...
                </td>
              </tr>
            )}
            {!loading && reviews.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-secondary text-sm"
                >
                  No testimonials found. Add one using the form above.
                </td>
              </tr>
            )}
            {!loading && reviews.map((review) => (
              <tr key={review.id} className="border-b border-[#232323] hover:bg-[#151030] transition-colors">
                <td className="p-4 text-white font-medium">{review.name}</td>
                <td className="p-4 text-secondary">{review.designation}</td>
                <td className="p-4 text-secondary">{review.company}</td>
                <td className="p-4 text-secondary max-w-xs truncate">{review.testimonial}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-[#00cea8] hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
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

export default ReviewsManager;
