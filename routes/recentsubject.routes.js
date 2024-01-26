const express = require("express");
const router = express.Router();

const recentSubjectController = require("../controller/recentSubject.controller");

router.post("/create", recentSubjectController.createRecentSubject);
router.get("/", recentSubjectController.getAllRecentSubjects);
router.get("/types/:type", recentSubjectController.getRecentSubjectsByType);
router.get("/getone/:id", recentSubjectController.getRecentSubjectById);
router.put("/update/:id", recentSubjectController.updateRecentSubject);
router.patch("/trash/:id", recentSubjectController.moveToTrash);
router.delete("/delete/:id", recentSubjectController.deleteRecentSubject);

module.exports = router;
