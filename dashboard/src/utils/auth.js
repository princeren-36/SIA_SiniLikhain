// Utility to get the current logged-in user from either localStorage or sessionStorage
export function getCurrentUser() {
  let user = localStorage.getItem("user");
  if (!user) user = sessionStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}
