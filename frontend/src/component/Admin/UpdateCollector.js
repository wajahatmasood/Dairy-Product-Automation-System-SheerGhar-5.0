import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateCollector,
  getCollectorDetails,
} from "../../actions/collectorAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import SideBar from "./Sidebar";
import { UPDATE_COLLECTOR_RESET } from "../../constants/collectorConstants";
import PhoneInput from "react-phone-input-2";
import BadgeIcon from '@mui/icons-material/Badge';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';


const UpdateCollector = ({ history, match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, collector } = useSelector((state) => state.collectorDetails);


  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.collectorDetails);


  const [name, setName] = useState("");
  const [dairyname, setDairyName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");

  const collectorId = match.params.id;



  useEffect(() => {
    // console.log("test 1")

    if (collector && collector._id !== collectorId) {
      // console.log("test 2 IF")
      dispatch(getCollectorDetails(collectorId));
    } else {

      setName(collector.name);
      setDairyName(collector.dairyname);
      setPhoneNumber(collector.phonenumber);
      setLocation(collector.location);
      
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Product Updated Successfully");
      history.push("/admin/products");
      dispatch({ type: UPDATE_COLLECTOR_RESET });
    }
  }, [
    dispatch,
    alert,
    error,
    history,
    isUpdated,
    collectorId,
    collector,
    updateError,
  ]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("dairyname", dairyname);
    myForm.set("phonenumber", phonenumber);
    myForm.set("location", location);
    dispatch(updateCollector(collectorId, myForm));
  };

  return (
    <Fragment>
      <MetaData title="Create Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateProductSubmitHandler}
          >
            <h1>Update Collector Details</h1>

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
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Update
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateCollector;
