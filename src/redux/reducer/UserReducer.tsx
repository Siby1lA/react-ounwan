const init = {
  currentUser: null,
  isLoading: true,
};
export default function (state = init, action: any) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        currentUser: action.data,
        isLoading: false,
      };
    case "CLEAR_USER":
      return {
        ...state,
        currentUser: null,
        isLoading: false,
      };
    default:
      return state;
  }
}
