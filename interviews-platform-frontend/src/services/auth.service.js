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
      "Content-Type": "application/x-www-form-urlencoded",
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

// Added updateApplicantProfile export function
export async function updateApplicantProfile(profileData) {
  const formData = new FormData();

  Object.entries(profileData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  return request("/applicant/profile", {
    method: "PUT",
    body: formData,
  });
}

export async function updateHrProfile(profileData) {
  const formData = new FormData();

  Object.entries(profileData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  return request("/hr/profile", {
    method: "PUT",
    body: formData,
  });
}

export async function getHrSlots() {
  return request("/hr/slots");
}

export async function createHrSlot(slotData) {
  return request("/hr/slots", {
    method: "POST",
    body: JSON.stringify(slotData),
  });
}

export async function deleteHrSlot(slotId) {
  return request(`/hr/slots/${slotId}`, {
    method: "DELETE",
  });
}

export async function getAllHrs(name = "", specialty = "") {
  const params = new URLSearchParams();

  if (name) {
    params.append("name", name);
  }

  if (specialty) {
    params.append("specialty", specialty);
  }

  const query = params.toString();

  return request(`/applicant/hrs${query ? `?${query}` : ""}`);
}

export async function getHrDetails(id) {
  return request(`/applicant/hrs/${id}`);
}

export async function lockInterviewSlot(slotId) {
  return request(`/applicant/slots/${slotId}/lock`, {
    method: "POST",
  });
}

export async function confirmPayment(slotId) {
  return request(`/applicant/slots/${slotId}/confirm-payment`, {
    method: "POST",
  });
}

export async function getApplicantNotifications() {
  return request("/applicant/my-notifications");
}

export async function getHrSchedule() {
  return request("/hr/my-schedule");
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
};