import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { fireSotreDB } from "../firebase";
import { setBox } from "../redux/actions/UserAction";
import Calendar from "react-github-contribution-calendar";
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: fit-content;
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

const PostWrap = styled.div`
  width: 80vw;
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
  border-top: 1px solid #eee;
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
  video {
    width: 160px;
    cursor: pointer;
  }
`;
const Count = styled.div`
  font-weight: 400;
  text-align: center;
  margin-top: 10px;
`;
const CalendarWrap = styled.div`
  width: 150%;
  @media screen and (max-width: 1000px) {
    width: 100%;
  }
  padding: 5px;
  border-radius: 10px;
  margin-top: 30px;
  background-color: ${(props) => props.theme.boxColor};
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 8%);
`;
const SecondWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
function UserProfile() {
  const { type, id } = useParams();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [feedBackData, setFeedBackData] = useState<any>(null);
  const [mark, setMark] = useState([]);
  const [count, setCount] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      // 유저 게시글
      const filterData = list.filter((data: any) => data.createBy.uid === id);
      const postDate = filterData.map(
        (data: any) =>
          String(data.timestamp.toDate().getFullYear()) +
          "-" +
          String(("0" + (data.timestamp.toDate().getMonth() + 1)).slice(-2)) +
          "-" +
          String(("0" + data.timestamp.toDate().getDate()).slice(-2))
      );
      setCount(
        postDate.filter((element: any, index: any) => {
          return postDate.indexOf(element) === index;
        })
      );
      setMark(postDate);
      setHealthData(filterData);
    });
    let feedBackData = query(
      collection(fireSotreDB, "feedback"),
      orderBy("timestamp", "desc")
    );
    onSnapshot(feedBackData, (snapShot) => {
      const list: any = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // 유저 게시글
      const filterData = list.filter((data: any) => data.createBy.uid === id);
      setFeedBackData(filterData);
    });
  };

  const onClickVideo = async (id: any) => {
    //실시간
    onSnapshot(doc(fireSotreDB, "feedback", `${id}`), (doc) => {
      dispatch(setBox(doc.data()));
    });
    navigate(`/${type}/view/${id}`);
  };
  const result: any = {};
  mark.forEach((x) => {
    result[x] = (result[x] || 0) + 1;
  });
  let values = result;
  let until = String(
    new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
  );
  return (
    <Wrap>
      <FristWrap>
        <img src={userInfo?.image} />
        <Content>
          <span>{userInfo?.displayName}</span>
        </Content>
      </FristWrap>
      <SecondWrap>
        <CalendarWrap>
          <Calendar
            values={values}
            until={until}
            panelColors={[
              "#EEEEEE",
              "#9dc7ea",
              "#5fadec",
              "#3b94dc",
              "#1c75be",
            ]}
            weekNames={["일", "월", "화", "수", "목", "금", "토"]}
            monthNames={[
              "1월",
              "2월",
              "3월",
              "4월",
              "5월",
              "6월",
              "7월",
              "8월",
              "9월",
              "10월",
              "11월",
              "12월",
            ]}
          />
        </CalendarWrap>
        <Count>오운완 {count && count.length}일째</Count>
      </SecondWrap>
      <PostWrap>
        <PostTitle>
          <ul>
            <li>오운완</li>
          </ul>
        </PostTitle>
        <Posts>
          {healthData &&
            healthData.map((data: any, index: number) => (
              <Post key={index}>
                <img src={data.image} />
              </Post>
            ))}
        </Posts>
        {feedBackData && feedBackData.length !== 0 && (
          <>
            <PostTitle>
              <ul>
                <li>피드백</li>
              </ul>
            </PostTitle>
            <Posts>
              {feedBackData.map((data: any, index: number) => (
                <Post key={index}>
                  <video
                    onClick={() => onClickVideo(data.id)}
                    src={data.video}
                  />
                </Post>
              ))}
            </Posts>
          </>
        )}
      </PostWrap>
    </Wrap>
  );
}

export default UserProfile;
