
import axios from "axios";
import {
    ADD_TO_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO,
  } from "../constants/cartConstants";


  export const addItemsToCart =  (id, quantity) => async(dispatch, getState) =>{

    // add to cart
        const {data} = await axios.get(`/api/v1/product/${id}`)

        dispatch  ({
            type : ADD_TO_CART,
            payload: {
                product :data.product._id,
                name :data.product.name,
                price :data.product.price,
                image :data.product.images[0].url,
                stock :data.product.Stock,
                quantity,
             },
        }) ;
        // this is for ke agar jab product cart mein add hu jae tu uss ke add hony ke baad if user reload kar deta hy tu wo local storage mein save rahy 
        localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))
    };
    // remove from cart
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
    dispatch({
      type: REMOVE_CART_ITEM,
      payload: id,
    });
  
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  };
  
  // save shipping information
  export const saveShippingInfo = (data) => async (dispatch, getState) => {

    dispatch({
      type: SAVE_SHIPPING_INFO,
      payload: data,
    });
    localStorage.setItem("shippingInfo", JSON.stringify(data));
  };
  