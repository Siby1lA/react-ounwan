import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { authService } from "../firebase";
import useOutSideRef from "../hooks/useOutSideRef";
import {
  setDarkMode,
  setDropDownOpen,
  setLoading,
} from "../redux/actions/TriggerAction";
import { clearUser } from "../redux/actions/UserAction";
import ProgressBar from "@ramonak/react-progress-bar";
const Wrap = styled.div`
  position: sticky;
  top: 0px;
  z-index: 1;
  background-color: ${(props) => props.theme.headerColor};
  width: 100%;
  height: 65px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  display: flex;
  justify-content: center;
  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    @media screen and (max-width: 583px) {
      width: 22px;
      height: 22px;
    }
  }
`;
const Nav = styled.div`
  width: 90vw;
  min-width: 550px;
  @media screen and (max-width: 583px) {
    min-width: 0px;
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;
const Logo = styled.h1`
  font-weight: 500;
  font-size: 28px;
  color: ${(props) => props.theme.textColor};
  @media screen and (max-width: 583px) {
    font-size: 20px;
  }
`;
const Category = styled.div`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
  ul {
    display: flex;
    li {
      font-size: 17px;
      cursor: pointer;
      margin-right: 30px;
      @media screen and (max-width: 583px) {
        margin-right: 15px;
      }
      :last-child {
        margin-right: 0px;
      }
      :hover {
        transform: scale(1.1);
        color: #3f51b5;
      }
      @media screen and (max-width: 583px) {
        font-size: 15px;
      }
    }
  }
`;
const Set = styled.div`
  display: flex;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 50%;
    margin-right: 15px;
    @media screen and (max-width: 583px) {
      margin-right: 7px;
    }
    :last-child {
      margin-right: 0px;
    }
    svg {
      width: 25px;
      fill: ${(props) => props.theme.textColor};
      @media screen and (max-width: 583px) {
        width: 22px;
      }
    }
    cursor: pointer;
    :hover {
      background-color: #eee;
    }
  }
`;
const Ul = styled.ul`
  position: absolute;
  right: 0;
  margin-top: 130px;
  border-radius: 5px;
  border: 2px solid #eee;
  background-color: ${(props) => props.theme.bgColor};
  width: 100px;
  li {
    padding: 10px;
    font-size: 14px;
    font-weight: 300;
    color: ${(props) => props.theme.textColor};
    cursor: pointer;
    :first-child {
      border-bottom: 2px solid #eee;
    }
    :hover {
      background-color: #eee;
    }
  }
`;
const ProgressWrap = styled.div`
  position: absolute;
  bottom: -22px;
  width: 80vw;
`;
function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDropOpen = useSelector((state: any) => state.Trigger.isDropOpen);
  const isDarkMode = useSelector((state: any) => state.Trigger.isDarkMode);
  const loading = useSelector((state: any) => state.Trigger.isLoading);
  const user = useSelector((state: any) => state.User.currentUser);

  const outsideRef = useOutSideRef();
  const onLogout = () => {
    dispatch(clearUser());
    authService.signOut();
  };

  if (loading === 100) {
    alert("업로드 완료");
    dispatch(setLoading(0));
  }
  const themeToggle = () => {
    if (isDarkMode) {
      dispatch(setDarkMode(false));
      window.localStorage.setItem("app_theme", "false");
    } else {
      dispatch(setDarkMode(true));
      window.localStorage.setItem("app_theme", "true");
    }
  };
  return (
    <Wrap>
      <Nav>
        <Logo
          onClick={() =>
            user ? navigate(`/${"오운완"}`) : alert("로그인은 필수입니다.")
          }
        >
          오운완!
        </Logo>
        <Category>
          <ul>
            <li
              onClick={() =>
                user ? navigate(`/${"오운완"}`) : alert("로그인은 필수입니다.")
              }
            >
              오운완
            </li>
            <li
              onClick={() =>
                user ? navigate(`/${"피드백"}`) : alert("로그인은 필수입니다.")
              }
            >
              피드백
            </li>
          </ul>
        </Category>
        <Set>
          {/* <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" />
            </svg>
          </div> */}
          <div onClick={themeToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M448 256c0-106-86-192-192-192V448c106 0 192-86 192-192zm64 0c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256z" />
            </svg>
          </div>
          <div
            ref={outsideRef}
            onClick={() =>
              isDropOpen
                ? dispatch(setDropDownOpen(false))
                : dispatch(setDropDownOpen(true))
            }
          >
            {user ? (
              <img src={user.photoURL} />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 112c-48.6 0-88 39.4-88 88C168 248.6 207.4 288 256 288s88-39.4 88-88C344 151.4 304.6 112 256 112zM256 240c-22.06 0-40-17.95-40-40C216 177.9 233.9 160 256 160s40 17.94 40 40C296 222.1 278.1 240 256 240zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-46.73 0-89.76-15.68-124.5-41.79C148.8 389 182.4 368 220.2 368h71.69c37.75 0 71.31 21.01 88.68 54.21C345.8 448.3 302.7 464 256 464zM416.2 388.5C389.2 346.3 343.2 320 291.8 320H220.2c-51.36 0-97.35 26.25-124.4 68.48C65.96 352.5 48 306.3 48 256c0-114.7 93.31-208 208-208s208 93.31 208 208C464 306.3 446 352.5 416.2 388.5z" />
              </svg>
            )}
          </div>
        </Set>
        {isDropOpen && (
          <Ul>
            {user ? (
              <>
                <li onClick={() => navigate("/profile")}>프로필</li>
                <li onClick={onLogout}>로그아웃</li>
              </>
            ) : (
              <>
                <li
                  onClick={() => {
                    if (user !== null) navigate("/login");
                  }}
                >
                  로그인
                </li>
                <li
                  onClick={() => {
                    if (user !== null) navigate("/register");
                  }}
                >
                  회원가입
                </li>
              </>
            )}
          </Ul>
        )}
      </Nav>
      <ProgressWrap>
        {loading !== 0 && loading !== 100 && (
          <ProgressBar completed={loading} />
        )}
      </ProgressWrap>
    </Wrap>
  );
}

export default Header;
