const init = {
  isDropOpen: false,
  isDarkMode: null,
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

    default:
      return state;
  }
}
