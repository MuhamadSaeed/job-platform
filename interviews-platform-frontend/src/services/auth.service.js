import request from "@/lib/api";

export async function registerUser(userData) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser({ email, password }) {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  return request("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
    },
    body: formData,
  });
}

export async function getCurrentUser() {
  return request("/users/me");
}

export async function getHrProfile() {
  return request("/hr/profile");
}

export async function getApplicantProfile() {
  return request("/applicant/profile");
}

export async function updateHrProfile(profileData) {
  return request("/hr/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}