import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
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
  const [healthPost, setHealthPost] = useState<any>([]);
  const [lastKey, setLastKey] = useState<any>();

  useEffect(() => {
    let q = query(
      collection(fireSotreDB, "health"),
      orderBy("timestamp", "desc"),
      limit(2)
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
  const fetchData = () => {
    let q = query(
      collection(fireSotreDB, "health"),
      orderBy("timestamp", "desc"),
      startAfter(lastKey),
      limit(2)
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
  useBottomScrollListener(fetchData);
  return (
    <Wrap>
      <Contents>
        {healthPost &&
          healthPost
            .filter((data: any) => data)
            .sort((a: any, b: any) => b.timestamp - a.timestamp)
            .map((data: any, index: any) => (
              <BoxContents key={index} data={data} />
            ))}
      </Contents>
    </Wrap>
  );
}

export default BoxView;
