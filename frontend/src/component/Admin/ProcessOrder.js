import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import SidebarRider from "./SidebarRider";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from "../../actions/orderAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { Button } from "@material-ui/core";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";
import "./processOrder.css";
import { useshippingOTPHook } from "../../hooks/shippingMethodHook";
import { useServerOTPHook } from "../../hooks/fetchDatabaseOTPFororder";
import LockPersonIcon from '@mui/icons-material/LockPerson';


const ProcessOrder = ({ history, match }) => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.order);
  const { sendShippingOTP } = useshippingOTPHook();
  const {getOTPFromServer}=useServerOTPHook()

  const [show, setShow] = useState(true);
  const [serverOTP, setServerOTP] = useState();
  const [localOTP, setLocalOTP] = useState();

  const updateOrderSubmitHandler = async (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("status", status);
    if (order.orderStatus !== "Shipped") {
      const response = await sendShippingOTP(order);
      if (!response.error) {

        myForm.set("otp", response);
        dispatch(updateOrder(match.params.id, myForm));
        setServerOTP(response);
      }
    }
    
    if (order.orderStatus === "Shipped") {
      const res = await getOTPFromServer(match.params.id)
      if(!res.error){
        setShow(false);
        setServerOTP(res)
      }
    }
  };
  const verifyOTP = (e) => {
    e.preventDefault();
    // console.log('LOcal ',localOTP)
    // console.log('server ',serverOTP)
    if(localOTP == serverOTP){
      dispatchOrder()
    }else{
      alert.error("Please Enter OTP again or return the product")
    }
  }
  const dispatchOrder = () => {
    const myForm = new FormData();
    myForm.set("status", status);
      dispatch(updateOrder(match.params.id, myForm));
  };


  const dispatch = useDispatch();
  const alert = useAlert();

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(getOrderDetails(match.params.id));
  }, [dispatch, alert, error, match.params.id, isUpdated, updateError]);

  return (
    <Fragment>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <SidebarRider />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <div
              className="confirmOrderPage"
              style={{
                display: order.orderStatus === "Delivered" ? "block" : "grid",
              }}
            >
              <div>
                <div className="confirmshippingArea">
                  <Typography>Shipping Info</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Name:</p>
                      <span>{order.user && order.user.name}</span>
                    </div>
                    <div>
                      <p>Email:</p>
                      <span>{order.user && order.user.email}</span>
                    </div>
                    <div>
                      <p>Phone:</p>
                      <span>
                        {order.shippingInfo && order.shippingInfo.phoneNo}
                      </span>
                    </div>
                    <div>
                      <p>Address:</p>
                      <span>
                        {order.shippingInfo &&
                          `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                      </span>
                    </div>
                    <div>
                      <p>Order Placed At:</p>
                      <span>
                        {order && order.paidAt}
                      </span>
                    </div>
                  </div>

                  <Typography>Payment</Typography>
                  <div className="orderDetailsContainerBox">
                    
                    <div>
                      <p
                        className={
                          order.paymentInfo &&
                          order.paymentInfo.status === "succeeded"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "PAID"
                          : "CASH ON DELIVERY"}
                      </p>
                    </div>

                    <div>
                      <p>Amount:</p>
                      <span>{order.totalPrice && order.totalPrice}</span>
                    </div>
                  </div>

                  <Typography>Order Status</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order.orderStatus && order.orderStatus === "Delivered"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order.orderStatus && order.orderStatus}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="confirmCartItems">
                  <Typography>Your Cart Items:</Typography>
                  <div className="confirmCartItemsContainer">
                    {order.orderItems &&
                      order.orderItems.map((item) => (
                        <div key={item.product}>
                          <img src={item.image} alt="Product" />
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>{" "}
                          <span>
                            {item.quantity} X Rs.{item.price} ={" "}
                            <b>Rs. {item.price * item.quantity}</b>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {/*  */}
              <div
                // yaha if status deliverd hu gya to procees wala nai show hu ga
                style={{
                  display: order.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
                {show ? (
                  <form
                    className="updateOrderForm"
                    onSubmit={updateOrderSubmitHandler}
                  >
                    <h1>Process Order</h1>

                    <div>
                      {/* Order --> inprocess --> shipped --> delivered */}
                      <AccountTreeIcon />
                      <select onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Choose Category</option>
                        {order.orderStatus === "Processing" && (
                          <option value="Shipped">Shipped</option>
                        )}

                        {order.orderStatus === "Shipped" && (
                          <option value="Delivered">Delivered</option>
                        )}
                      </select>
                    </div>

                    <Button
                      id="createProductBtn"
                      type="submit"
                      disabled={
                        loading ? true : false || status === "" ? true : false
                      }
                    >
                      Process
                    </Button>
                  </form>
                ) : (
                  <form
                    className="updateOrderForm"
                    onSubmit={verifyOTP}
                  >
                    <h1>Enter User's OTP</h1>

                    <div>
                      {/* Order --> inprocess --> shipped --> delivered */}
                      <LockPersonIcon />
                      <input
                        type="text"
                        placeholder="User's OTP"
                        required
                        className="shippingOTP"
                        onChange={(e) => setLocalOTP(e.target.value)}
                        maxLength="6"
                      />
                    </div>

<br></br>
                    <Button
                      id="createProductBtn"
                      type="submit"
                      disabled={
                        loading ? true : false || status === "" ? true : false
                      }
                    >
                      Confirm OTP
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
