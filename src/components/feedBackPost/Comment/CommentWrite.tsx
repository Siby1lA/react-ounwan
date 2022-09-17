import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import styled from "styled-components";

const CommentBox = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
`;
const Comment = styled.div`
  border-top: 1px solid ${(props) => props.theme.headerColor};
  form {
    padding: 5px;
    display: flex;
    align-items: center;
    input {
      border: none;
      width: 90%;
      padding: 10px;
      background-color: ${(props) => props.theme.bgColor};
      &:focus {
        outline: none;
      }
      color: ${(props) => props.theme.textColor};
    }
    div {
      width: 10%;
      display: flex;
      align-items: center;
      justify-content: center;
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
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ICommentWrite>();
  const onSubmit = ({ comment }: any) => {
    console.log(comment);
  };
  const handleChange = (e: any) => {
    setValue("comment", e.target.value);
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
          <div onClick={onSubmit}>게시</div>
        </form>
      </Comment>
    </CommentBox>
  );
}

export default CommentWrite;
