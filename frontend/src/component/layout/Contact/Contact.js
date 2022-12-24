// import React from "react";
// import "./Contact.css";
// import { Button } from "@material-ui/core";

// const Contact = () => {
//   return (
//
//   );
// };

// export default Contact;
import { Button } from "@material-ui/core";
import React from "react";
import "./Contact.css";
const Contact = () => {
  return (
    <div>
           

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3317.623645436004!2d72.78446691471612!3d33.74454684133059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfa6bc26bfa2db%3A0x2344c019578abeac!2sCOMSATS%20University%20Islamabad%2C%20Wah%20Campus!5e0!3m2!1sen!2s!4v1669203980734!5m2!1sen!2s"
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

      <div className="container">
        <div className="contact-form">
        <h2 className="homeHeading">Contact Us</h2>
          <form
            action="https://formspree.io/f/xjvzdvpk"
            method="POST"
            className="contact-inputs"
          >
            <input
              type="text"
              placeholder="username"
              name="username"
              required
              autoComplete="off"
              className="inpuut"
            />

            <input
              type="email"
              name="Email"
              placeholder="Email"
              autoComplete="off"
              required
              className="inpuut"
            />

            <textarea
              className="inpuut"
              name="Message"
              cols="30"
              rows="10"
              required
              autoComplete="off"
              placeholder="Enter you message"
            ></textarea>

            <input className="btttn" type="submit" value="SEND" />
          </form>
          
        </div>
        
      </div>
    
    </div>
  );
};

export default Contact;
