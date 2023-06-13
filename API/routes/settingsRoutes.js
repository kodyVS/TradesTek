const express = require("express");
const settingsController = require("../controllers/settingsController");
const router = express.Router();
const authController = require("../controllers/authController");
//router.use(authController.protect);
// /api/v1/settings
router.route("/edit").post(settingsController.editSettings);
router.route("/all").get(settingsController.getSettings);

router.route("/create").post(settingsController.createSettings);
module.exports = router;
