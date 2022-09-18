import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref as strRef,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { uid } from "uid";
import { authService, fireSotreDB, storageService } from "../firebase";
import { setBox } from "../redux/actions/UserAction";
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: fit-content;
  background-color: ${(props) => props.theme.bgColor};
  span {
    font-weight: 400;
    font-size: 16px;
  }
`;
const FristWrap = styled.div`
  margin-top: 20px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 12px;
  }
  display: flex;
  align-items: center;
`;
const Content = styled.div`
  div {
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    color: #0095f6;
  }
`;
const SecondWrap = styled.div`
  margin: 15px 0px;
  span {
    margin-right: 20px;
  }
  input {
    height: 25px;
  }
`;
const Create = styled.div`
  display: flex;
  justify-content: right;
  button {
    border: none;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #dfdfdf;
    border-radius: 5px;
    padding: 10px;
    width: 60px;
  }
`;
const PostWrap = styled.div`
  width: 80vw;
  border-top: 1px solid #eee;
  text-align: center;
`;
const Posts = styled.div`
  display: flex;
  justify-content: center;
  @media screen and (max-width: 1000px) {
    justify-content: center;
  }
  flex-wrap: wrap;
`;
const PostTitle = styled.div`
  font-weight: 400;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  ul {
    display: flex;
    width: 200px;
    justify-content: center;
    align-items: center;
    li {
      color: ${(props) => props.theme.textColor};
      cursor: pointer;
      :hover {
        transform: scale(1.1);
      }
      padding: 10px;
      margin-right: 10px;
      :last-child {
        margin-right: 0px;
      }
    }
  }
`;
const Post = styled.div`
  margin: 10px;
  img {
    width: 280px;
  }
  video {
    width: 160px;
    cursor: pointer;
  }
`;
const Category = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  div {
    font-size: 18px;
    padding: 10px;
    font-weight: 400;
    color: ${(props) => props.theme.textColor};
    cursor: pointer;
  }
`;
interface UForm {
  nickname: string;
  img: any;
}

function Profile() {
  const user = useSelector((state: any) => state.User.currentUser);
  const [imgPath, setImgPath] = useState("");
  const [healthData, setHealthData] = useState<any>(null);
  const [feedBackData, setFeedBackData] = useState<any>(null);
  const [healthLikeData, setHealthLikeData] = useState<any>(null);
  const [feedBackLikeData, setFeedBackLikeData] = useState<any>(null);
  const [onHealthLike, setOnHealthLike] = useState<any>(true);
  const [onFeedBackLike, setOnFeedBackLike] = useState<any>(true);
  const [userName, setUserName] = useState(user?.displayName);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue } = useForm<UForm>();
  const inputOpenImageRef = useRef<any>();
  useEffect(() => {
    setValue("nickname", user?.displayName);
    setValue("img", user?.photoURL);
    //유저 게시글 불러오기
    getUserPosts();
  }, []);
  const getUserPosts = async () => {
    // 오운완 게시글
    let healthData = query(
      collection(fireSotreDB, "health"),
      orderBy("timestamp", "desc")
    );
    onSnapshot(healthData, (snapShot) => {
      const list: any = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // 내 게시글
      const filterData = list.filter(
        (data: any) => data.createBy.uid === user.uid
      );
      setHealthData(filterData);
    });
    // 피드백 게시글
    let feedBackData = query(
      collection(fireSotreDB, "feedback"),
      orderBy("timestamp", "desc")
    );
    onSnapshot(feedBackData, (snapShot) => {
      const list: any = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // 내 게시글
      const filterData = list.filter(
        (data: any) => data.createBy.uid === user.uid
      );
      setFeedBackData(filterData);
    });
  };
  const getLikePosts = async (type: string) => {
    //좋아요 누른 게시글
    if (type === "health") {
      let healthData = query(
        collection(fireSotreDB, "health"),
        orderBy("timestamp", "desc")
      );
      onSnapshot(healthData, (snapShot) => {
        const list: any = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filterData = list.filter(
          (data: any) => data.createBy.uid !== user.uid
        );
        const filterData2 = filterData.filter((data: any) =>
          data.likes_list.includes(user.uid)
        );
        setHealthLikeData(filterData2);
      });
    } else {
      let feedBackData = query(
        collection(fireSotreDB, "feedback"),
        orderBy("timestamp", "desc")
      );
      onSnapshot(feedBackData, (snapShot) => {
        const list: any = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filterData = list.filter(
          (data: any) => data.createBy.uid !== user.uid
        );
        const filterData2 = filterData.filter((data: any) =>
          data.likes_list.includes(user.uid)
        );
        setFeedBackLikeData(filterData2);
      });
    }
  };
  const handleOpenImageRef = async () => {
    inputOpenImageRef.current.click();
  };
  const handleUploadImage = async (event: any) => {
    setImgPath(URL.createObjectURL(event.target.files[0]));
    setValue("img", event.target.files[0]);
  };
  const onSubmit = async (data: UForm) => {
    const userData = await getDocs(collection(fireSotreDB, "users"));
    let userId: any[] = [];
    userData.forEach((doc) => {
      userId.push({ id: doc.id, ...doc.data() });
    });
    const filter = userId.filter((data) => data.uid === user?.uid);

    if (imgPath) {
      //프로필 사진과 닉네임 변경시
      try {
        // storage에 저장
        const uploadProfileImg = uploadBytesResumable(
          strRef(storageService, `profile/img/${uid()}`),
          data.img
        );
        uploadProfileImg.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                break;
              case "storage/canceled":
                // User canceled the upload
                break;
              // ...
              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          },
          () => {
            // 스토리지에 저장이 된 후 DB에 저장
            // 저장된 파일을 URL로 가져오기
            getDownloadURL(uploadProfileImg.snapshot.ref).then(
              async (downloadURL) => {
                const UserRef = doc(fireSotreDB, "users", `${filter[0].id}`);
                setDoc(
                  UserRef,
                  {
                    displayName: data.nickname,
                    image: downloadURL,
                  },
                  { merge: true }
                );
                updateProfile(authService.currentUser, {
                  displayName: data.nickname,
                  photoURL: downloadURL,
                });
                // 올린 게시물의 유저 정보 변경
                const healthData = await getDocs(
                  collection(fireSotreDB, "health")
                );
                let list: any[] = [];
                healthData.forEach((doc) => {
                  list.push({ id: doc.id, ...doc.data() });
                });
                const filterData = list.filter(
                  (data) => data.createBy.uid === user.uid
                );
                for (let i = 0; i < filterData.length; i++) {
                  const postRef = doc(
                    fireSotreDB,
                    "health",
                    `${filterData[i].id}`
                  );
                  setDoc(
                    postRef,
                    {
                      createBy: {
                        displayName: data.nickname,
                        image: downloadURL,
                        uid: user.uid,
                      },
                    },
                    { merge: true }
                  );
                }
              }
            );
          }
        );
        setUserName(data.nickname);
        alert("변경되었습니다.");
      } catch (error: any) {
        console.log(error);
      }
    } else {
      // 닉네임만 변경시
      const UserRef = doc(fireSotreDB, "users", `${filter[0].id}`);
      setDoc(
        UserRef,
        {
          displayName: data.nickname,
        },
        { merge: true }
      );
      updateProfile(authService.currentUser, {
        displayName: data.nickname,
        photoURL: user.photoURL,
      });
      // 올린 게시물의 유저 정보 변경
      const healthData = await getDocs(collection(fireSotreDB, "health"));
      let list: any[] = [];
      healthData.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      const filterData = list.filter((data) => data.createBy.uid === user.uid);
      for (let i = 0; i < filterData.length; i++) {
        const postRef = doc(fireSotreDB, "health", `${filterData[i].id}`);
        setDoc(
          postRef,
          {
            createBy: {
              displayName: data.nickname,
              image: user.photoURL,
              uid: user.uid,
            },
          },
          { merge: true }
        );
      }
      setUserName(data.nickname);
      alert("변경되었습니다.");
    }
  };
  const onClickVideo = async (id: any) => {
    //실시간
    onSnapshot(doc(fireSotreDB, "feedback", `${id}`), (doc) => {
      dispatch(setBox(doc.data()));
    });
    navigate(`/피드백/view/${id}`);
  };
  return (
    <Wrap>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FristWrap>
          {imgPath ? <img src={imgPath} /> : <img src={user?.photoURL} />}
          <Content>
            <span>{userName}</span>
            <div onClick={handleOpenImageRef}>프로필 사진 바꾸기</div>
          </Content>
        </FristWrap>
        <SecondWrap>
          <span>닉네임</span>
          <input
            {...register("nickname")}
            type="text"
            placeholder="닉네임 변경"
          />
        </SecondWrap>

        <input
          {...register("img")}
          type="file"
          style={{ display: "none" }}
          accept="image/jpeg, image/png, image/webp"
          ref={inputOpenImageRef}
          onChange={handleUploadImage}
        ></input>
        <Create>
          <button>제출</button>
        </Create>
      </form>
      <Category>
        <div>오운완</div>
      </Category>
      <PostWrap>
        <PostTitle>
          <ul>
            <li
              onClick={() => {
                setOnHealthLike(true);
                getUserPosts();
              }}
            >
              게시글
            </li>
            <li
              onClick={() => {
                setOnHealthLike(false);
                getLikePosts("health");
              }}
            >
              좋아요
            </li>
          </ul>
        </PostTitle>
        <Posts>
          {onHealthLike
            ? healthData &&
              healthData.map((data: any, index: number) => (
                <Post key={index}>
                  <img src={data.image} />
                </Post>
              ))
            : healthLikeData &&
              healthLikeData.map((data: any, index: number) => (
                <Post key={index}>
                  <img src={data.image} />
                </Post>
              ))}
        </Posts>
      </PostWrap>

      <Category>
        <div>피드백</div>
      </Category>
      <PostWrap>
        <PostTitle>
          <ul>
            <li
              onClick={() => {
                setOnFeedBackLike(true);
                getUserPosts();
              }}
            >
              게시글
            </li>
            <li
              onClick={() => {
                setOnFeedBackLike(false);
                getLikePosts("feedback");
              }}
            >
              좋아요
            </li>
          </ul>
        </PostTitle>
        <Posts>
          {onFeedBackLike
            ? feedBackData &&
              feedBackData.map((data: any, index: number) => (
                <Post key={index}>
                  <video
                    onClick={() => onClickVideo(data.id)}
                    src={data.video}
                  />
                </Post>
              ))
            : feedBackLikeData &&
              feedBackLikeData.map((data: any, index: number) => (
                <Post key={index}>
                  <video
                    onClick={() => onClickVideo(data.id)}
                    src={data.video}
                  />
                </Post>
              ))}
        </Posts>
      </PostWrap>
    </Wrap>
  );
}

export default Profile;
