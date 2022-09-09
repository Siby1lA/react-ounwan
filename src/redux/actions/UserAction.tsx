export const setUser = (user: string) => ({
  type: "SET_USER",
  data: user,
});
export const clearUser = () => ({
  type: "SET_USER",
});

export const setType = (type: string | undefined) => ({
  type: "SET_TYPE",
  data: type,
});

export const setBox = (data: any) => ({
  type: "SET_BOX",
  data: data,
});
