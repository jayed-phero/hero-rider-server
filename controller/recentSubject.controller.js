const RecentSubject = require("../models/RecentSebjects");

const handleErrors = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
};

const createRecentSubject = async (req, res) => {
  try {
    const newSubject = new RecentSubject(req.body);
    const savedSubject = await newSubject.save();
    res.json({ status: "success", id: savedSubject._id });
  } catch (error) {
    handleErrors(res, error);
  }
};
const getAllRecentSubjects = async (req, res) => {
  try {
    const [data, notification] = await Promise.all([
      RecentSubject.find({ type: "default" }),
      RecentSubject.find({ type: "notification" }),
    ]);

    res.status(200).json({
      status: "success",
      data: data,
      notification: notification,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

const getRecentSubjectsByType = async (req, res) => {
  try {
    const { type } = req.params;

    const subjects = await RecentSubject.find({ type: type });

    if (!subjects || subjects.length === 0) {
      return res
        .status(404)
        .json({ message: "No subjects found for the specified type" });
    }

    res.status(200).json({ status: "success", data: subjects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecentSubjectById = async (req, res) => {
  try {
    const subject = await RecentSubject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.status(200).json(subject);
  } catch (error) {
    handleErrors(res, error);
  }
};

const updateRecentSubject = async (req, res) => {
  try {
    const updatedSubject = await RecentSubject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.status(200).json(updatedSubject);
  } catch (error) {
    handleErrors(res, error);
  }
};

const moveToTrash = async (req, res) => {
  try {
    const trashedSubject = await RecentSubject.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );
    if (!trashedSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.status(200).json(trashedSubject);
  } catch (error) {
    handleErrors(res, error);
  }
};

const deleteRecentSubject = async (req, res) => {
  try {
    const deletedSubject = await RecentSubject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.status(200).json(deletedSubject);
  } catch (error) {
    handleErrors(res, error);
  }
};

module.exports = {
  createRecentSubject,
  getAllRecentSubjects,
  getRecentSubjectById,
  updateRecentSubject,
  moveToTrash,
  deleteRecentSubject,
  getRecentSubjectsByType,
};
