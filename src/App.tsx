import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Routes/Home";
import Login from "./Routes/Auth/Login";
import Register from "./Routes/Auth/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authService } from "./firebase";
import { clearUser, setUser } from "./redux/actions/UserAction";
import Profile from "./Routes/Profile";
import Header from "./components/Header";
import { ThemeProvider } from "styled-components";

import { darkTheme, lightTheme } from "./theme";
import UserProfile from "./Routes/UserProfile";
function App() {
  const isDarkMode = useSelector((state: any) => state.Trigger.isDarkMode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.User.isLoading);
  useEffect(() => {
    authService.onAuthStateChanged((user: string) => {
      if (user) {
        navigate("/오운완");
        dispatch(setUser(user));
      } else {
        navigate("/login");
        dispatch(clearUser());
      }
    });
  }, []);
  if (isLoading) {
    return <div>로딩중...</div>;
  } else {
    return (
      <>
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
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
            <Route path="/profile" element={<Profile />}></Route>
          </Routes>
        </ThemeProvider>
      </>
    );
  }
}

export default App;
