import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    navigate("/");
  };

  return (
    <div className="pageContent flexbox">
      <div className="holder flexbox">
        <div data-aos="zoom-in" className="glowingBox flexbox">
          <p>Choose an option to Sign In</p>
          <Button onClick={signInWithGoogle} variant="info">
            Sign In With Google
          </Button>
        </div>
      </div>
    </div>
  );
};
