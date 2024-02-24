const Shahada = require("../../models/foundations/Shahada");

const shahadaController = {
  getAll: async (req, res) => {
    try {
      const shahadaItems = await Shahada.find();
      res.json(shahadaItems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const shahadaItem = await Shahada.findById(req.params.id);
      if (!shahadaItem) {
        return res.status(404).json({ message: "Shahada item not found" });
      }
      res.json(shahadaItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    const newShahadaItem = new Shahada(req.body);
    try {
      const savedShahadaItem = await newShahadaItem.save();
      res.status(201).json(savedShahadaItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateById: async (req, res) => {
    try {
      const updatedShahadaItem = await Shahada.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedShahadaItem) {
        return res.status(404).json({ message: "Shahada item not found" });
      }
      res.json(updatedShahadaItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteById: async (req, res) => {
    try {
      const deletedShahadaItem = await Shahada.findByIdAndDelete(req.params.id);
      if (!deletedShahadaItem) {
        return res.status(404).json({ message: "Shahada item not found" });
      }
      res.json({ message: "Shahada item deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = shahadaController;
