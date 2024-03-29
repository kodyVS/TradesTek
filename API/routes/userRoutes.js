const express = require("express");
//const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
//app.use("/api/v1/users", userRoutes);
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/autoLogin", authController.autoLogin);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);
router.get("/all", userController.getAllUsers);
router.get("/getUser", userController.getUser);
router.post("/editUser", userController.editUser);
router.patch("/updateMyPassword", authController.updatePassword);
//router.get("/me", userController.getMe, userController.getUser);

module.exports = router;
