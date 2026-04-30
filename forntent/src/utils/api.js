export const API_BASE = "http://localhost:5000/api";

/* ── Token helpers ── */
export const getToken = () => localStorage.getItem("cc_token");

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("cc_user") || "null");
  } catch {
    return null;
  }
};

// ✅ token aur user dono store karo
export const setSession = (token, user) => {
  localStorage.setItem("cc_token", token);
  localStorage.setItem("cc_user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("cc_token");
  localStorage.removeItem("cc_user");
};

// ✅ role check
export const isOrganizer = () => getUser()?.role === "organizer";
export const isStudent   = () => getUser()?.role === "student";

/* ── Public API Fetch ── */
export const apiFetch = async (path, opts = {}) => {
  const res = await fetch(API_BASE + path, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  return res;
};

/* ── Protected API Fetch ── */
export const authFetch = async (path, opts = {}) => {
  const res = await fetch(API_BASE + path, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(opts.headers || {}),
    },
  });
  return res;
};

/* ── Date Formatter ── */
export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });