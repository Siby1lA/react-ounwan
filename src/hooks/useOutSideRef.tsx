import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setDropDownOpen } from "../redux/actions/TriggerAction";

function useOutSideRef() {
  const dispatch = useDispatch();
  const ref = useRef<any>(null);
  useEffect(() => {
    function handleClickOutside(event: any) {
      // 현재 document에서 mousedown 이벤트가 동작하면 호출되는 함수입니다.
      if (ref.current && !ref.current.contains(event.target)) {
        dispatch(setDropDownOpen(false));
      }
    }
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  return ref;
}
export default useOutSideRef;
