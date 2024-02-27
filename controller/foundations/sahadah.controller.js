const Shahada = require("../../models/foundations/Shahada");

// Function to create a new Shahada item
async function createShahada(req, res) {
  try {
    // const { title, image, detailInfo } = req.body;
    // const existing = await Shahada.find({ title: req.title });
    // if (existing) {
    //   return res
    //     .status(401)
    //     .json({ message: "Shahada same title alredy exists" });
    // }
    const shahada = new Shahada(req.body);
    const savedShahada = await shahada.save();
    res.status(201).json({
      statusCode: 200,
      message: "Shahada Item Created Successfully",
      id: savedShahada._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, statusCode: 400 });
    console.log(error);
  }
}

// Function to add data to an existing Shahada item's detailInfo
async function addToDetailInfo(req, res) {
  try {
    const { id } = req.params;
    const { banner, title, parts } = req.body;
    const shahada = await Shahada.findById(id);
    if (!shahada) {
      return res
        .status(404)
        .json({ message: "Shahada not found", statusCode: 404 });
    }
    shahada.detailInfo.push({ banner, title, parts });
    const updatedShahada = await shahada.save();
    res.json(updatedShahada);
  } catch (error) {
    res.status(400).json({ message: error.message, statusCode: 400 });
  }
}

// Function to update an existing Shahada item
async function updateShahada(req, res) {
  try {
    const { id } = req.params;
    const { title, image, detailInfo } = req.body;
    const shahada = await Shahada.findByIdAndUpdate(
      id,
      { title, image, detailInfo },
      { new: true }
    );
    if (!shahada) {
      return res.status(404).json({ message: "Shahada not found" });
    }
    res.json(shahada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Function to delete an existing Shahada item
async function deleteShahada(req, res) {
  try {
    const { id } = req.params;
    const shahada = await Shahada.findByIdAndDelete(id);
    if (!shahada) {
      return res.status(404).json({ message: "Shahada not found" });
    }
    res.json({ message: "Shahada deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createShahada,
  addToDetailInfo,
  updateShahada,
  deleteShahada,
};
