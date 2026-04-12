import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Samruddhi Bhamodkar. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;