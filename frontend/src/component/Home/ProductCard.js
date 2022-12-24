import React from 'react'
import { Link } from "react-router-dom"
import { Rating } from "@material-ui/lab";


const ProductCard = ({ product }) => {

// ---------------------------------------------------------
// Edit: false mean jo products hein featured un ke review user waha change nai kar sakta 
const options = {
  edit : false,
  color: "rgb(20,20,20.0.1)",
  activeColor: "tomato", 
  // size: window.innerWidth < 600 ? 20 : 25,
  // this value provide the rating in star
  value: product.ratings,
  isHalf: true,
};
// ---------------------------------------------------------

  return (
    // there we pass product Id from home and represnt our card in featurecard
    <Link className="productCard" to={ `product/${product._id}`}>
        <img src={product.images[0].url} alt={product.name} />
        <p>{product.name}</p>
        
        <div>
        <Rating {...options} /> <span> ({product.numOfReviews} Reviews)</span>
        <span className="productCardSpan">
        </span>
      </div>
      <span>{`Rs. ${product.price}`}</span>
    </Link>
  );
}
 
export default ProductCard

