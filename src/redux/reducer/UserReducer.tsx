const init = {
  currentUser: null,
  isLoading: true,
  type: "",
  boxData: null,
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
    case "SET_TYPE":
      return {
        ...state,
        type: action.data,
      };
    case "SET_BOX":
      return {
        ...state,
        boxData: action.data,
      };
    default:
      return state;
  }
}
