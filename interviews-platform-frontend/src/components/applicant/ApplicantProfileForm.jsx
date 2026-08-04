"use client";

import { useState, useEffect } from "react";
import {
  getApplicantProfile,
  updateApplicantProfile,
  getImageUrl,
} from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function ApplicantProfileForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    is_student: true,
    university: "",
    education: "",
    graduation_year: "",
    skills: "",
    experience: "",
    bio: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  });

  const [files, setFiles] = useState({
    profile_picture: null,
    cv_file: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const data = await getApplicantProfile();
        if (data) {
          setFormData({
            is_student: data.is_student ?? true,
            university: data.university || "",
            education: data.education || "",
            graduation_year: data.graduation_year ?? "",
            skills: data.skills || "",
            experience: data.experience || "",
            bio: data.bio || "",
            linkedin_url: data.linkedin_url || "",
            github_url: data.github_url || "",
            portfolio_url: data.portfolio_url || "",
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
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

    try {
      const payload = {
        ...formData,
        graduation_year: formData.graduation_year
          ? Number(formData.graduation_year)
          : null,
        ...(files.profile_picture && {
          profile_picture: files.profile_picture,
        }),
        ...(files.cv_file && { cv_file: files.cv_file }),
      };

      await updateApplicantProfile(payload);

      alert("Profile Updated Successfully");
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          Loading profile data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
        <div className="mb-8 pb-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Complete Applicant Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Provide your educational and professional background details.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Applicant Profile"
                  onError={() => setImagePreview(null)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-400 font-semibold text-xs text-center px-2">
                  No Photo
                </span>
              )}
            </div>

            <div className="space-y-1.5 w-full sm:w-auto">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Profile Picture
              </label>
              <input
                type="file"
                name="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-[#0B132B] hover:file:bg-slate-200 cursor-pointer"
              />
            </div>
          </div>

          {/* Student Checkbox */}
          <div className="flex items-center gap-3 py-1">
            <input
              type="checkbox"
              id="is_student"
              name="is_student"
              checked={formData.is_student}
              onChange={handleChange}
              className="w-4 h-4 accent-[#0B132B] cursor-pointer rounded"
            />
            <label
              htmlFor="is_student"
              className="text-sm font-semibold text-slate-700 cursor-pointer select-none"
            >
              I am currently a student
            </label>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="University"
              name="university"
              placeholder="e.g. Cairo University"
              value={formData.university}
              onChange={handleChange}
            />

            <Input
              label="Education / Major"
              name="education"
              placeholder="e.g. Computer Science"
              value={formData.education}
              onChange={handleChange}
            />

            <Input
              label="Graduation Year"
              type="number"
              name="graduation_year"
              placeholder="2026"
              value={formData.graduation_year}
              onChange={handleChange}
            />

            <Input
              label="Skills"
              name="skills"
              placeholder="e.g. React, Next.js, Node.js"
              value={formData.skills}
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
              label="GitHub URL"
              name="github_url"
              placeholder="https://github.com/username"
              value={formData.github_url}
              onChange={handleChange}
            />

            <Input
              label="Portfolio URL"
              name="portfolio_url"
              placeholder="https://portfolio.com"
              value={formData.portfolio_url}
              onChange={handleChange}
            />

            <Input
              label="Experience / Work"
              name="experience"
              placeholder="e.g. Frontend Intern at XYZ"
              value={formData.experience}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                CV Document (.PDF)
              </label>
              <input
                type="file"
                name="cv_file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-[#0B132B] hover:file:bg-slate-200 cursor-pointer"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bio
              </label>
              <textarea
                rows={4}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a brief introduction about yourself..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B] transition text-sm bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold py-3 px-6 rounded-xl transition duration-200 cursor-pointer text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
      <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <input
        type={type}
        {...props}
        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B] transition text-sm bg-white"
      />
    </div>
  );
}