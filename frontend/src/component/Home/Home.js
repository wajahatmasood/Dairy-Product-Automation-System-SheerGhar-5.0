import React, { Fragment, useEffect } from "react";
import { Link } from "react-scroll";
import "./Home.css";
import "./style.css";

import MetaData from "../layout/MetaData";
import { CgMouse } from "react-icons/cg";
import ProductCard from "./ProductCard.js";
import { clearErrors, getproduct } from "../../actions/productAction";
// now we just need to call the function ProductAction --> for that we need to import <--
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
// for react alert
import { useAlert } from "react-alert";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
const Home = () => {
  // Alert Method
  const alert = useAlert();
  // Use Dispatch tu data fetch kar ke ussay disptch kare ga
  // use selector --> data ko un jagho par place kare ga jagha hum chaty hein
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  // this is to set the effect
  useEffect(() => {
    // alert.success("Welcome To SheerGhar")
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }
    dispatch(getproduct());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {/* This loading is for --> jab screen load hu ge uss k lye hy yeh circular load */}
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {/* This MetaData is use for title of
          website jo upper aata hy tabs mein */}
          <MetaData title="Sheer Ghar" />

          <div className="banner">
            {/* <p>Welcome to Ecommerce</p> */}
            {/* <h1>FIND AMAZING PRODUCTS BELOW</h1> */}
            {/* <a href="#container"> */}

            <Link
              to="container"
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
            >
              <button>
                Scroll <CgMouse />
              </button>
            </Link>
          </div>

          {/*  */}
          <h2 className="homeHeading">Products Benifits</h2>
          <div class="card-container">
            <div class="card">
              <div class="card-image"></div>
              <div class="card-title">Milk</div>
              <div class="card-text">
                Drinking milk prevent osteoporosis and bone fractures and even
                help you maintain a healthy weight.
              </div>
              <a href="/PorductBenift" className="readmore">
                <KeyboardDoubleArrowDownIcon />
              </a>
            </div>
            <div class="card" id="card1">
              <div class="card-image"></div>
              <div class="card-title">Cheese </div>
              <div class="card-text">
                Cheese is a good source of calcium, a key nutrient for healthy
                bones and teeth, blood clotting.
              </div>
              <a href="/PorductBenift" className="readmore">
                <KeyboardDoubleArrowDownIcon />
              </a>
            </div>

            <div class="card" id="card2">
              <div class="card-image"></div>
              <div class="card-title">BUTTER</div>
              <div class="card-text">
                It's rich in nutrients like calcium and contains compounds
                linked to lower chances of obesity.{" "}
              </div>
              <a href="/PorductBenift" className="readmore">
                <KeyboardDoubleArrowDownIcon />
              </a>
            </div>
            <div class="card" id="card3">
              <div class="card-image"></div>
              <div class="card-title">YOGURT</div>
              <div class="card-text">
                Yogurts can be high in protein, calcium, vitamins, probiotics,
                which can enhance the gut microbiota{" "}
              </div>
              <a href="/PorductBenift" className="readmore">
                <KeyboardDoubleArrowDownIcon />
              </a>
            </div>
          </div>

          {/*  */}
          {/* For Feature Products */}

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {/* <ProductCard product={product} />  --> we don't need to write this we use map function*/}
            {products &&
              products.map((product) => <ProductCard product={product} />)}
            ;
          </div>

          {/* <h2 className="homeHeading">Customer Review</h2> */}

          {/* <video id="background-video" loop autoPlay>
                <source src={"./miilk.mp4"} type="video/mp4" />
              </video> */}
          <h2 className="homeHeading">Our Assosiation</h2>

          <div class="our-clients">
            <ul>
              <li>
                {" "}
                <img src="images/2.png" alt="" />{" "}
                <img src="images/1-1.png" alt="" />{" "}
              </li>
              <li>
                {" "}
                <img src="images/2.png" alt="" />{" "}
                <img src="images/2-2.png" alt="" />{" "}
              </li>
              <li>
                {" "}
                <img src="images/3.png" alt="" />{" "}
                <img src="images/3-3.png" alt="" />{" "}
              </li>
              <li>
                {" "}
                <img src="images/4.png" alt="" />{" "}
                <img src="images/4-4.png" alt="" />{" "}
              </li>
              <li>
                {" "}
                <img src="images/5.png" alt="" />{" "}
                <img src="images/5-5.png" alt="" />{" "}
              </li>
              <li>
                {" "}
                <img src="images/6.png" alt="" />{" "}
                <img src="images/6-6.png" alt="" />{" "}
              </li>
            </ul>
          </div>
          <h2 id="ytDisplay" className="homeHeading">Our App Display</h2>
          <div id="ytDisplay" class="our-clients">
            <br/>
          <iframe
            width="1000"
            height="315"
            src="https://www.youtube.com/embed/GxARlktIqB4"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            autoplay
          ></iframe>
           <br/>
           <br/>
          </div>


        </Fragment>
      )}
    </Fragment>
  );
};
export default Home;
