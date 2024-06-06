const User = require("../models/user");
const Product = require("../models/product");

exports.new = async (req, res) => {
  try {
    if (!req.session.user) {
      console.log("User not logged in");
    }
    if (!req.session.user)
      return res.status(401).json({ message: "Unauthorized", status: false });

    const user = await User.findById(req.session.user);
    if (user.role !== "admin")
      return res.status(401).json({ message: "Unauthorized", status: false });

    const { title, image, price, description } = req.body;

    const product = new Product({
      title,
      description,
      price,
      image,
    });

    await product.save();
    res
      .status(200)
      .json({ message: "Product created successfully!", status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!", status: false });
  }
};

exports.getAll = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Sort products by createdAt field in descending order
    res.status(200).json({ products, status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!", status: false });
  }
};
