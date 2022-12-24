import React, { useState } from "react";
import "./navbar.css";
import {
  // eslint-disable-next-line
  FaShoppingCart,
  FaSearch,
  FaUser,
  
  
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IconName } from "react-icons/bs";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  return (
    <>
      <nav className="main-nav">
        {/* 1st logo part  */}
        <div className="logo">
         
          <h2>
          <a to="/">
            <span>S</span>heer
            <span>G</span>har
            </a>
          </h2>
       
          {/* <img src="../../images/weblogo.png" /> */}
        </div>

        {/* 2nd menu part  */}
        <div
          className={
            showMediaIcons ? "menu-link mobile-menu-link" : "menu-link"
          }>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/products">Product</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li>
              <NavLink to="/About">About</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login/Signup</NavLink>
            </li>
            <li>
              <NavLink to="/sheergharteam">Our Team</NavLink>
            </li>
            <li>
              <NavLink id="displaynavnone" to="/Search">Search</NavLink>
            </li>
          </ul>
        </div>

        {/* 3rd social media links */}
        <div className="social-media">
          <ul className="social-media-desktop">
            <li>
              <a>
                <NavLink to="/cart">  <FaShoppingCart className="cart" /></NavLink>
              </a>
            </li>
            {/* Search */}
            <li>
              <a>
                <NavLink to="/Search"> <FaSearch className="cart" /></NavLink>
              </a>
            </li>
            <li>
              <a
                to="/login"
                >
                <NavLink to="/login"> <FaUser className="profile" /></NavLink>
              </a>
            </li>
            
          </ul>

          {/* hamburget menu start  */}
          <div className="hamburger-menu">
            <a href="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
              <GiHamburgerMenu  className="but"/>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
