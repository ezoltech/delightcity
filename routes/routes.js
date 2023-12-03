const express = require("express");
const contactController = require("../controller/contactController");
const adminController = require("../controller/adminController");
const router = express.Router();

router.post("/contact/create", contactController.create);
router.delete("/contact/delete", contactController.deleteRequest);
router.get("/contact/request", contactController.getContactById);
router.post("/admin/create", adminController.signUp);
router.post("/admin/login", adminController.logIn);
router.put("/admin/update", adminController.updateAdmin);
router.get("/admin/getemail", adminController.getAdminByEmail);
router.delete("/admin/delete", adminController.deleteAdmin); // Route for deleting admin

module.exports = router;
