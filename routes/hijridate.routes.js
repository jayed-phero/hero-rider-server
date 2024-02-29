const express = require("express");
const router = express.Router();
const hijriDateController = require("../controller/hijridate.controller");
// GET: Retrieve all HijriDates
router.get("/", hijriDateController.getAllHijriDates);

// GET: Retrieve a specific HijriDate by ID
router.get("/:id", hijriDateController.getHijriDateById);

// POST: Create a new HijriDate
router.post("/create", hijriDateController.createHijriDate);

router.get(
  "/:isUpdate/:hijriMonthNumber",
  hijriDateController.getHijriDatesByUpdateAndMonth
);

module.exports = router;
