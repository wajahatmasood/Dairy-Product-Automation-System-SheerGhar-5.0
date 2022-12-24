import React from "react";
import ErrorIcon from "@material-ui/icons/Error";
import "./NotFound.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import Lottie from "react-lottie";
import * as animationData from "../../Lottie/NotFounf.json";

const NotFound = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
  return (
    <div className="PageNotFound">
      {/* <ErrorIcon /> */}
      <Lottie options={defaultOptions} height={250} width={250} />
      
      <Link to="/">Go Back to Home</Link>
      {/* <a href="/process/payment">Refresh</a> */}
    </div>
  );
};

export default NotFound;
