import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { Rating } from "@material-ui/lab";
//----------------------------------
// for fetching we import reacr reduc
//----------------------------------
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProductDetails,
  newReview,
} from "../../actions/productAction";
import ReviewCard from "./ReviewCard";
import Loader from "../layout/Loader/Loader";
// for react alert
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartAction";
// for review import
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

import Lottie from "react-lottie";
import * as animationData from "../Lottie/Review.json";

const ProductDetails = ({ match }) => {
  // pulling product data
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  //----------------------------------

  // -----------------Quantity + and - ----------------
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // submit review --------------------------------------------------

  const {success, error: reviewError} = useSelector(
    (state)=> state.newReview
  );
  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };
  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", match.params.id);
    dispatch(newReview(myForm));
    // submit hoty he daialog band hu jae ga
    setOpen(false);
  };
  // submit review --------------------------------------------------

  const increaseQuantity = () => {
    // this is the condition for the stcok ke stock ke vlaue yeh hy
    if (product.Stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  // -----------------Quantity + and - ----------------

  // -----------------Add to cart ----------------
  const addToCartHandler = () => {
    dispatch(addItemsToCart(match.params.id, quantity));
    alert.success("Item Added To Cart");
  };

  // -----------------Add to cart ----------------

  // ---------------------------------
  const alert = useAlert();
  //----------------------------------
  const dispatch = useDispatch();
  //----------------------------------

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Review Added Successfully");
      dispatch({type: NEW_REVIEW_RESET});
    }
    // as we know in getProductDetails we have to give id so how we give id?
    // as in backend we use req.params.id but in frontend we use Match.params.id
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id, error, alert, success, reviewError]);
  //------------------------------------

  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Fragment>
      {/* This mean agar loading tru hy tu Lodaer dekha de yaha */}
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} Sheer Ghar`} />
          <div className="ProductDetails">
            <div>
              {/* <Carousel> */}

              {/* First we place Images condition ke images hein iss mein */}
              {product.images &&
                product.images.map((item, i) => (
                  <img
                    className="CarouselImage"
                    key={item.url}
                    src={item.url}
                    alt={`${i} Slide`}
                  />
                ))}

              {/* </Carousel> */}
            </div>

            {/* ------------------------ */}
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>

              {/* Review Star Bloack */}
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>

              {/* Price Bloack */}
              <div className="detailsBlock-3">
                <h1>{`Rs. ${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  {/* Product Quantity block {+ -} Bloack */}
                  {/* <div className="detailsBlock-3-1-1">
                      <button onClick={decreaseQuantity}>-</button>
                      <input  type="number" value={quantity}/>
                      <button onClick={increaseQuantity}>+</button>
                    </div> */}
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    onClick={addToCartHandler}
                    disabled={product.Stock < 1 ? true : false}
                  >
                    Add to Cart
                  </button>
                </div>
                {/* this status show ke agar stock 0 hy tu wo red color show kare ga
                if >0 wo green color show kare ga*/}
                <p>
                  Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>
              {/*  Descriprion of the product */}
              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
            {/* ------------------------ */}
          </div>

          {/*  Reviews  */}
          <h3 className="reviewsHeading">REVIEWS</h3>
          {/* Placing condition first ke agat reviews hein tu yeh div show kare */}
          {/* Dialog for review Modal */}
          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <Lottie options={defaultOptions} height={200} width={200} />
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
