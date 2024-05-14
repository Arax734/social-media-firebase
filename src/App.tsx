import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Main } from "./pages/main/main";
import { Login } from "./pages/login";
import { NotFound } from "./pages/not-found";
import { Navbar } from "./components/navbar";
import { CreatePost } from "./pages/create-post/create-post";
import { Footer } from "./components/footer";
import { Burger } from "./components/burger";

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [burgerVisible, setBurgerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth <= 670) {
        setBurgerVisible(true);
      } else {
        setBurgerVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleBurger = () => {
    setBurgerVisible(!burgerVisible);
  };

  return (
    <div className="App flexbox">
      <Router>
        <Navbar toggleBurger={toggleBurger} />
        {burgerVisible && <Burger />}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
