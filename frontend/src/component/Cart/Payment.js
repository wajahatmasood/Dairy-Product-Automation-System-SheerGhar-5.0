import React, { Fragment, useEffect, useRef, useState } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { createOrder, clearErrors } from "../../actions/orderAction";
import Lottie from "react-lottie";
import * as animationData from "../Lottie/Payment.json";

const Payment = ({ history }) => {
  const [loading, setLoading] = React.useState(true);
  function handleClick() {
    setLoading(true);
  }
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  // this is the order details
  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // -------------> disabling button after clicking on it <-------------
    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      // we send the details of shipping to the
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;

        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          dispatch(createOrder(order));

          history.push("/success");
        } else {
          alert.error("There's some issue while processing payment ");
        }
      }
    } catch (error) {
      //if tu error aa jae tu button ko phr sy active kar dy
      payBtn.current.disabled = false;
      alert.error(error.response.data.message);
    }
  };

  //-------------------------------------------------------
  const proceedToCOD = async (e) => {
    order.paymentInfo = {
      id: "Nill",
      status: "Not Paid",
    };
    dispatch(createOrder(order));
    history.push("/success");
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [isShown, setIsShown] = useState(false);
  const handleClick2 = (event) => {
    setIsShown((current) => !current);
  };

  const [switchPayment,setSwitchPayment]=useState(true)

  const switchMode =()=>{
setSwitchPayment(!switchPayment)
  }

  useEffect(() => {
    return () => {
      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }
    };
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />

      <div className="paymentContainer">
        {isShown && (
          <Lottie options={defaultOptions} height={200} width={200} />
        )}
        {switchPayment ?
          <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
        <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>
          <input
            onClick={handleClick2}
            type="submit"
            value={`Pay - Rs ${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
          <h3 className="switch">Or</h3>
          {/* <input
            onClick={proceedToCOD}
            type="submit"
            value={`Cash On Delivery - Rs ${orderInfo && orderInfo.totalPrice}`}
            className="paymentFormBtn"
          /> */}
          <input
            onClick={switchMode}
            type="submit"
            value={`Switch Payment Method`}
            className="paymentFormBtn"
          />
        </form> 
        :
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
        <Typography>Cash on Delivery</Typography>
         
          <input
            onClick={proceedToCOD}
            type="submit"
            value={`Cash On Delivery - Rs ${orderInfo && orderInfo.totalPrice}`}
            className="paymentFormBtn"
          />
          <h3 className="switch">Or</h3>
          <input
            onClick={switchMode}
            type="submit"
            value={`Switch Payment Method`}
            className="paymentFormBtn"
          />
        </form>
        }
        <a href="/process/payment">Refresh</a>
      </div>
    </Fragment>
  );
};

export default Payment;
