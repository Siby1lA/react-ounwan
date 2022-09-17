import { useSelector } from "react-redux";
import styled from "styled-components";

const Wrap = styled.div`
  /* background-color: aliceblue; */
  width: 100%;
  height: 370px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
  }
`;
const Contents = styled.div`
  padding: 10px;
`;
const Content = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0px;
`;
const Img = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 15px;
`;
const Msg = styled.div`
  span:first-child {
    font-weight: 400;
    margin-right: 10px;
  }
  span:last-child {
    font-size: 10px;
  }
  p {
    margin-top: 5px;
  }
`;

function CommentView() {
  const user = useSelector((state: any) => state.User.currentUser);
  return (
    <Wrap>
      <Contents>
        <Content>
          <Img src={user.photoURL} />
          <Msg>
            <div>
              <span>닉네임</span>
              <span>2022.09.01</span>
            </div>
            <p>댓글 내용입니다.</p>
          </Msg>
        </Content>
      </Contents>
    </Wrap>
  );
}

export default CommentView;
