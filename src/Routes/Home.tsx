import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import HealthView from "../components/healthPost/HealthView";
import HealthViewModal from "../components/healthPost/HealthViewModal";
import HealthCreateModal from "../components/healthPost/HealthCreateModal";
import HealthUpdateModal from "../components/healthPost/HealthUpdateModal";
import { setType } from "../redux/actions/UserAction";
import FeedBackCreateModal from "../components/feedBackPost/FeedBackCreateModal";
import FeedBackView from "../components/feedBackPost/FeedBackView";

const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
`;
const Contents = styled.div`
  width: 90vw;
  min-width: 550px;
  margin-bottom: 50px;
`;
const SubHeader = styled.div`
  padding: 100px 0px;
`;
const Title = styled.h1`
  font-size: 46px;
  font-weight: 600;
  margin-bottom: 20px;
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
function Home() {
  const { type } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.User.currentUser);
  useEffect(() => {
    dispatch(setType(type));
  }, [type]);
  return (
    <Wrap>
      {type === "오운완" ? (
        <>
          <Contents>
            <SubHeader>
              <Title>💪 오늘의 운동 완료!</Title>
              <SubTitle>
                <span>{user?.displayName}</span>님 반갑습니다.
              </SubTitle>
            </SubHeader>
            <Content>
              <ContentTitle>오늘 운동 완료</ContentTitle>
              <Create>
                <div onClick={() => navigate(`/${type}/create`)}>
                  오운완 작성
                </div>
              </Create>
              <HealthView />
            </Content>
          </Contents>
          <HealthCreateModal />
          <HealthUpdateModal />
          <HealthViewModal />
        </>
      ) : (
        type === "피드백" && (
          <>
            <Contents>
              <SubHeader>
                <Title>💪 운동 피드백</Title>
                <SubTitle>
                  <span>{user?.displayName}</span>님 반갑습니다.
                </SubTitle>
              </SubHeader>
              <Content>
                <ContentTitle>운동 피드백</ContentTitle>
                <Create>
                  <div onClick={() => navigate(`/${type}/create`)}>
                    피드백 작성
                  </div>
                </Create>
                <FeedBackView />
              </Content>
            </Contents>
            <FeedBackCreateModal />
          </>
        )
      )}
    </Wrap>
  );
}

export default Home;
