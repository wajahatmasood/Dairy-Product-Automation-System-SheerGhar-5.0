import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./component/layout/Headers/Navbar";
import Footer from "./component/layout/Footer/Footer";
import ProductDetails from "./component/Product/ProductDetails";
import WebFont from "webfontloader";
import React from "react";
import Home from "./component/Home/Home.js";
import ourTeam from "./component/OurTeam/ourTeam";
import PorductBenift from "./component/ProductBenifits/productBenifit";
import Loader from "./component/layout/Loader/Loader";
import Seacrh from "./component/Product/Seacrh";
import Products from "./component/Product/Products";
import LoginSignUp from "./component/User/LoginSignUp";
import { useState, useEffect } from "react";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Headers/UserOptions";
import { useSelector } from "react-redux"; 
import Profile from "./component/User/Profile";
import ProtectedRoute from "./component/Routes/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Chat from "./component/Chat/Chat";
import Shipping from "./component/Cart/Shipping";
import Payment from "./component/Cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/Not Found/NotFound";
import CollectorList from "./component/Admin/CollectorList";
import NewCollector from "./component/Admin/NewCollector";
import UpdateCollector from "./component/Admin/UpdateCollector";

import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from "axios";

function App() {
  // isAuth and user is for loader <--- saving users state <--
  const { isAuthenticated, user } = useSelector((state) => state.user);
  // getting stripeApi key from processenv file
  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    // store.dispatch(loadUser()); is to hold the user state <--- jab wo login kar le ga tu uss ke baad reload par be wo login rahe ga
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);
  // no one willbe able to see inspect of our website
  // window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      {/* Navbar is header */}
      <Navbar />
      {/* This is for user --> ke if user login hu tu yeh component dkhye  */}
      {isAuthenticated && <UserOptions user={user} />}

      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        </Elements>
      )}

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/PorductBenift" component={PorductBenift} />
        <Route exact path="/product/:id" component={ProductDetails} />
        <Route exact path="/products" component={Products} />
        {/* Search  */}
        <Route path="/products/:keyword" component={Products} />
        <Route exact path="/search" component={Seacrh} />
        <Route exact path="/password/forgot" component={ForgotPassword} />
        <Route exact path="/password/reset/:token" component={ResetPassword} />

        <Route exact path="/contact" component={Contact} />
        <Route exact path="/about" component={About} />
        <Route exact path="/sheergharteam" component={ourTeam} />

        {/* this Protected route is use to redirect if
      use is authenticated than /account if not check ProtectedRoute in 
      Components --> Route --> ProtectedRoute  */}

        <ProtectedRoute exact path="/account" component={Profile} />
        <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
        <ProtectedRoute
          exact
          path="/password/update"
          component={UpdatePassword}
        />
        <ProtectedRoute exact path="/shipping" component={Shipping} />
        <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
        <ProtectedRoute exact path="/success" component={OrderSuccess} />
        <ProtectedRoute exact path="/orders" component={MyOrders} />
        <ProtectedRoute exact path="/order/:id" component={OrderDetails} />

        <Route exact path="/login" component={LoginSignUp} />
        <Route exact path="/cart" component={Cart} />

        {/* Admin Area */}

        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/dashboard"
          component={Dashboard}
        />
        <ProtectedRoute
          exact
          path="/admin/products"
          isAdmin={true}
          component={ProductList}
        />
        <ProtectedRoute
          exact
          path="/admin/product"
          isAdmin={true}
          component={NewProduct}
        />
         <ProtectedRoute
          exact
          path="/admin/product/:id"
          isAdmin={true}
          component={UpdateProduct}
        />
         <ProtectedRoute
          exact
          path="/admin/orders"
          isAdmin={true}
          isRider={true}
          component={OrderList}
        />
        <ProtectedRoute
          exact
          path="/admin/order/:id"
          isAdmin={true}
          isRider={true}
          component={ProcessOrder}
        />side
         <ProtectedRoute
          exact
          path="/admin/users"
          isAdmin={true}
          component={UsersList}
        />
         <ProtectedRoute
          exact
          path="/admin/user/:id"
          isAdmin={true}
          component={UpdateUser}
        />
          <ProtectedRoute
          exact
          path="/admin/reviews"
          isAdmin={true}
          component={ProductReviews}
        />
            <ProtectedRoute
          exact
          path="/admin/collectors"
          isAdmin={true}
          component={CollectorList}
        />
          <ProtectedRoute
          exact
          path="/admin/collector/new"
          isAdmin={true}
          component={NewCollector}
        />
         <ProtectedRoute
          exact
          path="/admin/collector/:id"
          isAdmin={true}
          component={UpdateCollector}
        />
        {/* yeh /process.payment ko yeh karny ka yeh matlab tha ke 
        keo ke hmara payment switch sy bahir hy if yeh condistion nai hu ge tu tu payment ke sath yeh loop mein chalana sheru kar de ga */}
        <Route
          component={
            window.location.pathname === "/process/payment" ? null : NotFound
          }
        />
      </Switch>
      <Chat />
      <Footer />
    </Router>
  );
}
export default App;
