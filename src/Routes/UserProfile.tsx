import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { fireSotreDB } from "../firebase";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 93.1vh;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  span {
    font-weight: 400;
    font-size: 16px;
  }
`;
const FristWrap = styled.div`
  margin-top: 20px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 12px;
  }
  display: flex;
  align-items: center;
`;
const Content = styled.div`
  div {
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    color: #0095f6;
  }
`;
const SecondWrap = styled.div`
  margin: 15px 0px;
  span {
    margin-right: 20px;
  }
`;

const PostWrap = styled.div`
  width: 80vw;
  border-top: 1px solid #eee;
  margin-top: 40px;
  text-align: center;
`;
const Posts = styled.div`
  display: flex;
  justify-content: center;
  @media screen and (max-width: 1000px) {
    justify-content: center;
  }
  flex-wrap: wrap;
`;
const PostTitle = styled.div`
  font-weight: 400;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  ul {
    display: flex;
    width: 200px;
    justify-content: center;
    align-items: center;
    li {
      color: ${(props) => props.theme.textColor};
      cursor: pointer;
      :hover {
        transform: scale(1.1);
      }
      padding: 10px;
      margin-right: 10px;
      :last-child {
        margin-right: 0px;
      }
    }
  }
`;
const Post = styled.div`
  margin: 10px;
  img {
    width: 280px;
  }
`;
function UserProfile() {
  const { type, id } = useParams();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [postData, setPostData] = useState<any>(null);
  useEffect(() => {
    //유저 정보 불러오기
    getUserInfo();
    //유저 게시글 불러오기
    getUserPosts();
  }, []);
  const getUserInfo = async () => {
    //해당 게시물의  유저 정보 찾기
    let healthData = query(collection(fireSotreDB, "users"));
    onSnapshot(healthData, (snapShot) => {
      const list: any = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filterData = list.filter((data: any) => data.uid === id);
      setUserInfo(filterData[0]);
    });
  };

  const getUserPosts = async () => {
    let healthData = query(
      collection(fireSotreDB, "health"),
      orderBy("timestamp", "desc")
    );
    onSnapshot(healthData, (snapShot) => {
      const list: any = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // 내 게시글
      const filterData = list.filter((data: any) => data.createBy.uid === id);

      setPostData(filterData);
    });
  };
  return (
    <Wrap>
      <FristWrap>
        <img src={userInfo?.image} />
        <Content>
          <span>{userInfo?.displayName}</span>
        </Content>
      </FristWrap>
      <PostWrap>
        <PostTitle>
          <ul>
            <li>게시글</li>
          </ul>
        </PostTitle>
        <Posts>
          {postData &&
            postData.map((data: any, index: number) => (
              <Post key={index}>
                <img src={data.image} />
              </Post>
            ))}
        </Posts>
      </PostWrap>
    </Wrap>
  );
}

export default UserProfile;
