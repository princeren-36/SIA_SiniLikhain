export function getCurrentUser() {
  let user = localStorage.getItem("user");
  if (!user) user = sessionStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}
