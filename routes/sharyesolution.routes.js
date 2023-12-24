// masyalas.routes.js
const express = require("express");
const router = express.Router();
const shariyahSolutionController = require("../controller/sharyeSolution.controller");

// Define routes for masyalas
router.post("/", shariyahSolutionController.createSharyeSolution);
router.get("/", shariyahSolutionController.getSharyeSolutions);
router.get(
  "/:lecturerId",
  shariyahSolutionController.getSharyeSolutionsByLecturerId
);
router.get(
  "/item/:sharyeSolutionId",
  shariyahSolutionController.getSharyeSolutionById
);
router.patch(
  "/item/:sharyeSolutionId",
  shariyahSolutionController.updateSharyeSolution
);

module.exports = router;
