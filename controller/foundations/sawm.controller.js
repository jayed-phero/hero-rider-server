const Sawm = require("../../models/foundations/Sawm");

const sawmController = {
  getAll: async (req, res) => {
    try {
      const sawmItems = await Sawm.find();
      res.json(sawmItems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const sawmItem = await Sawm.findById(req.params.id);
      if (!sawmItem) {
        return res.status(404).json({ message: "Sawm item not found" });
      }
      res.json(sawmItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    const newSawmItem = new Sawm(req.body);
    try {
      const savedSawmItem = await newSawmItem.save();
      res.status(201).json(savedSawmItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateById: async (req, res) => {
    try {
      const updatedSawmItem = await Sawm.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedSawmItem) {
        return res.status(404).json({ message: "Sawm item not found" });
      }
      res.json(updatedSawmItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteById: async (req, res) => {
    try {
      const deletedSawmItem = await Sawm.findByIdAndDelete(req.params.id);
      if (!deletedSawmItem) {
        return res.status(404).json({ message: "Sawm item not found" });
      }
      res.json({ message: "Sawm item deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = sawmController;
