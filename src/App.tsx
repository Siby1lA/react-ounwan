import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Routes/Home";
import Login from "./Routes/Auth/Login";
import Register from "./Routes/Auth/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authService } from "./firebase";
import { clearUser, setUser } from "./redux/actions/UserAction";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.User.isLoading);
  useEffect(() => {
    authService.onAuthStateChanged((user: string) => {
      if (user) {
        navigate("/헬스");
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
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/:type" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    );
  }
}

export default App;
