export const setUser = (user: string) => ({
  type: "SET_USER",
  data: user,
});
export const clearUser = () => ({
  type: "SET_USER",
});
