import request from "@/lib/api";

export async function registerUser(userData) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser({
  email,
  password,
}) {
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