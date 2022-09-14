import styled from "styled-components";
import { PathMatch, useMatch, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useScroll } from "framer-motion";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setBox } from "../../redux/actions/UserAction";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  width: 300%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 1;
  z-index: 2;
`;
const Wrap = styled.div`
  z-index: 2;
`;

const Contents = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: white;
  border-radius: 10px;
  width: 625px;
  height: 600px;
  /* 777px 시 vw로 변경 */
  @media screen and (max-width: 777px) {
    width: 70vw;
  }
`;
interface UForm {
  descript: string;
  tag: string;
  img: any;
}
function HealthViewModal() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const user = useSelector((state: any) => state.User.currentUser);
  const boxData = useSelector((state: any) => state.User.boxData);

  const dispatch = useDispatch();
  const { register, handleSubmit, watch, setValue } = useForm<UForm>();
  const chatMatch: PathMatch<string> | null = useMatch("/:type/view/:id");

  if (chatMatch !== null && id !== undefined) {
    document.body.style.overflow = "hidden";
  }
  useEffect(() => {
    if (boxData) {
    }
  }, [boxData]);
  const onOverlayClick = () => {
    document.body.style.overflow = "unset";
    navigate(-1);
    dispatch(setBox(null));
  };
  const onSubmit = async (data: UForm) => {};
  return (
    <>
      {chatMatch && (
        <>
          <Overlay onClick={onOverlayClick} key={1} />
          {boxData && (
            <Wrap>
              <Contents>
                <div>하이</div>
              </Contents>
            </Wrap>
          )}
        </>
      )}
    </>
  );
}

export default HealthViewModal;
