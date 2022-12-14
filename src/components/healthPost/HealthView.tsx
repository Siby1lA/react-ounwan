import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import styled from "styled-components";
import { fireSotreDB } from "../../firebase";
import HealthContents from "./HealthContents";

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

function HealthView() {
  const [healthPost, setHealthPost] = useState<any>([]);
  const [lastKey, setLastKey] = useState<any>();

  useEffect(() => {
    let q = query(
      collection(fireSotreDB, "health"),
      orderBy("timestamp", "desc"),
      limit(12)
    );
    // 실시간값 받아오기
    onSnapshot(q, (snapShot) => {
      const list: any = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHealthPost(list);
      setLastKey(snapShot.docs[snapShot.docs.length - 1]);
    });
  }, []);
  const addData = () => {
    let q = query(
      collection(fireSotreDB, "health"),
      orderBy("timestamp", "desc"),
      startAfter(lastKey),
      limit(12)
    );
    onSnapshot(q, (snapShot) => {
      const list: any = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHealthPost((prev: any) => [...prev, ...list]);
      setLastKey(snapShot.docs[snapShot.docs.length - 1]);
    });
  };
  useBottomScrollListener(addData);
  return (
    <Wrap>
      <Contents>
        {healthPost &&
          healthPost
            .filter((data: any) => data)
            .sort((a: any, b: any) => b.timestamp - a.timestamp)
            .map((data: any, index: any) => (
              <HealthContents key={index} data={data} />
            ))}
      </Contents>
    </Wrap>
  );
}

export default HealthView;
