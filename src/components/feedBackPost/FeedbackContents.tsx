import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fireSotreDB } from "../../firebase";
import { setBox } from "../../redux/actions/UserAction";

const Box = styled.div`
  background-color: ${(props) => props.theme.boxColor};
  width: fit-content;
  height: 350px;
  margin: 20px;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 8%);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
`;
const BoxHeader = styled.div`
  padding: 15px;
  position: relative;
`;
const Profile = styled.div`
  display: flex;
  align-items: center;
`;
const ProfileImg = styled.img`
  :hover {
    transform: scale(1.1);
  }
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 7px;
`;
const BoxUserName = styled.div`
  display: flex;
  span {
    font-size: 16px;
    font-weight: 400;
    border-radius: 10px;
  }
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
  font-size: 8px;
  text-align: center;
`;

const BoxVideo = styled.div`
  display: flex;
  justify-content: center;
`;
const UploadVideo = styled.video`
  width: 250px;
`;
const LogoWrap = styled.div`
  display: flex;
  align-items: center;
`;

function FeedbackContents({ data }: any) {
  const user = useSelector((state: any) => state.User.currentUser);
  const type = useSelector((state: any) => state.User.type);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onLikeClick = (data: any) => {
    if (data.createBy.uid === user?.uid) {
      alert("작성자 본인은 좋아요를 누룰 수 없습니다.");
      return;
    }
    if (!data.likes_list.includes(user?.uid)) {
      //좋아요 누름
      console.log("좋아요");
      const postRef = doc(fireSotreDB, "feedback", `${data.id}`);
      setDoc(
        postRef,
        {
          likes: data.likes + 1,
          likes_list: [...data.likes_list, user?.uid],
        },
        { merge: true }
      );
    } else {
      console.log("싫어요");
      let dataList = data.likes_list;
      const index = dataList.indexOf(user?.uid);
      if (index > -1) dataList.splice(index, 1);

      //좋아요 취소
      const postRef = doc(fireSotreDB, "feedback", `${data.id}`);
      setDoc(
        postRef,
        {
          likes: data.likes - 1,
          likes_list: dataList,
        },
        { merge: true }
      );
    }
  };

  const onClickVideo = async () => {
    //실시간
    onSnapshot(doc(fireSotreDB, "feedback", `${data.id}`), (doc) => {
      dispatch(setBox(doc.data()));
    });
    navigate(`/${type}/view/${data.id}`);
  };
  return (
    <Box>
      <BoxHeader>
        <BoxUserName>
          <Profile>
            <ProfileImg
              onClick={() =>
                navigate(`/${type}/userprofile/${data.createBy.uid}`)
              }
              src={data.createBy.image}
            />
            <div>
              <span>{data.createBy.displayName}</span>
            </div>
            <LogoBox>
              <LogoWrap>
                {data.likes_list.includes(user?.uid) ? (
                  <LikeLogo
                    onClick={() => onLikeClick(data)}
                    fill="tomato"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                  </LikeLogo>
                ) : (
                  <LikeLogo
                    onClick={() => onLikeClick(data)}
                    fill="tomato"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
                  </LikeLogo>
                )}
              </LogoWrap>
              <LikeCount>{data.likes > 0 && data.likes}</LikeCount>
            </LogoBox>
          </Profile>
        </BoxUserName>
      </BoxHeader>
      <BoxVideo onClick={onClickVideo}>
        <UploadVideo src={data.video} />
      </BoxVideo>
    </Box>
  );
}

export default FeedbackContents;
