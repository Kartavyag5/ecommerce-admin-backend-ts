export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  // optionally: clear user info if stored
  window.location.href = "/"; // redirect to login
};