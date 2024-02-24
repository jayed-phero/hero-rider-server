const Hajj = require("../../models/foundations/Hajj");

const hajjController = {
  getAll: async (req, res) => {
    try {
      const hajjItems = await Hajj.find();
      res.json(hajjItems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const hajjItem = await Hajj.findById(req.params.id);
      if (!hajjItem) {
        return res.status(404).json({ message: "Hajj item not found" });
      }
      res.json(hajjItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    const newHajjItem = new Hajj(req.body);
    try {
      const savedHajjItem = await newHajjItem.save();
      res.status(201).json(savedHajjItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateById: async (req, res) => {
    try {
      const updatedHajjItem = await Hajj.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedHajjItem) {
        return res.status(404).json({ message: "Hajj item not found" });
      }
      res.json(updatedHajjItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteById: async (req, res) => {
    try {
      const deletedHajjItem = await Hajj.findByIdAndDelete(req.params.id);
      if (!deletedHajjItem) {
        return res.status(404).json({ message: "Hajj item not found" });
      }
      res.json({ message: "Hajj item deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = hajjController;
