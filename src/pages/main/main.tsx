import { getDocs, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useState, useEffect } from "react";
import { Post } from "./post";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Cookies from "js-cookie";

export interface Post {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
  publishDate: Timestamp;
}

export const Main = () => {
  const [user, loading] = useAuthState(auth);
  const postsRef = collection(db, "posts");
  const [postsList, setPostsList] = useState<Post[] | null>(null);
  const [cookieConsent, setCookieConsent] = useState(
    Cookies.get("cookieConsent")
  );

  const getPosts = async () => {
    const data = await getDocs(postsRef);
    setPostsList(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]
    );
  };

  useEffect(() => {
    if (cookieConsent != null) {
      getPosts();
    }
  }, []);

  const handleCookieConsent = (accept: boolean) => {
    if (accept === true) {
      Cookies.set("cookieConsent", "true", { expires: 365 });
      setCookieConsent("true");
    } else {
      Cookies.set("cookieConsent", "false", { expires: 365 });
      setCookieConsent("false");
    }
    if (user) {
      getPosts();
    }
  };

  if (loading) {
    return (
      <div className="pageContent flexbox">
        <h1 data-aos="zoom-in">We are preparing your space 😊 ...</h1>
      </div>
    );
  }

  const likedPostsStr = Cookies.get("liked_posts");
  const likedPosts = likedPostsStr ? JSON.parse(likedPostsStr) : [];

  const likedPostsList: Post[] = [];
  const otherPostsList: Post[] = [];
  postsList?.forEach((post) => {
    if (likedPosts.includes(post.title)) {
      likedPostsList.push(post);
    } else {
      otherPostsList.push(post);
    }
  });

  return (
    <div className="pageContent flexbox">
      {cookieConsent == null && (
        <div className="cookieConsent flexbox">
          <p>
            We use cookies to ensure you get the best experience on our website.
            By continuing, you agree to our use of cookies.
          </p>
          <div className="cookieButtons flexbox">
            <Button
              id="accept"
              onClick={() => handleCookieConsent(true)}
              variant="success"
            >
              Accept
            </Button>
            <Button
              id="decline"
              onClick={() => handleCookieConsent(false)}
              variant="danger"
            >
              Decline
            </Button>
          </div>
        </div>
      )}
      {user ? (
        <>
          {likedPostsList.map((post) => (
            <Post key={post.id} post={post} />
          ))}
          {otherPostsList.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </>
      ) : (
        <div className="holder flexbox">
          <h1 data-aos="zoom-in">Welcome to SpaceVibe</h1>
          <svg
            data-aos="zoom-in"
            id="planetHuge"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
              fill="#1C274C"
            />
            <path
              d="M17.7124 5.45331C18.7593 5.25995 19.7184 5.19444 20.5094 5.30066C21.2797 5.40411 22.0451 5.69443 22.4649 6.36546C22.9112 7.07875 22.7767 7.90702 22.4527 8.62306C22.1234 9.35067 21.5345 10.1218 20.7806 10.8912C19.2652 12.4379 16.9446 14.1173 14.1835 15.5883C11.4214 17.0599 8.68924 18.0721 6.49015 18.5079C5.39463 18.7249 4.39197 18.807 3.56745 18.709C2.76731 18.614 1.96779 18.3262 1.53503 17.6345C1.06423 16.882 1.23859 16.0043 1.60462 15.2551C1.97963 14.4875 2.63744 13.6693 3.47686 12.8522L4 12.4165C4 12.6349 4.08336 13.1257 4.16811 13.5624C4.21263 13.7918 4.25753 14.0062 4.29093 14.1584C3.6391 14.8237 3.19304 15.421 2.95236 15.9136C2.67513 16.481 2.74418 16.7391 2.80665 16.8389C2.87948 16.9553 3.1117 17.1443 3.74441 17.2195C4.35275 17.2918 5.18406 17.2375 6.1986 17.0365C8.21962 16.636 10.8118 15.685 13.4782 14.2644C16.1457 12.8433 18.3298 11.2493 19.7092 9.84143C20.4027 9.13359 20.8587 8.50726 21.0861 8.00467C21.3187 7.4905 21.2526 7.25586 21.1933 7.16105C21.1231 7.04882 20.9042 6.86715 20.3097 6.78731C19.7683 6.7146 19.0378 6.74602 18.1466 6.89948L16.8697 5.65597C17.2085 5.55454 17.5278 5.48526 17.7124 5.45331Z"
              fill="#1C274C"
            />
          </svg>
          <div data-aos="zoom-in" className="descriptionBox flexbox">
            <h2>Discover the Universe, Connect with Others</h2>
            <a>
              Welcome to SpaceVibe, your gateway to a universe of social
              discovery and connection. Explore the cosmos of shared interests,
              passions, and experiences with fellow space enthusiasts from
              around the globe. Whether you're an amateur astronomer, a sci-fi
              aficionado, or simply fascinated by the mysteries of the cosmos,
              SpaceVibe is your launchpad to connect, engage, and share your
              cosmic journey.
            </a>
          </div>
          <div className="arguments flexbox">
            <h2 data-aos="zoom-in">What Makes SpaceVibe Unique?</h2>
            <ul className="flexbox">
              <li data-aos="zoom-in" className="flexbox">
                <a>
                  <span className="title">
                    Connect with Like-minded Explorers:
                  </span>{" "}
                  Join a vibrant community of space enthusiasts who share your
                  passion for all things cosmic. From stargazing tips to
                  discussions on the latest space missions, SpaceVibe is your
                  orbit for connecting with fellow explorers.
                </a>
              </li>
              <li data-aos="zoom-in" className="flexbox">
                <a>
                  <span className="title">Discover the Universe:</span> Dive
                  into a universe of content curated for space enthusiasts.
                  Explore articles, videos, and images that will ignite your
                  curiosity and expand your cosmic horizons.
                </a>
              </li>
              <li data-aos="zoom-in" className="flexbox">
                <a>
                  <span className="title">Share Your Journey:</span> Share your
                  own space adventures, discoveries, and insights with the
                  community. Whether it's capturing breathtaking
                  astrophotography or sharing your thoughts on the latest space
                  news, SpaceVibe is your platform to inspire and be inspired.
                </a>
              </li>
              <li data-aos="zoom-in" className="flexbox">
                <a>
                  <span className="title">Stay Informed:</span> Stay up-to-date
                  with the latest space news, events, and discoveries. From
                  upcoming rocket launches to celestial phenomena, SpaceVibe
                  keeps you informed and engaged with the ever-evolving universe
                  around us.
                </a>
              </li>
            </ul>
          </div>
          <div data-aos="zoom-in" className="descriptionBox flexbox">
            <h2>Get Started</h2>
            <a>
              Joining SpaceVibe is easy and free! Sign up now to embark on a
              journey through the cosmos with a community that shares your
              passion for space exploration and discovery.
            </a>
            <Link to="/login" className="navLink">
              <Button variant="info">Sign In</Button>
            </Link>
          </div>
          <div data-aos="zoom-in" className="descriptionBox flexbox">
            <h2>About Us</h2>
            <a>
              SpaceVibe is a passionate community of space enthusiasts dedicated
              to fostering curiosity, exploration, and connection in the
              ever-expanding universe. Our mission is to inspire and empower
              individuals to explore the cosmos, connect with others, and share
              the wonder of space exploration.
            </a>
          </div>
          <h5 data-aos="zoom-in">SpaceVibe - Explore. Connect. Discover.</h5>
        </div>
      )}
    </div>
  );
};
