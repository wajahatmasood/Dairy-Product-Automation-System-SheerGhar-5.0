import React, { Fragment, useState } from "react";
import "./Header.css";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";


const UserOptions = ({user}) => {
    const [open, setOpen] = useState(false);
    const { cartItems } = useSelector((state) => state.cart); 
    const history = useHistory();
    const alert = useAlert(); 
    const dispatch = useDispatch();  
    const options = [
        { icon: <ListAltIcon /> , name: "Orders", func: orders },
        { 
          icon: (
            <ShoppingCartIcon
              style={{ color: cartItems.length > 0 ? "#00d2ff" : "unset" }}
            />
          ),
          name: `Cart(${cartItems.length})`,
          func: cart,
        },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
      ];

      if (user.role === "admin") {
        // shift removes first element from an array --> but unshift work reverse of shift 
        options.unshift({
          icon: <DashboardIcon />,
          name: "Dashboard",
          func: dashboard,
        });
      }
      if (user.role === "rider") {
        // shift removes first element from an array --> but unshift work reverse of shift 
        options.unshift({
          icon: <DashboardIcon />,
          name: "Order Update",
          func: ordersrider,
        });
      }
      if (user.role === "manager") {
        // shift removes first element from an array --> but unshift work reverse of shift 
        options.unshift({
          icon: <DashboardIcon />,
          name: "Manage",
          func: managee,
        });
      }
      function managee() {
        history.push("/admin/dashboard");
      }
      function ordersrider() {
        history.push("/admin/orders");
      }
      function dashboard() {
        history.push("/admin/dashboard");
      }
      function orders() {
        history.push("/orders");
      }
      function account() {
        history.push("/account");
      }
      function cart() {
        history.push("/cart");
      }
      function logoutUser() {
        dispatch(logout());
        alert.success("Logout Successfully");
      }
  return (
    // backdrop is for --> blacking the page when user click on profile user
    <Fragment>
       <Backdrop open={open} style={{ zIndex: "10" }} />
           <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: "11" }}
        open={open}
        direction="up"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : "/Profile.png"}
            alt="Profile"
          />
        }
      > 
   
   {options.map((item) => (
          <SpeedDialAction
          key ={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen 
          />
        ))}

      </SpeedDial>
    </Fragment>
  )
}

export default UserOptions