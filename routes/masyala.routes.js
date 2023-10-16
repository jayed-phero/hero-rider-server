// masyalas.routes.js
const express = require("express");
const router = express.Router();
const masyalaController = require("../controllers/masyala.controller");

// Define routes for masyalas
router.post("/", masyalaController.createMasyala);
router.get("/", masyalaController.getAllMasyalas);
router.get("/:lecturerId", masyalaController.getMasyalasByLecturerId);

module.exports = router;
