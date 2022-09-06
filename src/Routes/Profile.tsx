import { useSelector } from "react-redux";

function Profile() {
  const user = useSelector((state: any) => state.User.currentUser);
  return (
    <div>
      <div>{user?.displayName}</div>
      <div>
        <img src={user?.photoURL}></img>
      </div>
    </div>
  );
}

export default Profile;
