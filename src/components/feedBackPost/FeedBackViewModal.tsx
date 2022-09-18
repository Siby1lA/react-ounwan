import styled from "styled-components";
import { PathMatch, useMatch, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { fireSotreDB, storageService } from "../../firebase";
import { uid } from "uid";
import {
  getDownloadURL,
  ref as strRef,
  uploadBytesResumable,
} from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import CommentWrite from "./Comment/CommentWrite";
import CommentView from "./Comment/CommentView";
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
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 10px;
  width: 600px;
  height: fit-content;
  min-width: 600px;

  overflow: hidden;
`;
const VideoWrap = styled.div`
  margin-bottom: -5px;
`;

const VideoContent = styled.div`
  video {
    width: 300px;
  }
`;

const LeftContents = styled.div``;

const RightContents = styled.div`
  width: 100%;
  position: relative;
`;

const Profile = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  span {
    font-weight: 400;
    font-size: 14px;
  }
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;
const ProfileImg = styled.img`
  :hover {
    transform: scale(1.1);
  }
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
`;

const LogoBox = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin: 15px;
`;
const LikeLogo = styled.svg`
  width: 20px;
  margin-bottom: 3px;
  cursor: pointer;
  :first-child {
    width: 20px;
    :hover {
      fill: red;
    }
  }
`;
const LikeCount = styled.div`
  font-size: 12px;
  text-align: center;
  margin-right: 25px;
  margin-top: -4px;
`;
const LogoWrap = styled.div`
  display: flex;
  align-items: center;
`;
const SetLogo = styled.div`
  margin-left: 10px;
  position: relative;
  padding: 5px;
  svg {
    width: 4px;
    cursor: pointer;
    fill: ${(props) => props.theme.textColor};
  }
`;
const Ul = styled.ul`
  background-color: ${(props) => props.theme.bgColor};
  position: absolute;
  right: 0;
  border-radius: 5px;
  margin-top: 5px;
  border: 2px solid #eee;
  width: 100px;
  li {
    padding: 10px;
    font-size: 14px;
    font-weight: 300;
    cursor: pointer;
    :first-child {
      border-bottom: 2px solid #eee;
    }
    :hover {
      background-color: #eee;
    }
  }
`;

const CommentWrap = styled.div`
  height: fit-content;
`;
const Description = styled.div`
  padding: 10px;
  width: 100%;
  height: 50px;
`;
interface UForm {
  description: string;
}
function FeedBackViewModal() {
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [onUpdateToggle, setOnUpdateToggle] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const { id } = useParams();
  const user = useSelector((state: any) => state.User.currentUser);
  const boxData = useSelector((state: any) => state.User.boxData);

  const { register, handleSubmit, watch, setValue } = useForm<UForm>();
  const chatMatch: PathMatch<string> | null = useMatch("/:type/view/:id");
  if (chatMatch) {
    document.body.style.overflow = "hidden";
  }
  const onOverlayClick = () => {
    document.body.style.overflow = "unset";
    navigate(-1);
  };

  const onSubmit = async (data: UForm) => {
    const postRef = doc(fireSotreDB, "feedback", `${id}`);
    setDoc(
      postRef,
      {
        description: data.description,
      },
      { merge: true }
    );
    setOnUpdateToggle(false);
    alert("수정되었습니다.");
  };
  const onLikeClick = () => {
    if (boxData.createBy.uid === user?.uid) {
      alert("작성자 본인은 좋아요를 누룰 수 없습니다.");
      return;
    }
    if (!boxData.likes_list.includes(user?.uid)) {
      //좋아요 누름
      console.log("좋아요");
      const postRef = doc(fireSotreDB, "feedback", `${id}`);
      setDoc(
        postRef,
        {
          likes: boxData.likes + 1,
          likes_list: [...boxData.likes_list, user?.uid],
        },
        { merge: true }
      );
    } else {
      console.log("싫어요");
      let dataList = boxData.likes_list;
      const index = dataList.indexOf(user?.uid);
      if (index > -1) dataList.splice(index, 1);

      //좋아요 취소
      const postRef = doc(fireSotreDB, "feedback", `${id}`);
      setDoc(
        postRef,
        {
          likes: boxData.likes - 1,
          likes_list: dataList,
        },
        { merge: true }
      );
    }
  };
  const onDelete = () => {
    deleteDoc(doc(fireSotreDB, "feedback", `${id}`));
  };
  const onUpdate = async () => {
    const docRef = doc(fireSotreDB, "feedback", `${id}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setOnUpdateToggle(true);
      setValue("description", docSnap.data().description);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    // navigate(`/${type}/update/${id}`);
  };
  return (
    <>
      {chatMatch && boxData && (
        <>
          <Overlay onClick={onOverlayClick} key={1} />
          <Wrap>
            <Contents style={{ top: scrollY.get() + 80 }}>
              <LeftContents>
                <VideoWrap>
                  {boxData && (
                    <VideoContent>
                      <video src={boxData?.video} controls></video>
                    </VideoContent>
                  )}
                </VideoWrap>
              </LeftContents>
              <RightContents>
                <Profile>
                  <ProfileImg src={boxData?.createBy.image} />
                  <div>
                    <span>{boxData?.createBy.displayName}</span>
                  </div>
                  <LogoBox>
                    <LogoWrap>
                      {boxData?.likes_list.includes(user?.uid) ? (
                        <LikeLogo
                          onClick={onLikeClick}
                          fill="tomato"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                        </LikeLogo>
                      ) : (
                        <LikeLogo
                          onClick={onLikeClick}
                          fill="tomato"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
                        </LikeLogo>
                      )}
                      <SetLogo onClick={() => setIsDropOpen((prev) => !prev)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 128 512"
                        >
                          <path d="M64 360c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm0-160c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zM120 96c0 30.9-25.1 56-56 56S8 126.9 8 96S33.1 40 64 40s56 25.1 56 56z" />
                        </svg>
                        {isDropOpen && (
                          <Ul>
                            {boxData.createBy.uid === user.uid ? (
                              <>
                                <li onClick={onUpdate}>게시글 수정</li>
                                <li onClick={onDelete}>게시글 삭제</li>
                              </>
                            ) : (
                              <>
                                <li>작성자 정보</li>
                                <li>작성자 신고</li>
                              </>
                            )}
                          </Ul>
                        )}
                      </SetLogo>
                    </LogoWrap>
                    <LikeCount>
                      {boxData?.likes > 0 && boxData?.likes}
                    </LikeCount>
                  </LogoBox>
                </Profile>
                {onUpdateToggle ? (
                  <Description>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <input {...register("description")} type="text" />
                      <button>수정</button>
                    </form>
                  </Description>
                ) : (
                  <Description>{boxData.description}</Description>
                )}

                <CommentWrap>
                  <CommentView />
                  <CommentWrite />
                </CommentWrap>
              </RightContents>
            </Contents>
          </Wrap>
        </>
      )}
    </>
  );
}

export default FeedBackViewModal;
