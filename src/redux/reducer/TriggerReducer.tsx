const init = {
  isDropOpen: false,
  isDarkMode: window.localStorage.getItem("app_theme") === "true",
  isLoading: 0,
};
export default function (state = init, action: any) {
  switch (action.type) {
    case "SET_DROPDOWN_OPEN":
      return {
        ...state,
        isDropOpen: action.data,
      };
    case "SET_DARK_MODE":
      return {
        ...state,
        isDarkMode: action.data,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.data,
      };
    default:
      return state;
  }
}
