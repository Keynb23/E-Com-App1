import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useState, useEffect } from "react";

// Navbar
const Navbar: React.FC = () => {
  const { user } = useAuth();

  const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
  const [menu_class, setMenuClass] = useState("menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  // isMobile state and effect for conditional rendering
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);

  // useEffect for handling window resize
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
  // This effect hook sets up an event listener for window resizing. It updates the `isMobile` state whenever the window's width crosses the 450px threshold, allowing for dynamic rendering of mobile vs. desktop navigation. The listener is cleaned up when the component unmounts.

  // updateMenu
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
  // This function toggles the visual state of the burger menu icon and the visibility of the mobile navigation menu. It updates CSS classes to reflect whether the menu is "clicked" (open) or "unclicked" (closed).

  // renderDesktopNavLinks
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
  // This function renders the navigation links optimized for desktop displays. It conditionally shows "Profile", "Logout", and "Add Product" links if a user is logged in, or "Register" and "Login" links if no user is authenticated. It does not include logic to close a mobile menu upon clicking.

  // renderMobileNavLinks
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
          <Link to="/crud" className="link" onClick={updateMenu}>
            Add Product
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
  // This function renders the navigation links specifically for mobile displays. Similar to desktop links, it conditionally renders based on user authentication. Crucially, each link includes an `onClick={updateMenu}` handler to automatically close the mobile menu when a navigation link is clicked.

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