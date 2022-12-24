import {
  ADMIN_COLLECTOR_REQUEST,
  ADMIN_COLLECTOR_SUCCESS,
  ADMIN_COLLECTOR_FAIL,
  NEW_COLLECTOR_REQUEST,
  NEW_COLLECTOR_SUCCESS,
  NEW_COLLECTOR_FAIL,
  NEW_COLLECTOR_RESET,
  DELETE_COLLECTOR_REQUEST,
  DELETE_COLLECTOR_SUCCESS,
  DELETE_COLLECTOR_FAIL,
  DELETE_COLLECTOR_RESET,
  UPDATE_COLLECTOR_REQUEST,
  UPDATE_COLLECTOR_SUCCESS,
  UPDATE_COLLECTOR_FAIL,
  UPDATE_COLLECTOR_RESET,
  
  COLLECTOR_DETAILS_REQUEST,
  COLLECTOR_DETAILS_SUCCESS,
  COLLECTOR_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constants/collectorConstants";

// we pass COLLECTOR empty array in the COLLECTOR reducer
export const collectorsReducer = (state = { collectors: [] }, action) => {
  switch (action.type) {
    case ADMIN_COLLECTOR_REQUEST:
      return {
        loading: true,
        collectors: [],
      };
    case ADMIN_COLLECTOR_SUCCESS:
      return {
        loading: false,
        collectors: action.payload,
      };
    case ADMIN_COLLECTOR_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

//-------------------------------------------------------------------------------
// New Collector Reducer
//-------------------------------------------------------------------------------
export const newCollectorReducer = (state = { collectors: {} }, action) => {
  switch (action.type) {
    case NEW_COLLECTOR_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_COLLECTOR_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        collector: action.payload.collector,
      };
    case NEW_COLLECTOR_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_COLLECTOR_RESET:
      return {
        ...state,
        success: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

//-------------------------------------------------------------------------------
// Del and update product reducer admin
//-------------------------------------------------------------------------------
export const collectorReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_COLLECTOR_REQUEST:
    case UPDATE_COLLECTOR_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_COLLECTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_COLLECTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_COLLECTOR_FAIL:
    case UPDATE_COLLECTOR_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_COLLECTOR_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_COLLECTOR_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const collectorDetailsReducer = (state = { collector: {} }, action) => {
  switch (action.type) {
    case COLLECTOR_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case COLLECTOR_DETAILS_SUCCESS:
      return {
        loading: false,
        collector: action.payload,
      };
    case COLLECTOR_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};