import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "react-bootstrap";
import { signOut } from "firebase/auth";

export const Burger = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const signUserOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="linkBoxBurger flexbox">
      <Link to="/" className="navLinkBurger flexbox">
        Home
      </Link>
      {user ? (
        <>
          <Link to="/createpost" className="navLinkBurger flexbox">
            Create
          </Link>
        </>
      ) : (
        <Link to="/login" className="navLinkBurger flexbox">
          Login
        </Link>
      )}
    </div>
  );
};
