"use client";

import { useState } from "react";
import { updateHrProfile } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function HrProfileForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    job_title: "",
    experience_years: "",
    current_company: "",
    linkedin_url: "",
    cv_path: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateHrProfile({
        ...formData,
        experience_years: Number(
          formData.experience_years
        ),
      });

      alert("Profile Updated Successfully");

      router.push("/hr");
    } catch (error) {
      console.log(error);

      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-10">

        <h1 className="text-3xl font-bold mb-8">
          Complete HR Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <Input
            label="Job Title"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
          />

          <Input
            label="Experience Years"
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
          />

          <Input
            label="Current Company"
            name="current_company"
            value={formData.current_company}
            onChange={handleChange}
          />

          <Input
            label="LinkedIn URL"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
          />

          <Input
            label="CV Path"
            name="cv_path"
            value={formData.cv_path}
            onChange={handleChange}
          />

          <div>
            <label className="block mb-2 text-sm font-medium">
              Bio
            </label>

            <textarea
              rows={5}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            Save Profile
          </button>

        </form>

      </div>
    </div>
  );
}

function Input({
  label,
  type = "text",
  ...props
}) {
  return (
    <div>

      <label className="block mb-2 text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        {...props}
        className="w-full border rounded-xl px-4 py-3"
      />

    </div>
  );
}