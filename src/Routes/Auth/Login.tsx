import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { authService, fireSotreDB } from "../../firebase";

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
`;
const Header = styled.h1`
  font-weight: 600;
  font-size: 30px;
  margin-bottom: 20px;
`;
const Box = styled.div`
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
    0 8px 16px -8px rgba(0, 0, 0, 0.1), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
  div {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
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
      @media screen and (max-width: 587px) {
        width: 65vw;
      }
      margin-bottom: 10px;
      border: 2px solid #4e5154;
      border-radius: 5px;
      &:focus {
      }
    }
    button {
      width: 100%;
      margin-top: 15px;
      background-color: #4e5154;
      @media screen and (max-width: 587px) {
        width: 65vw;
        height: 45px;
      }
    }
  }
`;
const Footer = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  div:first-child {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    button {
      width: 330px;
      @media screen and (max-width: 587px) {
        width: 55vw;
        height: 45px;
      }
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

const Etc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: gray;
  cursor: pointer;
`;
const ErMsg = styled.span`
  color: tomato;
`;
interface IForm {
  email: string;
  password: string;
}
function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<IForm>();
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  const onSubmit = async (data: IForm) => {
    try {
      await signInWithEmailAndPassword(authService, data.email, data.password);
    } catch (error: any) {
      if (error.message === "Firebase: Error (auth/user-not-found).") {
        setErrorFromSubmit("???????????? ?????? ??????????????????.");
      } else if (error.message === "Firebase: Error (auth/wrong-password).") {
        setErrorFromSubmit("????????? ?????????????????????.");
      }
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 7000);
    }
  };
  const onSosicalLogin = async (event: any) => {
    const {
      target: { name },
    } = event;
    if (name === "google") {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(authService, provider).then(async (data) => {
        //db??? ?????? ????????? ????????????????????? ??????
        const userData = await getDocs(collection(fireSotreDB, "users"));
        let userId: any[] = [];
        userData.forEach((doc) => {
          userId.push({ id: doc.id, ...doc.data() });
        });
        const filter = userId.filter((val) => val.uid === data.user.uid);
        //db??? ?????? ????????? ????????? ??????
        if (filter[0] == undefined) {
          const userRef = collection(fireSotreDB, "users");
          addDoc(userRef, {
            displayName: data.user.displayName,
            image: data.user.photoURL,
            uid: data.user.uid,
          });
        }
      });
      navigate("/?????????");
    } else if (name === "facebook") {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(authService, provider);
    }
  };
  return (
    <Wrap>
      <Header>?????????</Header>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>?????????</label>
          <input {...register("email")} type="email" />
          <label>????????????</label>
          <input {...register("password")} type="password" />
          <ErMsg>{errorFromSubmit}</ErMsg>
          <button>?????????</button>
        </form>
        <div>
          <Etc onClick={() => navigate(`/password`)}>???????????? ??????</Etc>
          <Etc onClick={() => navigate(`/register`)}>????????????...</Etc>
        </div>
      </Box>
      <Footer>
        <div>
          <button name="google" onClick={onSosicalLogin}>
            ?????? ?????????
          </button>
          <button name="facebook" onClick={onSosicalLogin}>
            ???????????? ?????????
          </button>
        </div>
      </Footer>
    </Wrap>
  );
}

export default Login;
