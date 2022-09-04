import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
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
      &:focus {
      }
    }
    button {
      margin-top: 15px;
      background-color: #4e5154;
    }
  }
`;

interface IForm {
  email: string;
  nickname: string;
  password: string;
  password_confirm: string;
}
function Register() {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IForm>();
  const onSubmit = ({
    email,
    nickname,
    password,
    password_confirm,
  }: IForm) => {};
  return (
    <Wrap>
      <Header>회원가입</Header>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>이메일</label>
          <input
            type="email"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          />
          {errors.email && <p>이메일 입력은 필수입니다.</p>}
          <label>닉네임</label>
          <input {...register("nickname", { required: true, maxLength: 10 })} />
          {errors.nickname && errors.nickname.type === "required" && (
            <p>닉네임 입력은 필수입니다.</p>
          )}
          {errors.nickname && errors.nickname.type === "maxLength" && (
            <p>닉네임 크기는 10자 미만입니다.</p>
          )}
          <label>비밀번호</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
          />
          {errors.password && errors.password.type === "required" && (
            <p>비밀번호는 필수입니다.</p>
          )}

          {errors.password && errors.password.type === "minLength" && (
            <p>비밀번호는 6자 이상이어야 합니다.</p>
          )}
          <label>비밀번호 재입력</label>
          <input
            type="password"
            {...register("password_confirm", {
              required: true,
              validate: (value) => value === watch("password"),
            })}
          />
          {errors.password_confirm &&
            errors.password_confirm.type === "required" && (
              <p>비밀번호 재입력은 필수입니다.</p>
            )}

          {errors.password_confirm &&
            errors.password_confirm.type === "validate" && (
              <p>비밀번호가 일치하지 않습니다.</p>
            )}
          <button>로그인</button>
        </form>
      </Box>
    </Wrap>
  );
}

export default Register;
