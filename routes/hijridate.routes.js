const express = require("express");
const router = express.Router();
const hijriDateController = require("../controller/hijridate.controller");
// GET: Retrieve all HijriDates
router.get("/", hijriDateController.getAllHijriDates);

// GET: Retrieve a specific HijriDate by ID
router.get("/:id", hijriDateController.getHijriDateById);

router.get(
  "/month/:hijriMonthNumber",
  hijriDateController.getHijriDatesByMonth
);

// POST: Create a new HijriDate
router.post("/create", hijriDateController.createHijriDate);

module.exports = router;
