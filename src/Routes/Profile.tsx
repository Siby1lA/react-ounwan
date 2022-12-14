import { updatePassword, updateProfile } from "firebase/auth";
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
import Calendar from "react-github-contribution-calendar";
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: fit-content;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  span {
    font-weight: 400;
    font-size: 16px;
  }
`;
const UserInfoWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const FormWrap = styled.div``;
const CalendarWrap = styled.div`
  width: 150%;
  @media screen and (max-width: 583px) {
    width: 100%;
  }
  border-radius: 10px;
  padding: 5px;
  margin-top: 30px;
  background-color: ${(props) => props.theme.boxColor};
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 8%);
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
const Count = styled.div`
  font-weight: 400;
  text-align: center;
  margin-top: 10px;
`;
interface UForm {
  nickname: string;
  password: string;
  img: any;
}

function Profile() {
  const user = useSelector((state: any) => state.User.currentUser);
  const ounwanValue = useSelector((state: any) => state.User.userPostData);
  const ounwanCount = useSelector((state: any) => state.User.userOunwanCount);
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
    //?????? ????????? ????????????
    getUserPosts();
  }, []);
  const getUserPosts = async () => {
    // ????????? ?????????
    let healthData = query(
      collection(fireSotreDB, "health"),
      orderBy("timestamp", "desc")
    );
    onSnapshot(healthData, (snapShot) => {
      const list: any = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // ??? ?????????
      const filterData = list.filter(
        (data: any) => data.createBy.uid === user.uid
      );

      setHealthData(filterData);
    });
    // ????????? ?????????
    let feedBackData = query(
      collection(fireSotreDB, "feedback"),
      orderBy("timestamp", "desc")
    );
    onSnapshot(feedBackData, (snapShot) => {
      const list: any = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // ??? ?????????
      const filterData = list.filter(
        (data: any) => data.createBy.uid === user.uid
      );
      setFeedBackData(filterData);
    });
  };
  const getLikePosts = async (type: string) => {
    //????????? ?????? ?????????
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
    if (data.nickname === "") {
      alert("???????????? ??????????????????...");
      return;
    }
    if (imgPath) {
      //????????? ????????? ????????? ?????????
      try {
        // storage??? ??????
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
            // ??????????????? ????????? ??? ??? DB??? ??????
            // ????????? ????????? URL??? ????????????
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
                // ?????? ???????????? ?????? ?????? ??????
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
        alert("?????????????????????.");
      } catch (error: any) {
        console.log(error);
      }
    } else {
      // ???????????? ?????????
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
      // ?????? ???????????? ?????? ?????? ??????
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
    }
    // ???????????? ?????????
    if (data.password) {
      updatePassword(user, data.password)
        .then(() => {
          // Update successful.
        })
        .catch((error) => {
          // An error ocurred
          alert("???????????? ?????? ??????!");
        });
    }
    alert("?????????????????????.");
  };
  const onClickVideo = async (id: any) => {
    //?????????
    onSnapshot(doc(fireSotreDB, "feedback", `${id}`), (doc) => {
      dispatch(setBox(doc.data()));
    });
    navigate(`/?????????/view/${id}`);
  };

  let until = String(
    new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
  );

  return (
    <Wrap>
      <UserInfoWrap>
        <FormWrap>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FristWrap>
              {imgPath ? <img src={imgPath} /> : <img src={user?.photoURL} />}
              <Content>
                <span>{userName}</span>
                <div onClick={handleOpenImageRef}>????????? ?????? ?????????</div>
              </Content>
            </FristWrap>
            <SecondWrap>
              <span>????????????</span>
              <input
                {...register("nickname")}
                type="text"
                placeholder="????????? ??????"
              />
            </SecondWrap>
            <SecondWrap>
              <span>????????????</span>
              <input
                {...register("password")}
                type="password"
                placeholder="???????????? ??????"
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
              <button>??????</button>
            </Create>
          </form>
        </FormWrap>
        <CalendarWrap>
          <Calendar
            values={ounwanValue}
            until={until}
            panelColors={[
              "#EEEEEE",
              "#9dc7ea",
              "#5fadec",
              "#3b94dc",
              "#1c75be",
            ]}
            weekNames={["???", "???", "???", "???", "???", "???", "???"]}
            monthNames={[
              "1???",
              "2???",
              "3???",
              "4???",
              "5???",
              "6???",
              "7???",
              "8???",
              "9???",
              "10???",
              "11???",
              "12???",
            ]}
          />
        </CalendarWrap>
        <Count>????????? {ounwanCount.length}??????</Count>
      </UserInfoWrap>
      {healthData && healthData.length > 0 && (
        <>
          <Category>
            <div>?????????</div>
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
                  ?????????
                </li>
                <li
                  onClick={() => {
                    setOnHealthLike(false);
                    getLikePosts("health");
                  }}
                >
                  ?????????
                </li>
              </ul>
            </PostTitle>
            <Posts>
              {onHealthLike
                ? healthData.map((data: any, index: number) => (
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
        </>
      )}
      {feedBackData && feedBackData.length > 0 && (
        <>
          {" "}
          <Category>
            <div>?????????</div>
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
                  ?????????
                </li>
                <li
                  onClick={() => {
                    setOnFeedBackLike(false);
                    getLikePosts("feedback");
                  }}
                >
                  ?????????
                </li>
              </ul>
            </PostTitle>
            <Posts>
              {onFeedBackLike
                ? feedBackData.map((data: any, index: number) => (
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
        </>
      )}
    </Wrap>
  );
}

export default Profile;
