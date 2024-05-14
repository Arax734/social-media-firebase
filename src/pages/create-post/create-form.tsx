import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

interface CreateFormData {
  title: string;
  description: string;
}

export const CreateForm = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    title: yup.string().required("Missing title"),
    description: yup.string().required("Missing description"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: yupResolver(schema),
  });

  const postsRef = collection(db, "posts");

  const onCreatePost = async (data: CreateFormData) => {
    await addDoc(postsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
      publishDate: serverTimestamp(),
    });
    navigate("/");
  };

  return (
    <form className="flexbox" onSubmit={handleSubmit(onCreatePost)}>
      <FloatingLabel
        controlId="floatingInput"
        label="Title"
        className="mb-3 formFieldHolder"
      >
        <Form.Control
          className="formField"
          type="text"
          placeholder="Title"
          {...register("title")}
        />
      </FloatingLabel>
      <p>{errors.title?.message}</p>
      <FloatingLabel
        controlId="floatingTextarea2"
        label="Description"
        className="formFieldHolder"
      >
        <Form.Control
          className="formField"
          as="textarea"
          placeholder="Description"
          style={{ height: "100px" }}
          {...register("description")}
        />
      </FloatingLabel>
      <p>{errors.description?.message}</p>

      <input type="submit" value="Publish" />
    </form>
  );
};
