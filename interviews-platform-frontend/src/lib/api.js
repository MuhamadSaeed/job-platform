const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(endpoint, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",

        ...(token && {
          Authorization: `Bearer ${token}`,
        }),

        ...options.headers,
      },

      ...options,
    }
  );

  const data = await response.json();

if (!response.ok) {
  const error = new Error(
    data.detail || "Something went wrong"
  );

  error.status = response.status;

  throw error;
}

  return data;
}

export default request;