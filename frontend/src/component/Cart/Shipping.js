import React, { Fragment, useState } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../layout/MetaData";
import PinDropIcon from "@material-ui/icons/PinDrop";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import PublicIcon from "@material-ui/icons/Public";
import PhoneIcon from "@material-ui/icons/Phone";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import { Country, State } from "country-state-city";
import { useAlert } from "react-alert";
import TextField from "@mui/material/TextField";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import CheckoutSteps from "./CheckoutSteps.js";

const Shipping = ({history}) => {
  const dispatch = useDispatch();
  const Alert = useAlert();

  const { shippingInfo } = useSelector((state) => state.cart);
  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [country, setCountry] = useState(shippingInfo.country);
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

  const shippingSubmit = (e) => {
    e.preventDefault();

    // if (phoneNo.length < 10 || phoneNo.length > 10) {
    //   alert.error("Phone Number should be 10 digits Long");
    //   return;
    // }
    dispatch(
      saveShippingInfo({ address, city, state, country, pinCode, phoneNo })
    );
    history.push("/order/confirm");

  };

  return (
    <Fragment>
      <MetaData title="Shipping Details" />
      {/* A Seperate Component to go to the checkout */}
      <CheckoutSteps activeStep={0} />

      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>

          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >
            <div>
              <TextField
                fullWidth
                label="Address"
                id="fullWidth"
                type="text"
                placeholder="House Number XYZ Near ABC Place"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              {/* <LocationCityIcon /> */}
              <TextField
                fullWidth
                label="City"
                id="fullWidth"
                type="text"
                placeholder="WahCantt or Any XYZ"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              {/* <PinDropIcon /> */}
              <TextField
                fullWidth
                label="Pin Code"
                id="fullWidth"
                type="text"
                placeholder="43200 or XXXX"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                inputProps={{ maxLength: 6 }}
              />
            </div>

            <div>
              {/* <PhoneIcon /> */}
              {/* <TextField
                fullWidth
                label="Phone Number"
                id="fullWidth"
                type="number"
                placeholder="+92-XXXXXXXX"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                size="10"
              /> */}

              <PhoneInput
                className="fullWidth"
                country={"pk"}
                required
                type="number"
                placeholder="+92-XXX-XXXXX"
                value={phoneNo}
                //  as we cant pass e.target.value to the on change parameter cuz it is not a react component we pass any value to the install paclage
                onChange={(pn) => setPhoneNo(pn)}
              />
            </div>

            <div>
              <PublicIcon />
              <select
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Country</option>
                {Country &&
                  // we get all the countries by using method of getAllCountries <--- npm package
                  Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {/*  In below line we check if we select country thans show state */}
            {country && (
              <div>
                <TransferWithinAStationIcon />

                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
              disabled={state ? false : true}
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
