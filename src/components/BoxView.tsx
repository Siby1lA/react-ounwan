import styled from "styled-components";
const Wrap = styled.div`
  /* width: fit-content;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px; */
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
const Box = styled.div`
  width: 380px;
  height: 550px;
  margin: 20px;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 8%);
  border-radius: 20px;
  overflow: hidden;
`;
const BoxHeader = styled.div`
  padding: 20px;
  position: relative;
  /* margin-bottom: 5px; */
`;
const Profile = styled.div`
  display: flex;
  align-items: center;
`;
const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 18px;
  margin-right: 10px;
`;
const BoxUserName = styled.div`
  display: flex;
  span {
    font-size: 18px;
    font-weight: 400;
    border-radius: 10px;
  }
  margin-bottom: 20px;
`;
const LikeLogo = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Logo = styled.svg`
  width: 25px;
  margin-bottom: 3px;
  cursor: pointer;
  :hover {
    fill: red;
  }
`;
const LikeCount = styled.div`
  font-size: 12px;
`;
const BoxTitle = styled.h1`
  font-weight: 400;
  margin-bottom: 10px;
`;
const BoxTag = styled.ul`
  display: flex;
  margin-top: 5px;
  li {
    font-size: 14px;
    font-weight: 400;
    color: gray;
    margin-right: 5px;
    :last-child {
      margin-right: 0px;
    }
  }
`;
const BoxImg = styled.div``;
const UploadImg = styled.img`
  width: 380px;
  height: 405px;
`;
function BoxView(type: any) {
  return (
    <Wrap>
      <Contents>
        {[...new Array(6)].map((data, index) => (
          <Box key={index}>
            <BoxHeader>
              <BoxUserName>
                <Profile>
                  <ProfileImg src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F99BB433359E8C2BF32" />
                  <div>
                    <span>1대 500 파이리</span>
                    <BoxTag>
                      <li>#헬스</li>
                      <li>#벤치프레스</li>
                    </BoxTag>
                  </div>
                  <LikeLogo>
                    <Logo
                      fill="tomato"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      {/* <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                       */}
                      <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
                    </Logo>
                    <LikeCount>10</LikeCount>
                  </LikeLogo>
                </Profile>
              </BoxUserName>
              <BoxTitle>나 파이리 오늘 벤치 500들었다.</BoxTitle>
            </BoxHeader>
            <BoxImg>
              <UploadImg src="https://openimage.interpark.com/goods_image_big/8/1/6/5/8746928165_l.jpg" />
            </BoxImg>
          </Box>
        ))}
      </Contents>
    </Wrap>
  );
}

export default BoxView;
