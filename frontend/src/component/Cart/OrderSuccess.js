import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import "./orderSuccess.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import Lottie from 'react-lottie';
import * as animationData from '../Lottie/successDone.json'

const OrderSuccess = () => {

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div className="orderSuccess">
      {/* <CheckCircleIcon /> */}

      <div className="lottie"><Lottie options={defaultOptions} 
      height={200} width={200} /></div>

      <Typography>Your Order has been Placed successfully </Typography>
      <Link to="/orders">View Orders</Link>
    </div>
  );
};

export default OrderSuccess;
