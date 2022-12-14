import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import HealthView from "../components/healthPost/HealthView";
import FeedBackViewModal from "../components/feedBackPost/FeedBackViewModal";
import HealthCreateModal from "../components/healthPost/HealthCreateModal";
import HealthUpdateModal from "../components/healthPost/HealthUpdateModal";
import {
  setType,
  userOunwanCount,
  userPostData,
} from "../redux/actions/UserAction";
import FeedBackCreateModal from "../components/feedBackPost/FeedBackCreateModal";
import FeedBackView from "../components/feedBackPost/FeedBackView";
import Calendar from "react-github-contribution-calendar";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { fireSotreDB } from "../firebase";
const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
`;
const Contents = styled.div`
  width: 90%;
`;
const SubHeader = styled.div`
  padding: 100px 10px 0px 0px;
`;
const Title = styled.h1`
  font-size: 46px;
  font-weight: 600;
  margin-bottom: 20px;
  @media screen and (max-width: 583px) {
    font-size: 42px;
  }
`;
const SubTitle = styled.h2`
  font-size: 40px;
  font-weight: 400;
  span {
    color: #3f51b5;
  }
`;
const Content = styled.div``;
const ContentTitle = styled.h1`
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 20px;
`;
const Create = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px 0px;
  div {
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.theme.btnColor};
    border-radius: 5px;
    padding: 14px;
  }
`;
const CalendarWrap = styled.div`
  width: 500px;
  @media screen and (max-width: 583px) {
    width: 300px;
  }
  padding: 5px;
  border-radius: 10px;
  margin-top: 30px;
  background-color: ${(props) => props.theme.boxColor};
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 8%);
`;
const Count = styled.div`
  font-weight: 400;
  font-size: 24px;
  margin-top: 10px;
  margin-bottom: 50px;
`;
const OunwanCount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media screen and (max-width: 583px) {
    align-items: center;
  }
`;
function Home() {
  const { type } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.User.currentUser);
  const ounwanValue = useSelector((state: any) => state.User.userPostData);
  const ounwanCount = useSelector((state: any) => state.User.userOunwanCount);
  const [count, setCount] = useState(0);
  useEffect(() => {
    dispatch(setType(type));
    if (type === "?????????") {
      alert("????????????????????????.");
    }
  }, [type]);

  let until = String(
    new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
  );
  return (
    <Wrap>
      {type === "?????????" ? (
        <>
          <Contents>
            <SubHeader>
              <Title>???? ????????? ?????? ??????!</Title>
              <SubTitle>
                <span>{user?.displayName}</span>??? ???????????????.
              </SubTitle>
            </SubHeader>
            <OunwanCount>
              <CalendarWrap>
                <Calendar
                  values={ounwanValue}
                  until={until}
                  panelColors={[
                    "#EEEEEE",
                    "#9dc7ea",
                    "#5fadec",
                    "#3b94dc",
                    "#1c75be",
                  ]}
                  weekNames={["???", "???", "???", "???", "???", "???", "???"]}
                  monthNames={[
                    "1???",
                    "2???",
                    "3???",
                    "4???",
                    "5???",
                    "6???",
                    "7???",
                    "8???",
                    "9???",
                    "10???",
                    "11???",
                    "12???",
                  ]}
                />
              </CalendarWrap>
              <Count>
                ?????????{" "}
                <span style={{ color: "tomato", fontWeight: "600" }}>
                  {ounwanCount.length}
                </span>
                ??????!
              </Count>
            </OunwanCount>
            <Content>
              <ContentTitle>?????? ?????? ??????</ContentTitle>
              <Create>
                <div onClick={() => navigate(`/${type}/create`)}>
                  ????????? ??????
                </div>
              </Create>
              <HealthView />
            </Content>
          </Contents>
          <HealthCreateModal />
          <HealthUpdateModal />
        </>
      ) : (
        type === "?????????" && (
          <>
            <Contents>
              <SubHeader>
                <Title>???? ?????? ?????????</Title>
                <SubTitle>
                  <span>{user?.displayName}</span>??? ??????????????? .
                </SubTitle>
              </SubHeader>
              <Content>
                <ContentTitle>?????? ?????????</ContentTitle>
                <Create>
                  <div onClick={() => navigate(`/${type}/create`)}>
                    ????????? ??????
                  </div>
                </Create>
                <FeedBackView />
              </Content>
            </Contents>
            <FeedBackCreateModal />
            <FeedBackViewModal />
          </>
        )
      )}
    </Wrap>
  );
}

export default Home;
