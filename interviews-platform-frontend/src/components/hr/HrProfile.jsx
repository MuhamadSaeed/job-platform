export default function HrProfile({ profile }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#0F172A]">
            HR Profile
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your professional information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileItem
            label="Job Title"
            value={profile.job_title}
          />

          <ProfileItem
            label="Experience"
            value={`${profile.experience_years} Years`}
          />

          <ProfileItem
            label="Current Company"
            value={profile.current_company}
          />

          <ProfileItem
            label="LinkedIn"
            value={profile.linkedin_url}
          />

          <div className="md:col-span-2">
            <ProfileItem
              label="CV"
              value={profile.cv_path}
            />
          </div>

          <div className="md:col-span-2">
            <ProfileItem
              label="Bio"
              value={profile.bio}
            />
          </div>
        </div>

        <button
          className="mt-10 w-full bg-[#2563EB] hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500 mb-2">
        {label}
      </p>

      <div className="border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 text-[#0F172A] break-words">
        {value || "-"}
      </div>
    </div>
  );
}