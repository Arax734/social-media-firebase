import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { Post as IPost } from "./main";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Props {
  post: IPost;
}

interface Like {
  likeId: string;
  userId: string;
}

export const Post = (props: Props) => {
  const { post } = props;
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState<Like[] | null>(null);
  const [dislikes, setDislikes] = useState<Like[] | null>(null);
  const [cookieConsent, setCookieConsent] = useState(
    Cookies.get("cookieConsent")
  );

  const likesRef = collection(db, "likes");
  const dislikesRef = collection(db, "dislikes");

  const likesDoc = query(likesRef, where("postId", "==", post.id));
  const dislikesDoc = query(dislikesRef, where("postId", "==", post.id));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };

  const getDislikes = async () => {
    const data = await getDocs(dislikesDoc);
    setDislikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };

  const addLike = async () => {
    try {
      if (hasUserDisliked) {
        await removeDislike();
      }

      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user?.uid, likeId: newDoc.id }]
            : [{ userId: user?.uid, likeId: newDoc.id }]
        );
        if (user && cookieConsent === "true") {
          const likedPostsStr = Cookies.get("liked_posts");
          const likedPosts = likedPostsStr ? JSON.parse(likedPostsStr) : [];
          const updatedLikedPosts = [...likedPosts, post.title];

          Cookies.set("liked_posts", JSON.stringify(updatedLikedPosts));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );

      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);
      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
      if (user && cookieConsent === "true") {
        const likedPostsStr = Cookies.get("liked_posts");
        const likedPosts = likedPostsStr ? JSON.parse(likedPostsStr) : [];
        const updatedLikedPosts = likedPosts.filter(
          (title: string) => title !== post.title
        );
        Cookies.set("liked_posts", JSON.stringify(updatedLikedPosts));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addDislike = async () => {
    try {
      if (hasUserLiked) {
        await removeLike();
      }

      const newDoc = await addDoc(dislikesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setDislikes((prev) =>
          prev
            ? [...prev, { userId: user?.uid, likeId: newDoc.id }]
            : [{ userId: user?.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeDislike = async () => {
    try {
      const dislikeToDeleteQuery = query(
        dislikesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );

      const dislikeToDeleteData = await getDocs(dislikeToDeleteQuery);
      const dislikeId = dislikeToDeleteData.docs[0].id;
      const dislikeToDelete = doc(db, "dislikes", dislikeId);
      await deleteDoc(dislikeToDelete);
      if (user) {
        setDislikes(
          (prev) =>
            prev && prev.filter((dislike) => dislike.likeId !== dislikeId)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  const hasUserDisliked = dislikes?.find(
    (dislike) => dislike.userId === user?.uid
  );

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formattedDate = post.publishDate
    ? formatDate(post.publishDate.toDate())
    : "";

  useEffect(() => {
    getLikes();
    getDislikes();
  }, []);

  return (
    <div data-aos="zoom-in" className="post flexbox">
      <div className="title flexbox">
        <h1>{post.title}</h1>
      </div>
      <div className="body flexbox">
        <a>{post.description}</a>
      </div>
      <div className="footer flexbox">
        <a className="flexbox">@{post.username}</a>
      </div>
      <div className="date flexbox">
        <a className="flexbox">{formattedDate}</a>
      </div>
      <div className="likes flexbox">
        <button onClick={() => (!hasUserLiked ? addLike() : removeLike())}>
          <svg
            className={`${hasUserLiked ? "alreadyLiked" : "like"}`}
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.2694 16.265L20.9749 12.1852C21.1511 11.1662 20.3675 10.2342 19.3345 10.2342H14.1534C13.6399 10.2342 13.2489 9.77328 13.332 9.26598L13.9947 5.22142C14.1024 4.56435 14.0716 3.892 13.9044 3.24752C13.7659 2.71364 13.354 2.28495 12.8123 2.11093L12.6673 2.06435C12.3399 1.95918 11.9826 1.98365 11.6739 2.13239C11.3342 2.29611 11.0856 2.59473 10.9935 2.94989L10.5178 4.78374C10.3664 5.36723 10.146 5.93045 9.8617 6.46262C9.44634 7.24017 8.80416 7.86246 8.13663 8.43769L6.69789 9.67749C6.29223 10.0271 6.07919 10.5506 6.12535 11.0844L6.93752 20.4771C7.01201 21.3386 7.73231 22 8.59609 22H13.2447C16.726 22 19.697 19.5744 20.2694 16.265Z"
              fill="#1C274C"
            />
            <path
              opacity="0.5"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.96767 9.48508C3.36893 9.46777 3.71261 9.76963 3.74721 10.1698L4.71881 21.4063C4.78122 22.1281 4.21268 22.7502 3.48671 22.7502C2.80289 22.7502 2.25 22.1954 2.25 21.5129V10.2344C2.25 9.83275 2.5664 9.5024 2.96767 9.48508Z"
              fill="#1C274C"
            />
          </svg>
        </button>
        {likes ? (
          <a className="likeNumber">{likes?.length}</a>
        ) : (
          <a className="likeNumber">0</a>
        )}
        <button
          onClick={() => (!hasUserDisliked ? addDislike() : removeDislike())}
        >
          <svg
            className={`${hasUserDisliked ? "alreadyDisliked" : "dislike"}`}
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.2694 8.48505L20.9749 12.5648C21.1511 13.5838 20.3675 14.5158 19.3345 14.5158H14.1534C13.6399 14.5158 13.2489 14.9767 13.332 15.484L13.9947 19.5286C14.1024 20.1857 14.0716 20.858 13.9044 21.5025C13.7659 22.0364 13.354 22.465 12.8123 22.6391L12.6673 22.6856C12.3399 22.7908 11.9826 22.7663 11.6739 22.6176C11.3342 22.4539 11.0856 22.1553 10.9935 21.8001L10.5178 19.9663C10.3664 19.3828 10.146 18.8195 9.8617 18.2874C9.44634 17.5098 8.80416 16.8875 8.13663 16.3123L6.69789 15.0725C6.29223 14.7229 6.07919 14.1994 6.12535 13.6656L6.93752 4.27293C7.01201 3.41139 7.73231 2.75 8.59609 2.75H13.2447C16.726 2.75 19.697 5.17561 20.2694 8.48505Z"
              fill="#1C274C"
            />
            <path
              opacity="0.5"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.96767 15.2651C3.36893 15.2824 3.71261 14.9806 3.74721 14.5804L4.71881 3.34389C4.78122 2.6221 4.21268 2 3.48671 2C2.80289 2 2.25 2.55474 2.25 3.23726V14.5158C2.25 14.9174 2.5664 15.2478 2.96767 15.2651Z"
              fill="#1C274C"
            />
          </svg>
        </button>
        {dislikes ? (
          <a className="dislikeNumber">{dislikes?.length}</a>
        ) : (
          <a className="dislikeNumber">0</a>
        )}
      </div>
    </div>
  );
};
