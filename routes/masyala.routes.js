// masyalas.routes.js
const express = require("express");
const router = express.Router();
const masyalaController = require("../controller/masyala.controller");

// Define routes for masyalas
router.post("/", masyalaController.createMasyala);
router.get("/", masyalaController.getMasyalas);
router.get("/:lecturerId", masyalaController.getMasyalasByLecturerId);
router.get("/item/:masyalaId", masyalaController.getMasyalaById);

module.exports = router;
