import { updateProfile } from "firebase/auth";
import { child, get, getDatabase, ref, update } from "firebase/database";
import {
  getDownloadURL,
  ref as strRef,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { uid } from "uid";
import { authService, dbService, storageService } from "../firebase";
const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
interface UForm {
  nickname: string;
  img: any;
}

function Profile() {
  const user = useSelector((state: any) => state.User.currentUser);
  const [imgPath, setImgPath] = useState("");
  const { register, handleSubmit, watch, setValue } = useForm<UForm>();
  const inputOpenImageRef = useRef<any>();
  const healthRef = ref(dbService, "health");
  useEffect(() => {
    setValue("nickname", user?.displayName);
    setValue("img", user?.photoURL);
  }, []);
  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };
  const handleUploadImage = async (event: any) => {
    setImgPath(URL.createObjectURL(event.target.files[0]));
    setValue("img", event.target.files[0]);
  };
  const onSubmit = async (data: UForm) => {
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
              (downloadURL) => {
                update(child(ref(dbService), `users/${user.uid}`), {
                  displayName: data.nickname,
                  image: downloadURL,
                });
                updateProfile(authService.currentUser, {
                  displayName: data.nickname,
                  photoURL: downloadURL,
                });
                // 올린 게시물의 유저 정보 변경
                get(child(ref(getDatabase()), "health"))
                  .then((snapshot) => {
                    if (snapshot.exists()) {
                      const val = Object.values(snapshot.val());
                      const filterData: any = val.filter(
                        (ele: any) => ele.createBy.uid === user.uid
                      );
                      for (let i = 0; i < filterData.length; i++) {
                        update(child(healthRef, `/${filterData[i].id}`), {
                          createBy: {
                            displayName: data.nickname,
                            image: downloadURL,
                            uid: user.uid,
                          },
                        });
                      }
                    } else {
                      console.log("No data available");
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            );
          }
        );
        alert("작성되었습니다.");
      } catch (error: any) {
        console.log(error);
      }
    } else {
      // 닉네임만 변경시
      update(child(ref(dbService), `users/${user.uid}`), {
        displayName: data.nickname,
        image: user.photoURL,
      });
      updateProfile(authService.currentUser, {
        displayName: data.nickname,
        photoURL: user.photoURL,
      });
      // 올린 게시물의 유저 정보 변경
      get(child(ref(getDatabase()), "health")).then((snapshot) => {
        if (snapshot.exists()) {
          const val = Object.values(snapshot.val());
          const filterData: any = val.filter(
            (ele: any) => ele.createBy.uid === user.uid
          );
          for (let i = 0; i < filterData.length; i++) {
            update(child(healthRef, `/${filterData[i].id}`), {
              createBy: {
                displayName: data.nickname,
                image: user.photoURL,
                uid: user.uid,
              },
            });
          }
          alert("작성되었습니다.");
        } else {
          console.log("No data available");
        }
      });
    }
  };

  return (
    <Wrap>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FristWrap>
          {imgPath ? <img src={imgPath} /> : <img src={user?.photoURL} />}

          <Content>
            <span>{user?.displayName}</span>
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
          accept="image/*"
          ref={inputOpenImageRef}
          onChange={handleUploadImage}
        ></input>
        <Create>
          <button>제출</button>
        </Create>
      </form>
    </Wrap>
  );
}

export default Profile;
