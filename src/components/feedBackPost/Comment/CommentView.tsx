import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Wrap = styled.div`
  z-index: 0;
  width: 100%;
  height: 370px;
  @media screen and (max-width: 777px) {
    height: 260px;
    margin-bottom: 40px;
  }
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
  }
  display: flex;
  flex-direction: column-reverse;
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
  const boxData = useSelector((state: any) => state.User.boxData);
  const messageBoxRef = useRef<any>();
  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [boxData.comment]);
  return (
    <Wrap ref={messageBoxRef}>
      <Contents>
        {boxData.comment &&
          boxData.comment.map((data: any, index: number) => (
            <Content key={index}>
              <Img src={data.createBy.image} />
              <Msg>
                <div>
                  <span>{data.createBy.displayName}</span>
                  <span>{data.timestamp.toDate().toLocaleString()}</span>
                </div>
                <p>{data.comment}</p>
              </Msg>
            </Content>
          ))}
      </Contents>
    </Wrap>
  );
}

export default CommentView;
