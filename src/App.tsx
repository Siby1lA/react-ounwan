import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Routes/Home";
import Login from "./Routes/Auth/Login";
import Register from "./Routes/Auth/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { authService, fireSotreDB } from "./firebase";
import {
  clearUser,
  setUser,
  userOunwanCount,
  userPostData,
} from "./redux/actions/UserAction";
import Profile from "./Routes/Profile";
import Header from "./components/Header";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import UserProfile from "./Routes/UserProfile";
import GlobalStyles from "./GlobalStyles";
import PasswordReset from "./Routes/Auth/PasswordReset";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
function App() {
  const [theme, setTheme] = useState<any>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.Trigger.isDarkMode);
  useEffect(() => {
    authService.onAuthStateChanged((user: any) => {
      if (user) {
        navigate("/오운완");
        dispatch(setUser(user));
        let healthData = query(
          collection(fireSotreDB, "health"),
          orderBy("timestamp", "desc")
        );
        onSnapshot(healthData, (snapShot) => {
          const list: any = snapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // 내 게시글
          const filterData = list.filter(
            (data: any) => data.createBy.uid === user.uid
          );
          const postDate = filterData.map(
            (data: any) =>
              String(data.timestamp.toDate().getFullYear()) +
              "-" +
              String(
                ("0" + (data.timestamp.toDate().getMonth() + 1)).slice(-2)
              ) +
              "-" +
              String(("0" + data.timestamp.toDate().getDate()).slice(-2))
          );
          dispatch(
            userOunwanCount(
              postDate.filter((element: any, index: any) => {
                return postDate.indexOf(element) === index;
              })
            )
          );
          const result: any = {};
          postDate.forEach((x: any) => {
            result[x] = (result[x] || 0) + 1;
          });
          dispatch(userPostData(result));
        });
      } else {
        navigate("/login");
        dispatch(clearUser());
      }
    });
  }, []);
  useEffect(() => {
    setTheme(window.localStorage.getItem("app_theme") === "true");
  }, [isDarkMode]);

  return (
    <>
      <ThemeProvider theme={theme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/:type" element={<Home />}></Route>
          <Route path="/:type/create" element={<Home />}></Route>
          <Route path="/:type/update/:id" element={<Home />}></Route>
          <Route path="/:type/view/:id" element={<Home />}></Route>
          <Route
            path="/:type/userprofile/:id"
            element={<UserProfile />}
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/password" element={<PasswordReset />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
