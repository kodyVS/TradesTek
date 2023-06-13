const express = require("express");
const jobController = require("../controllers/jobController");
const router = express.Router();
const authController = require("../controllers/authController");
router.use(authController.protect);
// /api/v1/job
router.route("/all").get(jobController.getAllJobs);
router.route("/:id").get(jobController.getOneJob);

router.route("/add").post(jobController.addJob);
router.route("/edit").post(jobController.editJob);
router.route("/delete").post(jobController.deleteJob);

module.exports = router;
