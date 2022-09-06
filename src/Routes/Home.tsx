import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import BoxView from "../components/BoxView";
import CreateModal from "../components/CreateModal";
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
  const navigate = useNavigate();

  return (
    <Wrap>
      <Contents>
        <SubHeader>
          <Title>💪 {type}</Title>
          <SubTitle>
            {type === "헬스"
              ? "헬스는 점진적 과부하"
              : type === "필라테스"
              ? "필라테스는 유연성"
              : type === "크로스핏"
              ? "크로스핏은 끈기"
              : type === "파워리프팅"
              ? "파워 그자체 파워리프팅"
              : null}
          </SubTitle>
        </SubHeader>
        <Content>
          <ContentTitle>오늘 운동 완료</ContentTitle>
          <Create>
            <div onClick={() => navigate(`/${type}/create`)}>게시글 작성</div>
          </Create>
          <BoxView type={type} />
        </Content>
      </Contents>
      <CreateModal />
    </Wrap>
  );
}

export default Home;
