import React, { Fragment, useEffect, useState } from "react";
import {useSelector, useDispatch} from "react-redux";
import "./Products.css";
import {clearErrors, getproduct} from "../../actions/productAction"
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import  Pagination from "react-js-pagination";
import  Slider  from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Rating from '@mui/material/Rating';
import {useAlert} from "react-alert"
import MetaData from "../layout/MetaData";



const categories = [
  "Milk",
  "Cheese",
  "Juice",
  "Butter", 
];

// -----------------------------------------------------------
// -----------------------------------------------------------
const Products = ({match}) => {

const alert = useAlert();
// -----------------------------------------------------------
// -----------------------------------------------------------
const dispatch = useDispatch();
// -----------------------------------------------------------
// -----------------------------------------------------------
const [currentPage, setCurrentPage] = useState(1);
// -----------------------------------------------------------
// -----------------------------------------------------------
const {loading, error, products, productsCount, resultPerPage, filteredProductsCount } 
= useSelector((state) => state.products);
// -----------------------------------------------------------
// -----------------------------------------------------------
const keyword = match.params.keyword;
// -----------------------------------------------------------
// -----------------------------------------------------------
const [price, setPrice] = useState([0, 2000]);
// -----------------------------------------------------------
// -----------------------------------------------------------
const [category, setCategory] = useState("");
// -----------------------------------------------------------
// -----------------------------------------------------------
const [ratings, setRatings] = useState(0);
// -----------------------------------------------------------
// -----------------------------------------------------------
const setCurrentPageNo =(e) =>{
  setCurrentPage(e); 
}
// -----------------------------------------------------------
// -----------------------------------------------------------
const priceHandler =(event, newPrice) =>{ 
  setPrice(newPrice);
}
// -----------------------------------------------------------
// -----------------------------------------------------------


useEffect(() => {
    if (error)
    {
        alert.error(error);
        dispatch(clearErrors());  
    }
    dispatch(getproduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);
  //------------------------------------
  let count = filteredProductsCount;
  return (
    <Fragment>
        {loading? <Loader/> : (
        <Fragment>
              <MetaData title="Products Sheer Ghar" />
                      <h2 className="productsHeading">Products</h2>
                      <div className="products">
                        {products && products.map((product)=>(
                           <ProductCard key={product._id} product={product} /> 
                        ))}
                      </div>
                      {/* --------------------- */}
                      {/* Filter */}
                      {/* --------------------- */}
                      {/* Add  {keyword &&  (div) }to show filter to alll place */}
                     <div className="filterBox">
                         <h3>FILTERS</h3>
                              <Typography>Price</Typography>
                              <Slider 
                                  value={price}
                                  onChange={priceHandler}
                                  valueLabelDisplay="auto"
                                  aria-labelledby="range-slider"
                                  min={0}
                                  max={2000}
                              />
                              <Typography>Categories</Typography>
                              <ul className="categoryBox">
                                  {categories.map((category) => (
                                    <li
                                      className="category-link"
                                      key={category}
                                      onClick={() => setCategory(category)}>
                                      {category}
                                    </li>
                                  ))}
                              </ul>
                              <fieldset>
                                    <Typography component="">Ratings Above</Typography>
                                    <Rating
                                      value={ratings}
                                      onChange={(e, newRating) => {
                                        setRatings(newRating);
                                      }}
                                      aria-labelledby="continuous-slider"
                                      valueLabelDisplay="auto"
                                      min={0}
                                      max={5}
                                    />
                               </fieldset>
                               <a href="/products">Remove All Filters</a>
                              
                          </div> 
                      {/* --------------------- */}
                      {/* Pagination */}
                      {/* --------------------- */}
                     {resultPerPage < count && (
                       <div className="paginationBox">
                              <Pagination 
                                activePage={currentPage}
                                itemsCountPerPage={resultPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText="Next"
                                prevPageText="Prev"
                                firstPageText="1st"
                                lastPageText="Last"
                                itemClass="page-item"
                                linkClass="page-link"
                                activeClass="pageItemActive"
                                activeLinkClass="pageLinkActive"
                                />
                       </div>
                     ) 
                     }
        </Fragment>
        )}
    </Fragment>
  )}
export default Products 