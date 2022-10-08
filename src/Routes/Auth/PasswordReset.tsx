import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { authService } from "../../firebase";
const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  color: ${(props) => props.theme.textColor};
  button {
    color: white;
    font-size: 14px;
    width: 370px;
    height: 50px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  p {
    color: red;
    margin-bottom: 10px;
  }
`;
const Header = styled.h1`
  font-weight: 600;
  font-size: 30px;
  margin-bottom: 20px;
`;
const Box = styled.div`
  position: relative;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
    0 8px 16px -8px rgba(0, 0, 0, 0.1), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
  form {
    label {
      font-weight: 400;
      margin-bottom: 10px;
    }
    display: flex;
    flex-direction: column;
    input {
      width: 370px;
      height: 40px;
      margin-bottom: 10px;
      border: 2px solid #4e5154;
      border-radius: 5px;
      @media screen and (max-width: 587px) {
        width: 65vw;
      }
      &:focus {
      }
    }
    button {
      margin-top: 15px;
      background-color: #4e5154;
      @media screen and (max-width: 587px) {
        width: 65vw;
      }
    }
  }
`;

interface IForm {
  email: string;
}
function PasswordReset() {
  const navigate = useNavigate();
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IForm>();
  const onSubmit = async (data: IForm) => {
    sendPasswordResetEmail(authService, data.email)
      .then(() => {
        alert("새로운 비밀번호를 이메일로 보내드렸습니다.");
        navigate(-1);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  return (
    <Wrap>
      <Header>비밀번호 찾기</Header>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>이메일</label>
          <input
            type="email"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          />
          {errors.email && <p>이메일 입력은 필수입니다.</p>}
          {errorFromSubmit && <p>{errorFromSubmit}</p>}
          <button>비밀번호 찾기</button>
        </form>
      </Box>
    </Wrap>
  );
}

export default PasswordReset;
