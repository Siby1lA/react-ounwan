import styled from "styled-components";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { useCallback, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { fireSotreDB, storageService } from "../../firebase";
import { uid } from "uid";
import getCroppedImg from "./cropImage";
import {
  getDownloadURL,
  ref as strRef,
  uploadBytesResumable,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Cropper, { Area, Point } from "react-easy-crop";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  width: 300%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 1;
  z-index: 2;
`;
const Wrap = styled.div`
  z-index: 2;
`;

const Contents = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 10px;
  width: 625px;
  height: fit-content; /* 777px 시 vw로 변경 */
  @media screen and (max-width: 777px) {
    width: 70vw;
  }
`;
const Header = styled.div`
  font-size: 18px;
  font-weight: 400;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0px 13px;
  svg {
    cursor: pointer;
    width: 20px;
    margin-top: 5px;
    fill: ${(props) => props.theme.textColor};
  }
  div:last-child {
    color: #0095f6;
    font-size: 16px;
    cursor: pointer;
    border: none;
    background-color: ${(props) => props.theme.bgColor};
  }
  button {
    color: #0095f6;
    font-size: 16px;
    cursor: pointer;
    border: none;
    padding: 0px;
    background-color: ${(props) => props.theme.bgColor};
  }
`;
const ImgUpload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  svg {
    width: 180px;
    fill: #183052;
    margin-bottom: 20px;
  }
`;
const ImgChoice = styled.div`
  padding: 7px;
  border-radius: 3px;
  background-color: ${(props) => props.theme.btnColor};
  margin-top: 15px;
  color: ${(props) => props.theme.textColor};
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
`;
const ContentInput = styled.div`
  padding: 0px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  input {
    color: ${(props) => props.theme.textColor};
    border: none;
    border: 2px solid rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    background-color: ${(props) => props.theme.bgColor};
    width: 100%;
    height: 40px;
  }
`;
const UserInfo = styled.div`
  div {
    padding: 10px 20px;
    display: flex;
    align-items: center;
    span {
      font-weight: 600;
    }
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
`;

const TagBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 50px;
  margin: 10px;
  padding: 0 10px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  input {
    display: inline-flex;
    min-width: 150px;
    background: transparent;
    border: none;
    outline: none;
    cursor: text;
  }
`;
const Tag = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px;
  padding: 5px;
  background-color: tomato;
  border-radius: 5px;
  color: white;
  font-size: 13px;
`;
const CropWrap = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
`;
const ImgWrap = styled.div`
  text-align: center;
  div {
    font-weight: 400;
  }
  margin-top: 30px;
  width: 380px;
  img {
    width: 100%;
  }
`;
interface UForm {
  descript: string;
  tag: string;
  img: any;
}
function HealthCreateModal() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const user = useSelector((state: any) => state.User.currentUser);
  const [imgPath, setImgPath] = useState("");
  const [tagList, setTagList] = useState<any>([]);
  const [inputToggle, setInputToggle] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<UForm>();
  const chatMatch: PathMatch<string> | null = useMatch("/:type/create");
  if (chatMatch) {
    // document.body.style.overflow = "hidden";
  }

  const onOverlayClick = () => {
    setInputToggle(false);
    // document.body.style.overflow = "unset";
    navigate(-1);
    setValue("descript", "");
    setImgPath("");
    setTagList("");
    setValue("tag", "");
    setValue("img", null);
  };
  const inputOpenImageRef = useRef<any>();
  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };
  const handleUploadImage = async (event: any) => {
    setImgPath(URL.createObjectURL(event.target.files[0]));
    // setValue("img", event.target.files[0]);
  };
  const onSubmit = async (data: UForm) => {
    if (imgPath) {
      try {
        // storage에 저장
        const uploadImg = uploadBytesResumable(
          strRef(storageService, `health/img/${uid()}`),
          data.img,
          { contentType: "blob.type" }
        );
        uploadImg.on(
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
            getDownloadURL(uploadImg.snapshot.ref).then((downloadURL) => {
              const postRef = collection(fireSotreDB, "health");
              addDoc(postRef, {
                timestamp: serverTimestamp(),
                description: data.descript,
                image: downloadURL,
                likes: 0,
                likes_list: [user.uid],
                tagList: tagList,
                createBy: {
                  displayName: user.displayName,
                  image: user.photoURL,
                  uid: user.uid,
                },
              });
            });
          }
        );
        alert("작성되었습니다.");
        onOverlayClick();
      } catch (error: any) {
        console.log(error);
      }
    } else {
      alert("이미지 를 넣어주세요");
    }
    setInputToggle(false);
    setValue("img", null);
  };
  const onKeyUp = (e: any) => {
    //해쉬태그 리스트에 담기
    if (e.target.value.length !== 0 && e.key === "Enter") {
      let updatedTagList = [...tagList];
      updatedTagList.push(e.target.value);
      setTagList(updatedTagList);
      setValue("tag", "");
    }
  };
  const checkKeyDown = (e: any) => {
    if (e.code === "Enter") e.preventDefault();
  };
  const onTagDel = (data: string) => {
    const filteredTagList = tagList.filter((tagItem: any) => tagItem !== data);
    setTagList(filteredTagList);
  };
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );
  const showCroppedImage = useCallback(async () => {
    if (!imgPath) {
      alert("이미지를 선택해주세요");
      return;
    }
    try {
      const croppedImage = await getCroppedImg(imgPath, croppedAreaPixels);
      setValue("img", croppedImage);
      setImgPath(URL.createObjectURL(croppedImage));
      setInputToggle(true);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  const onClose = useCallback(() => {
    setValue("img", null);
  }, []);
  const onBackClick = () => {
    if (inputToggle) {
      setInputToggle(false);
      return;
    }
  };
  return (
    <>
      {chatMatch && (
        <>
          <Overlay onClick={onOverlayClick} key={1} />
          <Wrap>
            <Contents style={{ top: scrollY.get() + 80 }}>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={(e) => checkKeyDown(e)}
              >
                <Header>
                  <div onClick={inputToggle ? onBackClick : onOverlayClick}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                    </svg>
                  </div>
                  <div>새 게시물 만들기</div>
                  <div>
                    {inputToggle ? (
                      <button>공유</button>
                    ) : (
                      <div onClick={showCroppedImage}>다음</div>
                    )}
                  </div>
                </Header>
                {inputToggle ? (
                  <>
                    <UserInfo>
                      <div>
                        <img src={user?.photoURL}></img>
                        <span>{user?.displayName}</span>
                      </div>
                    </UserInfo>
                    <ContentInput>
                      <input
                        {...register("descript")}
                        type="text"
                        placeholder="내용 입력... (22자 미만)"
                      />
                      <TagBox>
                        {tagList &&
                          tagList.map((data: string, index: number) => (
                            <Tag key={index} onClick={() => onTagDel(data)}>
                              {data}
                            </Tag>
                          ))}
                        <input
                          {...register("tag")}
                          type="text"
                          value={watch("tag") || ""}
                          onKeyUp={onKeyUp}
                          placeholder="해시태그 입력... (엔터로 구분)"
                        ></input>
                      </TagBox>
                      <ImgWrap>
                        <div>이미지 미리보기</div>
                        <img src={imgPath} />
                      </ImgWrap>
                    </ContentInput>
                  </>
                ) : (
                  <>
                    <ImgUpload>
                      <input
                        {...register("img")}
                        style={{ display: "none" }}
                        type="file"
                        ref={inputOpenImageRef}
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleUploadImage}
                      ></input>
                      <div>
                        {imgPath == "" ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 640 512"
                            >
                              <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                            </svg>
                          </>
                        ) : (
                          <CropWrap>
                            <Cropper
                              image={imgPath}
                              crop={crop}
                              zoom={zoom}
                              aspect={3 / 3}
                              onCropChange={setCrop}
                              onCropComplete={onCropComplete}
                              onZoomChange={setZoom}
                              objectFit="contain"
                            />
                          </CropWrap>
                        )}
                      </div>
                      <ImgChoice onClick={handleOpenImageRef}>
                        컴퓨터에서 사진 선택
                      </ImgChoice>
                    </ImgUpload>
                  </>
                )}
              </Form>
            </Contents>
          </Wrap>
        </>
      )}
    </>
  );
}

export default HealthCreateModal;
