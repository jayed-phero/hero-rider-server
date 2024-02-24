const Solat = require("../../models/foundations/Solat");

const solatController = {
  getAll: async (req, res) => {
    try {
      const solatItems = await Solat.find();
      res.json(solatItems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const solatItem = await Solat.findById(req.params.id);
      if (!solatItem) {
        return res.status(404).json({ message: "Solat item not found" });
      }
      res.json(solatItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    const newSolatItem = new Solat(req.body);
    try {
      const savedSolatItem = await newSolatItem.save();
      res.status(201).json(savedSolatItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateById: async (req, res) => {
    try {
      const updatedSolatItem = await Solat.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedSolatItem) {
        return res.status(404).json({ message: "Solat item not found" });
      }
      res.json(updatedSolatItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteById: async (req, res) => {
    try {
      const deletedSolatItem = await Solat.findByIdAndDelete(req.params.id);
      if (!deletedSolatItem) {
        return res.status(404).json({ message: "Solat item not found" });
      }
      res.json({ message: "Solat item deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = solatController;
