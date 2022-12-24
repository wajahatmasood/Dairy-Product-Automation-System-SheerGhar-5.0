import React, { Fragment, useEffect, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createCollector } from "../../actions/collectorAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import SideBar from "./Sidebar";
import { NEW_COLLECTOR_RESET } from "../../constants/collectorConstants";
import Lottie from "react-lottie";
import * as animationData from "../Lottie/dash-Loading.json";
import PhoneInput from "react-phone-input-2";
import BadgeIcon from '@mui/icons-material/Badge';
const NewCollector = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, success } = useSelector(
    (state) => state.newCollector

  );

  const [name, setName] = useState("");
  const [dairyname, setDairyName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Collecter Added Successfully");
      history.push("/admin/collectors");
      dispatch({ type: NEW_COLLECTOR_RESET });
    }
  }, [dispatch, alert, error, history, success]);

  
  const createCollectorSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("dairyname", dairyname);
    myForm.set("phonenumber", phonenumber);
    myForm.set("location", location);
    dispatch(createCollector(myForm));
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

  return (
    <Fragment>
      <MetaData title="Add Collector" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {isShown && (
            <Lottie options={defaultOptions} height={100} width={100} />
          )}
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createCollectorSubmitHandler}
          >
            <h1>Register Collector</h1>

            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Collector Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <BadgeIcon />
              <input
                type="text"
                placeholder="Dairy Name"
                required
                value={dairyname}
                onChange={(e) => setDairyName(e.target.value)}
              />
            </div>
           
            <div>
            <PhoneInput
                className="fullWidth"
                country={"pk"}
                required
                type="number"
                placeholder="+92-XXX-XXXXX"
                value={phonenumber}
                //  as we cant pass e.target.value to the on change parameter cuz it is not a react component we pass any value to the install paclage
                onChange={(pn) => setPhoneNumber(pn)}
              />
                </div>

                <div>
              <AddLocationAltIcon />
              <input
                type="text"
                placeholder="Location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
   

            <Button
              onClick={handleClick2}
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Create
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewCollector;
