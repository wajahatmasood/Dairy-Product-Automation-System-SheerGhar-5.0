import {
    ADD_TO_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO,
  } from "../constants/cartConstants";
  
  export const cartReducer = (
    state = { cartItems: [], shippingInfo: {} },
    action
  ) => {
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload;
            // we need to check ke jo product upper wali line sy aye hy we check ke kya wo cart mein  exist karti hy ke nai
            const isItemExist = state.cartItems.find(
                // i. product wo product hy jo action.payload sy bhjen gy hum
                (i) => i.product === item.product
            );
            if(isItemExist){
                return{
                    ...state,
                    cartItems: state.cartItems.map((i) =>
                    i.product === isItemExist.product ? item : i
                  ),
                }
            } else{
                return{
                ...state,
                // this mean jo product hum cart mein add karna chaty hein wo nai hy tu hum wo item cart ke array mein add kar dein gy
                cartItems:[...state.cartItems, item]
                }
            }
            break;
            case REMOVE_CART_ITEM:
              return {
                ...state,
                cartItems: state.cartItems.filter((i) => i.product !== action.payload),
              };

              case SAVE_SHIPPING_INFO:
                return{
                  ...state,
                  shippingInfo: action.payload,
                }
        default:
            return state;
    }

  };