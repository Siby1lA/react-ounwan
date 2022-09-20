import { doc, setDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { fireSotreDB } from "../../../firebase";

const CommentBox = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: 100%;
  position: absolute;
  bottom: 0;
`;
const Comment = styled.div`
  border-top: 1px solid ${(props) => props.theme.borderColor};
  form {
    padding: 5px;
    display: flex;
    align-items: center;
    input {
      border: none;
      width: 80%;
      padding: 10px;
      background-color: ${(props) => props.theme.bgColor};
      &:focus {
        outline: none;
      }
      color: ${(props) => props.theme.textColor};
    }
    button {
      background-color: ${(props) => props.theme.bgColor};
      border: none;
      width: 15%;
      color: #0095f6;
      font-weight: 400;
      font-size: 14px;
    }
  }
`;
const ProfileImg = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;
interface ICommentWrite {
  comment: string;
}
function CommentWrite() {
  const user = useSelector((state: any) => state.User.currentUser);
  const { id } = useParams();
  const boxData = useSelector((state: any) => state.User.boxData);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ICommentWrite>();
  const onSubmit = async (data: ICommentWrite) => {
    setValue("comment", "");
    const postRef = doc(fireSotreDB, "feedback", `${id}`);
    await setDoc(
      postRef,
      {
        comment: [
          ...boxData.comment,
          {
            timestamp: new Date(),
            comment: data.comment,
            createBy: {
              displayName: user.displayName,
              image: user.photoURL,
              uid: user.uid,
            },
          },
        ],
      },
      { merge: true }
    );
  };

  return (
    <CommentBox>
      <Comment>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ProfileImg src={user.photoURL} />
          <input
            {...register("comment")}
            type="text"
            placeholder="피드백 달기..."
          />
          <button>게시</button>
        </form>
      </Comment>
    </CommentBox>
  );
}

export default CommentWrite;
