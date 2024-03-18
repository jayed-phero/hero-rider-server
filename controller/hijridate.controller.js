const HijriDate = require("../models/HijriDate");

// Create a new HijriDate
const createHijriDate = async (req, res) => {
  try {
    const { hijriMonthNumber } = req.body;
    // Check if a HijriDate with the same month number already exists
    const existingHijriDate = await HijriDate.findOne({ hijriMonthNumber });
    if (existingHijriDate) {
      return res.status(400).json({
        message: "HijriDate with the same month number already exists",
      });
    }

    // If not, create a new HijriDate
    const newHijriDate = new HijriDate(req.body);
    await newHijriDate.save();

    res.status(201).json(newHijriDate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getHijriDatesByMonth = async (req, res) => {
  try {
    const { hijriMonthNumber } = req.params;
    const hijriDate = await HijriDate.findOne({
      hijriMonthNumber,
    });

    if (!hijriDate) {
      res
        .status(404)
        .json({ message: "No matching data found", statusCode: 404 });
    } else {
      res.status(200).json({ data: hijriDate, statusCode: 200 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, statusCode: 500 });
  }
};

// Get all HijriDates
const getAllHijriDates = async (req, res) => {
  try {
    const hijriDates = await HijriDate.find();
    res.status(200).json({ data: hijriDates, statusCode: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single HijriDate by ID
const getHijriDateById = async (req, res) => {
  try {
    const hijriDate = await HijriDate.findById(req.params.id);
    if (hijriDate) {
      res.status(200).json(hijriDate);
    } else {
      res.status(404).json({ message: "HijriDate not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a HijriDate by ID
const updateHijriDate = async (req, res) => {
  try {
    const updatedHijriDate = await HijriDate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedHijriDate) {
      res.status(200).json(updatedHijriDate);
    } else {
      res.status(404).json({ message: "HijriDate not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a HijriDate by ID
const deleteHijriDate = async (req, res) => {
  try {
    const deletedHijriDate = await HijriDate.findByIdAndDelete(req.params.id);
    if (deletedHijriDate) {
      res.status(200).json({ message: "HijriDate deleted successfully" });
    } else {
      res.status(404).json({ message: "HijriDate not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export controller functions
module.exports = {
  createHijriDate,
  getAllHijriDates,
  getHijriDateById,
  updateHijriDate,
  deleteHijriDate,
  getHijriDatesByMonth,
};
