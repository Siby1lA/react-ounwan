import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { fireSotreDB } from "../../firebase";
import BoxContents from "./BoxContents";

const Wrap = styled.div`
  display: flex;
`;
const Contents = styled.div`
  width: 100%;
  display: flex;
  @media screen and (max-width: 1000px) {
    justify-content: center;
  }
  flex-wrap: wrap;
`;

function BoxView() {
  const [healthPost, setHealthPost] = useState([]);

  useEffect(() => {
    // 실시간값 받아오기
    onSnapshot(collection(fireSotreDB, "health"), (snapShot) => {
      const list: any = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHealthPost(list);
    });
  }, []);

  return (
    <Wrap>
      <Contents>
        {healthPost &&
          healthPost
            .filter((data) => data)
            .sort((a: any, b: any) => b.timestamp - a.timestamp)
            .map((data: any, index) => <BoxContents key={index} data={data} />)}
      </Contents>
    </Wrap>
  );
}

export default BoxView;
