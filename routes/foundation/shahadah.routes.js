const express = require("express");
const router = express.Router();
const ShahadaController = require("../../controller/foundations/sahadah.controller");

// Route to create a new Shahada item
router.post("/create", ShahadaController.createShahada);

// Route to add data to an existing Shahada item's detailInfo
router.put("/shahada/:id/detail-info", ShahadaController.addToDetailInfo);

// Route to update an existing Shahada item
router.put("/shahada/:id", ShahadaController.updateShahada);

// Route to delete an existing Shahada item
router.delete("/shahada/:id", ShahadaController.deleteShahada);

module.exports = router;
