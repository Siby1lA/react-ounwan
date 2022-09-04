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
const Footer = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  div:nth-child(2) {
    display: flex;
    flex-direction: column;
    button {
      width: 330px;
      :first-child {
        background-color: #616161;
      }
      :last-child {
        background-color: #536dfe;
        margin-top: 20px;
      }
    }
  }
`;
const Line = styled.div`
  width: 450px;
  height: 2px;
  background-color: #616161;
  margin: 30px;
`;
const Create = styled.div`
  position: absolute;
  right: 0;
  margin-right: 30px;
  margin-top: 5px;
  font-size: 14px;
  font-weight: 400;
  color: gray;
  cursor: pointer;
`;
interface IForm {
  email: string;
  password: string;
}
function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm<IForm>();
  const onSubmit = ({ email, password }: IForm) => {};
  return (
    <Wrap>
      <Header>로그인</Header>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>이메일</label>
          <input {...register("email")} type="email" />
          <label>비밀번호</label>
          <input {...register("password")} type="password" />
          <button>로그인</button>
        </form>
        <Create onClick={() => navigate(`/register`)}>회원가입...</Create>
      </Box>
      <Footer>
        <Line></Line>
        <div>
          <button>구글 로그인</button>
          <button>페이스북 로그인</button>
        </div>
      </Footer>
    </Wrap>
  );
}

export default Login;
