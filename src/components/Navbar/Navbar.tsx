import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useState, useEffect } from "react";

const Navbar: React.FC = () => {
  const { user } = useAuth();

  const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
  const [menu_class, setMenuClass] = useState("menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  // --- NEW STATE & EFFECT FOR CONDITIONAL RENDERING ---
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 450);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 
  // --- END NEW STATE & EFFECT ---


  // Toggle burger menu change (only called when burger menu related actions happen)
  const updateMenu = () => {
    if (!isMenuClicked) {
      setBurgerClass("burger-bar clicked");
      setMenuClass("menu visible");
    } else {
      setBurgerClass("burger-bar unclicked");
      setMenuClass("menu hidden");
    }
    setIsMenuClicked(!isMenuClicked);
  };

  // Function to render navigation links FOR DESKTOP (no updateMenu call)
  const renderDesktopNavLinks = () => (
    <>
      <Link to="/" className="link">
        Home
      </Link>
      <Link to="/cart" className="link">
        Cart
      </Link>
      {user ? (
        <>
          <Link to="/profile" className="link">
            Profile
          </Link>
          <Link to="/logout" className="link">
            Logout
          </Link>
          <Link to="/crud" className="link">
            Add Product
          </Link>
        </>
      ) : (
        <>
          <Link to="/register" className="link">
            Register
          </Link>
          <Link to="/login" className="link">
            Login
          </Link>
        </>
      )}
    </>
  );

  // Function to render navigation links FOR MOBILE (with updateMenu call to close the menu)
  const renderMobileNavLinks = () => (
    <>
      <Link to="/" className="link" onClick={updateMenu}>
        Home
      </Link>
      <Link to="/cart" className="link" onClick={updateMenu}>
        Cart
      </Link>
      {user ? (
        <>
          <Link to="/profile" className="link" onClick={updateMenu}>
            Profile
          </Link>
          <Link to="/logout" className="link" onClick={updateMenu}>
            Logout
          </Link>
        </>
      ) : (
        <>
          <Link to="/register" className="link" onClick={updateMenu}>
            Register
          </Link>
          <Link to="/login" className="link" onClick={updateMenu}>
            Login
          </Link>
        </>
      )}
    </>
  );

  return (
    <div className="nav-container">
      {isMobile ? ( 
        <>
          <div className="burger-menu" onClick={updateMenu}>
            <div className={burger_class}></div>
            <div className={burger_class}></div>
            <div className={burger_class}></div>
          </div>
          <div className={menu_class}>{renderMobileNavLinks()}</div>
        </>
      ) : ( 
        <>
          <div className="desktop-links">{renderDesktopNavLinks()}</div>
        </>
      )}
    </div>
  );
};

export default Navbar;