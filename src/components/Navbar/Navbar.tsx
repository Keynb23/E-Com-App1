import { useAuth } from "../../context/AuthContext"; 
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useState, useEffect } from "react";

const Navbar: React.FC = () => {
  const { user } = useAuth();

  const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
  const [menu_class, setMenuClass] = useState("menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 450);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const renderDesktopNavLinks = () => (
    <nav className="nav-links desktop-nav">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/cart" className="nav-link">Cart</Link>
      {user ? (
        <>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/logout" className="nav-link">Logout</Link>
          <Link to="/crud" className="nav-link">Add Product</Link>
        </>
      ) : (
        <>
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </>
      )}
    </nav>
  );

  const renderMobileNavLinks = () => (
    <nav className="nav-links mobile-nav">
      <Link to="/" className="nav-link" onClick={updateMenu}>Home</Link>
      <Link to="/cart" className="nav-link" onClick={updateMenu}>Cart</Link>
      {user ? (
        <>
          <Link to="/profile" className="nav-link" onClick={updateMenu}>Profile</Link>
          <Link to="/logout" className="nav-link" onClick={updateMenu}>Logout</Link>
          <Link to="/crud" className="nav-link" onClick={updateMenu}>Add Product</Link>
        </>
      ) : (
        <>
          <Link to="/register" className="nav-link" onClick={updateMenu}>Register</Link>
          <Link to="/login" className="nav-link" onClick={updateMenu}>Login</Link>
        </>
      )}
    </nav>
  );

  return (
    <header className="navbar">
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
        <div className="desktop-nav-container">{renderDesktopNavLinks()}</div>
      )}
    </header>
  );
};

export default Navbar;
