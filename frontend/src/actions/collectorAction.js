import axios from "axios";
import {
  COLLECTOR_DETAILS_REQUEST,
  COLLECTOR_DETAILS_SUCCESS,
  COLLECTOR_DETAILS_FAIL,
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
  CLEAR_ERRORS,
} from "../constants/collectorConstants";

//----------------------------------------------------
// Get All Collector For Admin
//----------------------------------------------------
export const getAdminCollector = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_COLLECTOR_REQUEST });
    const { data } = await axios.get("/api/v1/admin/collectors");
    dispatch({
      type: ADMIN_COLLECTOR_SUCCESS,
      payload: data.collectors,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_COLLECTOR_FAIL,
      payload: error.response.data.message,
    });
  }
};
//----------------------------------------------------
// Create Collector
//----------------------------------------------------

export const createCollector = (collectorData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_COLLECTOR_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      `/api/v1/admin/collector/new`,
      collectorData,
      config
    );
    dispatch({
      type: NEW_COLLECTOR_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_COLLECTOR_FAIL,
      payload: error.response.data.message,
    });
  }
};
//----------------------------------------------------
// Update Collector
//----------------------------------------------------
export const updateCollector = (id, collectorData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_COLLECTOR_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.put(
      `/api/v1/admin/collector/${id}`,
      collectorData,
      config
    );

    dispatch({
      type: UPDATE_COLLECTOR_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_COLLECTOR_FAIL,
      payload: error.response.data.message,
    });
  }
};
//-------------------------------------------------------------------------------
// Product Detail Action
//-------------------------------------------------------------------------------
export const getCollectorDetails = (id) => async (dispatch) => {
  try {
    console.log("test")
    dispatch({
      type: COLLECTOR_DETAILS_REQUEST,
    });
    // hamy yaha id se data fetch karna hy so hum axios sy id nikalen gy
    const { data } = await axios.get(`/api/v1/admin/collector/${id}`);
    console.log(data)
    // from above line we get the data ==> now we dispatch the data
    dispatch({
      type: COLLECTOR_DETAILS_SUCCESS,
      payload: data.collector,
    });
  } catch (error) {
    dispatch({
      type: COLLECTOR_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};
//----------------------------------------------------
// Delete Collector
//----------------------------------------------------

export const deleteCollector = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_COLLECTOR_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/collector/${id}`);

    dispatch({
      type: DELETE_COLLECTOR_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_COLLECTOR_FAIL,
      payload: error.response.data.message,
    });
  }
};
//-------------------------------------------------------------------------------
// this is use to null all the 
//-------------------------------------------------------------------------------
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
