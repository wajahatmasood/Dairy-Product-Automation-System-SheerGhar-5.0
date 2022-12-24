import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, register } from "../../actions/userAction";
import { useAlert } from "react-alert";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import TextField from "@mui/material/TextField";
import { useOTPHook } from "../../hooks/useOTPHook";
import LockPersonIcon from '@mui/icons-material/LockPerson';

const LoginSignUp = ({ history, location }) => {
  //----------------------Passowrod Show------------------------
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = (e) => {
    e.preventDefault();
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };
  //----------------------Passowrod Show------------------------

  //-----------------------------------------------------------------------
  // Connection <-- backend
  //-----------------------------------------------------------------------
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  //-----------------------------------------------------------------------
  // Login
  //-----------------------------------------------------------------------
  // to get access the DOM element in React we do use Useref element-->We can't access them directly So, we use useRef<--
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { confirmAccount } = useOTPHook();
  //-----------------------------------------------------------------------
  // Register
  //-----------------------------------------------------------------------
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;
  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  // login form function
  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail.toLowerCase(), loginPassword));
  };

  // correct user name <-->
  const correctName = (name) => {
    const r = name.toLowerCase();
    const finalSentence = r.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
      letter.toUpperCase()
    );
    return finalSentence;
  };

  const [localOTP, setLocalOTP] = useState();
  const [serverOTP, setServerOTP] = useState();
  const [show, setShow] = useState(false);
  const registerSubmit = async (e) => {
    e.preventDefault();
    const res = await confirmAccount(email);
    // console.log(res, " OTP");
    if (res) {
      setServerOTP(res);
      setShow(true);
    }else{
      alert.error("Duplicate mail")
    }
  };
  const createAccount = (e) => {
    e.preventDefault();
  
    // console.log('LOcal',localOTP);
    // console.log('Server',serverOTP);

    if(localOTP == serverOTP){
      const myForm = new FormData();
    myForm.set("name", correctName(name));
    myForm.set("email", email.toLowerCase());
    myForm.set("password", password);
    myForm.set("avatar", avatar);
    dispatch(register(myForm));
    }
    else{
      alert.error("Wrong OTP, Please Try Again")
    }
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        // reader state --. 0, 1, 2  0mean initial  1 mean porcessing 2 mean done
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      //yaha sy hum user ka data line no 50-53 mein bhjen gy <-- like e.target.name --> jo be name hu ga wo waha set hu jae ga
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  // this below line will do ==> split the link like first part if the user is login and than redirect to the next link
  // usefull when checkoutfrom the cart will execute
  const redirect = location.search ? location.search.split("=")[1] : "/account";
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      alert.success("Login SucessFul");
      history.push(redirect);
    }
  }, [dispatch, error, alert, history, isAuthenticated, redirect]);
  //Switch Function
  // tab ke through we recive login and register
  const switchTabs = (e, tab) => {
    if (tab === "login") {
      // when some one click login the postion of login become neutral
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  //-----------------------------------------------------------------------
  //-----------------------------------------------------------------------
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  {/* This switch and ref tab is a react hook */}
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  {/* <MailOutlineIcon /> */}
                  <TextField
                    fullWidth
                    label="Email"
                    id="fullWidth"
                    type="email"
                    placeholder="xyz@gmail.com"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  {/* <LockOpenIcon /> */}
                  <TextField
                    fullWidth
                    label="Password"
                    id="fullWidth"
                    type={passwordShown ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button className="eye" onClick={togglePassword}>
                    {" "}
                    <RemoveRedEyeIcon />
                  </button>
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>

              {!show ? (
                <form
                  className="signUpForm"
                  ref={registerTab}
                  // we use encType because we are not just submitting the user data we are also uploading the image of the user
                  encType="multipart/form-data"
                  onSubmit={registerSubmit}
                >
                  <div className="signUpName">
                    <FaceIcon />
                    <input
                      type="text"
                      placeholder="Name"
                      required
                      name="name"
                      value={name}
                      onChange={registerDataChange}
                    />
                  </div>
                  <div className="signUpEmail">
                    <MailOutlineIcon />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      name="email"
                      value={email}
                      onChange={registerDataChange}
                    />
                  </div>
                  <div className="signUpPassword">
                    <LockOpenIcon />
                    <input
                      type={passwordShown ? "text" : "password"}
                      placeholder="Password"
                      required
                      name="password"
                      value={password}
                      onChange={registerDataChange}
                    />
                    <button className="eye" onClick={togglePassword}>
                      {" "}
                      <RemoveRedEyeIcon />
                    </button>
                  </div>

                  <div id="registerImage">
                    <img src={avatarPreview} alt="Avatar Preview" />
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={registerDataChange}
                    />
                  </div>
                  <input type="submit" value="Register" className="signUpBtn" />
                </form>
              )
              :
              (
                <form
                  className="signUpForm"
                  ref={registerTab}
                  // we use encType because we are not just submitting the user data we are also uploading the image of the user
                  encType="multipart/form-data"
                  onSubmit={createAccount}
                >
                  <h3>Check Your Mail For OTP Verification</h3>
                  <div className="signUpName">
                    
                    <LockPersonIcon />
                    <input
                    maxLength={6}
                      type="text"
                      placeholder="Enter OTP"
                      required
                      onChange={e => setLocalOTP(e.target.value)}
                    />
                  </div>
                  <input type="submit" value="Confirm OTP" className="signUpBtn" />
                </form>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
