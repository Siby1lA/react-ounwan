import styled from "styled-components";
import { PathMatch, useMatch, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { dbService, storageService } from "../../firebase";
import { uid } from "uid";
import {
  getDownloadURL,
  ref as strRef,
  uploadBytesResumable,
} from "firebase/storage";
import { setBox } from "../../redux/actions/UserAction";

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
  background-color: white;
  border-radius: 10px;
  width: 625px;
  height: 600px;
  /* 777px 시 vw로 변경 */
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
  }
  div:last-child {
  }
  button {
    color: #0095f6;
    font-size: 16px;
    cursor: pointer;
    border: none;
    background-color: white;
  }
`;
const ImgUpload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  svg {
    width: 180px;
    fill: #183052;
    margin-bottom: 20px;
  }
  div:last-child {
    padding: 7px;
    border-radius: 3px;
    background-color: #0095f6;
    margin-top: 15px;
    color: white;
    font-weight: 400;
    font-size: 16px;
    cursor: pointer;
  }
  img {
    width: 220px;
  }
`;
const ContentInput = styled.div`
  padding: 0px 20px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  input {
    border: none;
    border-bottom: 2px solid #eee;
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
      border-radius: 50%;
      margin-right: 10px;
    }
  }
`;

const TagBox = styled.div`
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
  cursor: pointer;
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
interface UForm {
  descript: string;
  tag: string;
  img: any;
}
function UpdateModal() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const user = useSelector((state: any) => state.User.currentUser);
  const boxData = useSelector((state: any) => state.User.boxData);

  const [imgPath, setImgPath] = useState("");
  const [tagList, setTagList] = useState<any>([]);
  const [uploadImage, setUploadImage] = useState(false);
  const [updateData, setUpdateData] = useState([]);

  const dispatch = useDispatch();
  const { register, handleSubmit, watch, setValue } = useForm<UForm>();
  const chatMatch: PathMatch<string> | null = useMatch("/:type/update/:id");

  if (chatMatch !== null && id !== undefined) {
    // document.body.style.overflow = "hidden";
  }
  useEffect(() => {
    if (boxData) {
      setValue("descript", boxData.description);
      setTagList(boxData.tagList);
      setImgPath(boxData.image);
      setValue("img", boxData.originalImage);
    }
  }, [boxData]);
  const onOverlayClick = () => {
    document.body.style.overflow = "unset";
    navigate(-1);
    dispatch(setBox(null));
    setValue("descript", "");
    setImgPath("");
    setTagList("");
    setValue("tag", "");
  };
  const inputOpenImageRef = useRef<any>();
  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };
  const handleUploadImage = async (event: any) => {
    setUploadImage(true);
    setImgPath(URL.createObjectURL(event.target.files[0]));
    setValue("img", event.target.files[0]);
  };
  const onSubmit = async (data: UForm) => {
    if (imgPath) {
      try {
        // storage에 저장
        if (uploadImage) {
          const uploadImg = uploadBytesResumable(
            strRef(storageService, `health/img/${uid()}`),
            data.img
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
                update(child(ref(dbService), `health/${boxData.id}`), {
                  timestamp: String(new Date()),
                  description: data.descript,
                  image: downloadURL,
                  tagList: tagList,
                });
              });
            }
          );
        } else {
          update(child(ref(dbService), `health/${boxData.id}`), {
            // timestamp: String(new Date()),
            description: data.descript,
            tagList: tagList,
          });
        }

        alert("작성되었습니다.");
        onOverlayClick();
      } catch (error: any) {
        console.log(error);
      }
    } else {
      alert("이미지 를 넣어주세요");
    }
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
  return (
    <>
      {chatMatch && (
        <>
          <Overlay onClick={onOverlayClick} key={1} />
          {boxData && (
            <Wrap>
              <Contents style={{ top: scrollY.get() + 80 }}>
                <Form
                  onSubmit={handleSubmit(onSubmit)}
                  onKeyDown={(e) => checkKeyDown(e)}
                >
                  <Header>
                    <div onClick={onOverlayClick}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                      </svg>
                    </div>
                    <div>게시물 수정</div>
                    <div>
                      <button>공유</button>
                    </div>
                  </Header>
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
                      placeholder="내용 입력..."
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

                    <input
                      {...register("img")}
                      style={{ display: "none" }}
                      type="file"
                      ref={inputOpenImageRef}
                      accept="image/*"
                      onChange={handleUploadImage}
                    ></input>
                  </ContentInput>
                  <ImgUpload>
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
                        <>
                          <img src={imgPath} />
                        </>
                      )}
                    </div>
                    <div onClick={handleOpenImageRef}>컴퓨터에서 사진 선택</div>
                  </ImgUpload>
                </Form>
              </Contents>
            </Wrap>
          )}
        </>
      )}
    </>
  );
}

export default UpdateModal;
