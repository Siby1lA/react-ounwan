import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import BoxView from "../components/Box/BoxView";
import CreateModal from "../components/Box/CreateModal";
import UpdateModal from "../components/Box/UpdateModal";
import { setType } from "../redux/actions/UserAction";
const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
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
    background-color: #dfdfdf;
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
      <Contents>
        <SubHeader>
          <Title>💪 오늘의 운동 완료!</Title>
          <SubTitle>
            <span>{user.displayName}</span>님 반갑습니다.
          </SubTitle>
        </SubHeader>
        <Content>
          <ContentTitle>오늘 운동 완료</ContentTitle>
          <Create>
            <div onClick={() => navigate(`/${type}/create`)}>게시글 작성</div>
          </Create>
          <BoxView />
        </Content>
      </Contents>
      <CreateModal />
      <UpdateModal />
    </Wrap>
  );
}

export default Home;
