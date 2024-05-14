import { CreateForm } from "./create-form";

export const CreatePost = () => {
  return (
    <div className="pageContent flexbox">
      <div data-aos="zoom-in" className="glowingBox flexbox">
        <p className="titleBox">Create Post</p>
        <CreateForm />
      </div>
    </div>
  );
};
