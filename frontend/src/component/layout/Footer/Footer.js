import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import { NavLink } from "react-router-dom";

import { FaDiscord, FaFacebook, FaInstagram, FaMailBulk, FaYoutube } from "react-icons/fa";
// import "./Footer.css";
import "./style.css";
import { Button } from "@material-ui/core";

const Footer = () => {
  return (
    // <footer id="footer">
    //   <div className="leftFooter">
    //     <h4>DOWNLOAD OUR APP</h4>
    //     {/* <p>Download App for Android and IOS mobile phone</p> */}
    //     <img src={playStore} alt="playstore" />
    //     <img src={appStore} alt="Appstore" />
    //   </div>
    //   <div className="midFooter">
    //     <h1>SHEER GHAR</h1>
    //     <p>High Quality is our first priority</p>

    //     <p>Copyrights by &copy; SheerGhar </p>
    //   </div>

    //   <div className="rightFooter">
    //     <h4>Follow Us</h4>
    //     <a href="">Instagram</a>
    //     <a href="">Youtube</a>
    //     <a href="">Facebook</a>
    //   </div>

    // </footer>
    <div>
    <section className="contact-short">
          <div className="grid grid-two-column">
            <div>
              <h1>Download Our App</h1>
              <h3>Get it now</h3>
            </div>
            <div>
              <Button className="btn hireme-btn">
                {/* <NavLink to="/"> Get App </NavLink>
                 */}
                  <a href="https://expo.dev/artifacts/f89907d0-4312-4913-b9ff-788ace18efd8">Get App</a>
              </Button>
            </div>
          </div>
    </section>
        {/* footer section */}

        <footer>
          <div className="contain">
            <div className="about">
              <h3>Sheer Ghar</h3>
              <p>SheerGhar is all about great dairy from our real-owned farm. </p>
            </div>
            <div className="footer-social">
              <h3>Follow Us</h3>
              <div className="footer-social--icons">
                <div>
                <a
                    href="https://www.facebook.com/profile.php?id=100081565301056"
                    target="_blank"
                    className="Linnnk" >
                  <FaFacebook className="icons" />
                  </a>
                </div>
                <div>
                <a
                    href="https://www.instagram.com/sheerghar/"
                    target="_blank"
                    className="Linnnk" >
                  <FaInstagram className="icons" />
                  </a>
                </div>
                {/* <div>
                  <a
                    mail to="info.sheerghar@gmail.com"
                    target="_blank"
                    className="Linnnk" >
                  
                    <FaMailBulk className="icons" />
                  </a>
                </div> */}
              </div>
            </div>
            <div className="about">
              <h3>Contact Us</h3>
              <p>+92 3331005358</p>
              <p>info.sheerghar@gmail.com</p>

            </div>
          </div>
        </footer>
        </div>
    
  );
};

export default Footer;
