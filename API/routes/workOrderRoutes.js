const express = require("express");
const workOrderController = require("../controllers/workOrderController");
const authController = require("./../controllers/authController");
const router = express.Router();

//* /api/v1/workOrder
router.use(authController.protect);
router.route("/allActive").get(workOrderController.getAllActiveWorkOrders);
router.route("/all").get(workOrderController.getAllWorkOrders);
router.route("/:id").get(workOrderController.getOneWorkOrder);
router.route("/complete").post(workOrderController.completeWorkOrder);

router.route("/add").post(workOrderController.addWorkOrder);
router.route("/edit").post(workOrderController.editWorkOrder);
router.route("/delete").post(workOrderController.deleteWorkOrder);
router.post(
  "/upload",
  workOrderController.uploadSinglePhoto,
  workOrderController.uploadImage
);
router.patch("/deleteImage", workOrderController.deleteImage);
module.exports = router;

//NEXT DAY MAKE DELETE IMAGE ROUTE
