import { child, get, getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { dbService } from "../firebase";
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
  const healthRef = ref(dbService, "health");

  useEffect(() => {
    // 최신값 (소켓)
    onValue(healthRef, (snapshot) => {
      if (snapshot.val()) {
        const data = snapshot.val();
        setHealthPost(Object.values(data));
      }
    });
    // 게시물 데이터 가져오기
    get(child(ref(getDatabase()), "health"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setHealthPost(Object.values(snapshot.val()));
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Wrap>
      <Contents>
        {healthPost &&
          healthPost
            .filter((data) => data)
            .sort(
              (a: any, b: any) =>
                Date.parse(b.timestamp) - Date.parse(a.timestamp)
            )
            .map((data: any, index) => <BoxContents key={index} data={data} />)}
      </Contents>
    </Wrap>
  );
}

export default BoxView;
