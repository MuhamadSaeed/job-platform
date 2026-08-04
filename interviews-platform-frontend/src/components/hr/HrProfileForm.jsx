"use client";

import { useState, useEffect } from "react";
import { updateHrProfile, getHrProfile, getImageUrl } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function HrProfileForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    job_title: "",
    experience_years: "",
    current_company: "",
    linkedin_url: "",
    skills: "",
    achievements: "",
    bio: "",
  });

  const [files, setFiles] = useState({
    profile_picture: null,
    cv_file: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const data = await getHrProfile();
        if (data) {
          setFormData({
            job_title: data.job_title || "",
            experience_years: data.experience_years ?? "",
            current_company: data.current_company || "",
            linkedin_url: data.linkedin_url || "",
            skills: data.skills || "",
            achievements: data.achievements || "",
            bio: data.bio || "",
          });

          const photo = data.profile_picture_path || data.profile_picture;
          if (photo) {
            setImagePreview(getImageUrl(photo)); 
          }
        }
      } catch (err) {
        if (err.status !== 404) {
          console.error(err);
        }
      } finally {
        setFetching(false);
      }
    }

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];
      setFiles((prev) => ({ ...prev, [name]: file }));

      if (name === "profile_picture") {
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        experience_years: Number(formData.experience_years),
        ...(files.profile_picture && { profile_picture: files.profile_picture }),
        ...(files.cv_file && { cv_file: files.cv_file }),
      };

      await updateHrProfile(payload);

      setSuccess("Profile updated successfully! Redirecting...");
      setTimeout(() => {
        router.push("/profile");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save profile");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 text-sm font-medium">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
        <div className="mb-8 border-b border-slate-100 pb-6">
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Complete HR Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Provide your professional information below to update your profile on Hirely.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  onError={() => setImagePreview(null)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-400 font-semibold text-xs text-center px-2">
                  No Photo
                </span>
              )}
            </div>

            <div className="space-y-2 w-full sm:w-auto">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Profile Picture
              </label>
              <input
                type="file"
                name="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-[#0B132B] hover:file:bg-slate-200 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Job Title *"
              name="job_title"
              placeholder="e.g. Senior Tech Recruiter"
              value={formData.job_title}
              onChange={handleChange}
              required
            />

            <Input
              label="Experience Years *"
              type="number"
              name="experience_years"
              placeholder="e.g. 5"
              value={formData.experience_years}
              onChange={handleChange}
              required
            />

            <Input
              label="Current Company"
              name="current_company"
              placeholder="e.g. Google"
              value={formData.current_company}
              onChange={handleChange}
            />

            <Input
              label="LinkedIn URL"
              name="linkedin_url"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedin_url}
              onChange={handleChange}
            />

            <Input
              label="Skills"
              name="skills"
              placeholder="e.g. Technical Recruiting, Screening"
              value={formData.skills}
              onChange={handleChange}
            />

            <Input
              label="Achievements"
              name="achievements"
              placeholder="e.g. Scaled team from 10 to 50"
              value={formData.achievements}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <label className="block mb-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                CV File
              </label>
              <input
                type="file"
                name="cv_file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-[#0B132B] hover:file:bg-slate-200 cursor-pointer"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Bio
              </label>
              <textarea
                rows={4}
                name="bio"
                placeholder="Tell candidates about your recruiting background..."
                value={formData.bio}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition text-sm bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold py-3.5 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer shadow-sm mt-4"
          >
            {loading ? "Saving Profile..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="block mb-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        {...props}
        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition text-sm bg-white"
      />
    </div>
  );
}