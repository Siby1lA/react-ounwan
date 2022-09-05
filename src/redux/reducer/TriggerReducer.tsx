const init = {
  isDropOpen: false,
};
export default function (state = init, action: any) {
  switch (action.type) {
    case "SET_DROPDOWN_OPEN":
      return {
        ...state,
        isDropOpen: action.data,
      };
    default:
      return state;
  }
}
