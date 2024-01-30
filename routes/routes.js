const express = require("express");
const contactController = require("../controller/contactController");
const adminController = require("../controller/adminController");
const servicesController = require("../controller/servicesController");
const contentController = require("../controller/contentController");
const galleryController = require("../controller/galleryController");
const carouselController = require("../controller/carouselController");
const specialController = require("../controller/specialServiceController");
const router = express.Router();

router.post("/contact/create", contactController.create);
router.delete("/contact/delete", contactController.deleteRequest);
router.get("/contact/request", contactController.getContactById);
router.post("/admin/create", adminController.signUp);
router.post("/admin/login", adminController.logIn);
router.put("/admin/update", adminController.updateAdmin);
router.get("/admin/getadmin/:id", adminController.getAdminById);
router.delete("/admin/delete/:id", adminController.deleteAdminById);
router.delete("/admin/clear", adminController.deleAllAdmins);
router.delete("/contact/clear", contactController.deleAllContacts);
router.get("/admin/alladmins", adminController.getAllAdmins);
router.get("/admin/general", adminController.miniData);
router.get("/contact/allcontacts", contactController.getAllContacts);
router.post("/services/create", servicesController.create);
router.get("/services/allservices", servicesController.getAllServices);
router.delete("/services/deleteall", servicesController.deleteAllServices);
router.delete("/services/delete/:id", servicesController.deleteById);
router.put("/services/update/:id", servicesController.update);

router.post("/contents/create", contentController.create);
router.put("/contents/update/:id", contentController.updateContentById);
router.delete("/contents/delete/:id", contentController.deleteContentById);
router.delete("/contents/deleteall", contentController.deleteAllContents);
// router.get("/contents/lists", contentController.getContenttById);
router.get("/contents/lists/:place", contentController.getContentDataByPlace);
// router.get("/contents/get-three", contentController.getContentLastThree);
router.get("/contents/all", contentController.getAllContents);
router.get("/contents/get/:id", contentController.getContenttById);
router.post("/photo/create", galleryController.addPhoto);
router.get("/photo/getall", galleryController.getAllPhotos);
router.delete("/photo/delete/:id", galleryController.deletePhotoById);
router.put("/photo/update/:id", galleryController.updatePhotoById);
router.delete("/photo/deleteall", galleryController.deleteAllPhotos);
router.post("/carousel/create", carouselController.create);
router.put("/carousel/update/:id", carouselController.updateCarouselById);
router.get("/carousel/lists/:place", carouselController.getCarouselDataByPlace);
router.get("/carousel/getall", carouselController.getAllCarousels);
router.delete("/carousel/delete/:id", carouselController.deleteCArouselById);
router.delete("/carousel/deleteall", carouselController.deleteAllCarousels);
// /////////////////////////////////////////////////////////////////
// router.post("/special/gold/create", specialController.createGold);
// router.put("/special/gold/update/:id", specialController.updateGoldById);
// router.get("/special/gold/getall", specialController.getAllGoldData);
// router.delete("/special/gold/delete/:id", specialController.deleteGoldById);
// router.delete(
//   "/special/gold/deleteall",
//   specialController.deleteAllGoldServices
// );
// // ///////////////////////////////////////////////////////////////////////////

// router.post("/special/platinum/create", specialController.createPlatinum);
// router.put(
//   "/special/platinum/update/:id",
//   specialController.updatePlatniumById
// );
// router.get("/special/platinum/getall", specialController.getAllPlatinumData);
// router.delete(
//   "/special/platinum/delete/:id",
//   specialController.deletePlatinumById
// );
// router.delete(
//   "/special/platinum/deleteall",
//   specialController.getAllPlatinumData
// );

module.exports = router;
