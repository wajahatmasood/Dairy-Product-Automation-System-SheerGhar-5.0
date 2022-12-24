import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAdminCollector,
  deleteCollector,
} from "../../actions/collectorAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { DELETE_COLLECTOR_RESET } from "../../constants/collectorConstants";

const CollectorList = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  // const { collectors } = useSelector((state) => state.collectors);
  const { collectors, error } = useSelector((state) => state.allCollector);

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.allCollector
  );
  const deleteControllerHandler = (id) => {
    dispatch(deleteCollector(id));
    alert.success("Collector Deleted Successfully");
    history.push("/admin/dashboard");
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Collector Deleted Successfully");
      history.push("/admin/dashboard");
      dispatch({ type: DELETE_COLLECTOR_RESET });
    }

    dispatch(getAdminCollector());
  }, [dispatch, alert, error, deleteError, isDeleted, history]);
  const columns = [
    { field: "id", headerName: "Collector ID", minWidth: 300, flex: 0.5 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "dairyname",
      headerName: "Dairy Name",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "phonenumber",
      headerName: "Phone Number",
      type: "number",
      minWidth: 230,
      flex: 0.3,
    },
    {
      field: "location",
      headerName: "Location",
      type: "number",
      minWidth: 300,
      flex: 0.7,
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/collector/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
            onClick={() =>
              deleteControllerHandler(params.getValue(params.id, "id"))
            }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  collectors &&
    collectors.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        dairyname: item.dairyname,
        phonenumber: item.phonenumber,
        location: item.location,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL Collector - Admin`} />

      <div className="dashboard">
        <SideBar />

        <div className="productListContainer">
          <h1 id="productListHeading">ALL Collectors</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default CollectorList;
