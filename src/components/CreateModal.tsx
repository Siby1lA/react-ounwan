import styled from "styled-components";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useScroll } from "framer-motion";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { push, ref, set } from "firebase/database";
import { dbService } from "../firebase";
import { uid } from "uid";

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
    :first-child {
      height: 40px;
    }
    :last-child {
      height: 50px;
    }
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
interface UForm {
  title: string;
  descript: string;
}
function CreateModal() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const user = useSelector((state: any) => state.User.currentUser);
  const [imgPath, setImgPath] = useState("");
  const Post = ref(dbService, "health");
  const { register, handleSubmit, watch, setValue } = useForm<UForm>();
  const chatMatch: PathMatch<string> | null = useMatch("/:type/create");
  if (chatMatch) {
    // document.body.style.overflow = "hidden";
  }

  const onOverlayClick = () => {
    document.body.style.overflow = "unset";
    navigate(-1);
    setValue("title", "");
    setValue("descript", "");
    setImgPath("");
  };
  const inputOpenImageRef = useRef<any>();
  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };
  const handleUploadImage = async (event: any) => {
    setImgPath(URL.createObjectURL(event.target.files[0]));
  };
  const onSubmit = async (data: UForm) => {
    if (imgPath) {
      const uuid = uid();
      try {
        await set(ref(dbService, `health/${uuid}`), {
          id: uuid,
          Title: data.title,
          description: data.descript,
          image: imgPath,
          createBy: {
            displayName: user.displayName,
            image: user.photoURL,
          },
        });
        alert("작성되었습니다.");
        onOverlayClick();
      } catch (error: any) {
        console.log(error);
      }
    } else {
      console.log("이미지 를 넣어주세요");
    }
  };
  return (
    <>
      {chatMatch && (
        <>
          <Overlay onClick={onOverlayClick} key={1} />
          <Wrap>
            <Contents style={{ top: scrollY.get() + 80 }}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Header>
                  <div onClick={onOverlayClick}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                    </svg>
                  </div>
                  <div>새 게시물 만들기</div>
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
                    {...register("title")}
                    type="text"
                    placeholder="제목 입력..."
                  />
                  <input
                    {...register("descript")}
                    type="text"
                    placeholder="내용 입력..."
                  />
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
            <input
              style={{ display: "none" }}
              type="file"
              ref={inputOpenImageRef}
              accept="image/jpeg, image/png"
              onChange={handleUploadImage}
            ></input>
          </Wrap>
        </>
      )}
    </>
  );
}

export default CreateModal;
