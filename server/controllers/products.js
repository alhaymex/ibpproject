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

exports.addToCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized", status: false });
    }

    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
        status: false,
      });
    }

    const user = await User.findById(req.session.user);

    const productIndex = user.cart.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex > -1) {
      user.cart[productIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    res.status(200).json({
      message: "Product added to cart",
      status: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized", status: false });
    }

    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
        status: false,
      });
    }

    // Find the user in the database
    const user = await User.findById(req.session.user);

    const productIndex = user.cart.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
        status: false,
      });
    }

    if (user.cart[productIndex].quantity <= quantity) {
      user.cart.splice(productIndex, 1);
    } else {
      user.cart[productIndex].quantity -= quantity;
    }

    await user.save();

    res.status(200).json({
      message: "Product removed from cart",
      status: true,
    });
  } catch (error) {
    console.log(error);
    // Send error response
    res.status(500).json({
      message: "An error occurred while removing the product from the cart",
      status: false,
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized", status: false });
    }

    const user = await User.findById(req.session.user);

    const productIds = user.cart.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    const cart = user.cart.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.product.toString()
      );
      return {
        product: {
          _id: product._id,
          name: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
        },
        quantity: item.quantity,
      };
    });

    res.status(200).json({ cart, status: true });
  } catch (error) {
    console.log(error);
  }
};
