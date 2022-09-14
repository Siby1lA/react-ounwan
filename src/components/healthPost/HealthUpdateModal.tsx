import styled from "styled-components";
import { PathMatch, useMatch, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useScroll } from "framer-motion";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { fireSotreDB } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
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
  height: 700px;
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
function HealthUpdateModal() {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const { scrollY } = useScroll();
  const user = useSelector((state: any) => state.User.currentUser);
  const [imgPath, setImgPath] = useState("");
  const [tagList, setTagList] = useState<any>([]);
  const boxData = useSelector((state: any) => state.User.boxData);
  const { register, handleSubmit, watch, setValue } = useForm<UForm>();
  const chatMatch: PathMatch<string> | null = useMatch("/:type/update/:id");
  if (chatMatch) {
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
    // document.body.style.overflow = "unset";
    navigate(-1);
    setValue("descript", "");
    setImgPath("");
    setTagList("");
    setValue("tag", "");
    setValue("img", null);
  };
  const onSubmit = async (data: UForm) => {
    try {
      const postRef = doc(fireSotreDB, "health", `${id}`);
      setDoc(
        postRef,
        {
          description: data.descript,
          tagList: tagList,
        },
        { merge: true }
      );
      alert("수정되었습니다.");
      onOverlayClick();
    } catch (error) {
      console.log(error);
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
                    <button>수정</button>
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
                  <ImgWrap>
                    <div>이미지 미리보기</div>
                    <img src={imgPath} />
                  </ImgWrap>
                </ContentInput>
              </Form>
            </Contents>
          </Wrap>
        </>
      )}
    </>
  );
}

export default HealthUpdateModal;
