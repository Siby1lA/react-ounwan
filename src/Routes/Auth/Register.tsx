import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { authService, fireSotreDB } from "../../firebase";
import md5 from "md5";
import { addDoc, collection } from "firebase/firestore";
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
  nickname: string;
  password: string;
  password_confirm: string;
}
function Register() {
  const navigate = useNavigate();
  const [ladoing, setLoading] = useState(false);
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IForm>();
  const onSubmit = async (data: IForm) => {
    try {
      setLoading(true);
      // ???????????? ??????
      const createdUser: any = await createUserWithEmailAndPassword(
        authService,
        data.email,
        data.password
      );
      // ?????? ?????? ?????? ??????
      await updateProfile(authService.currentUser, {
        displayName: data.nickname,
        photoURL: `http://gravatar.com/avatar/${md5(
          createdUser.user.email
        )}?d=identicon`,
      });

      //db??? ??????
      const userRef = collection(fireSotreDB, "users");
      addDoc(userRef, {
        displayName: createdUser.user.displayName,
        image: createdUser.user.photoURL,
        uid: createdUser.user.uid,
      });
    } catch (error: any) {
      setErrorFromSubmit(error.message);
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 5000);
    }
  };
  return (
    <Wrap>
      <Header>????????????</Header>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>?????????</label>
          <input
            type="email"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          />
          {errors.email && <p>????????? ????????? ???????????????.</p>}
          <label>?????????</label>
          <input {...register("nickname", { required: true, maxLength: 10 })} />
          {errors.nickname && errors.nickname.type === "required" && (
            <p>????????? ????????? ???????????????.</p>
          )}
          {errors.nickname && errors.nickname.type === "maxLength" && (
            <p>????????? ????????? 10??? ???????????????.</p>
          )}
          <label>????????????</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
          />
          {errors.password && errors.password.type === "required" && (
            <p>??????????????? ???????????????.</p>
          )}

          {errors.password && errors.password.type === "minLength" && (
            <p>??????????????? 6??? ??????????????? ?????????.</p>
          )}
          <label>???????????? ?????????</label>
          <input
            type="password"
            {...register("password_confirm", {
              required: true,
              validate: (value) => value === watch("password"),
            })}
          />
          {errors.password_confirm &&
            errors.password_confirm.type === "required" && (
              <p>???????????? ???????????? ???????????????.</p>
            )}

          {errors.password_confirm &&
            errors.password_confirm.type === "validate" && (
              <p>??????????????? ???????????? ????????????.</p>
            )}
          {errorFromSubmit && <p>{errorFromSubmit}</p>}
          <button>?????????</button>
        </form>
      </Box>
    </Wrap>
  );
}

export default Register;
