const express = require("express");
const {
  addCollector,
  getAllCollector,
  updateCollector,
  deleteCollector,
  getCollectorDetils,
} = require("../controllers/collectorController");
const { isAunthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router
  .route("/admin/collector/new")
  .post(isAunthenticatedUser, authorizeRoles("admin", "manager"), addCollector);
router
  .route("/admin/collectors")
  .get(isAunthenticatedUser, authorizeRoles("admin", "manager"), getAllCollector);
router
  .route("/admin/collector/:id")
  .put(isAunthenticatedUser, authorizeRoles("admin", "manager"), updateCollector)
  .delete(isAunthenticatedUser, authorizeRoles("admin", "manager"), deleteCollector);
router
  .route("/admin/collector/:id").get(isAunthenticatedUser, authorizeRoles("admin", "manager"),getCollectorDetils);

module.exports = router;
