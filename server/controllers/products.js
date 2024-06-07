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
    // Check if the user is logged in
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized", status: false });
    }

    // Fetch the user from the database
    const user = await User.findById(req.session.user);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    // Extract product IDs from the user's cart
    const productIds = user.cart.map((item) => item.product);

    // Fetch products from the database
    const products = await Product.find({ _id: { $in: productIds } });

    // Map user cart to include detailed product information
    const cart = user.cart
      .map((item) => {
        const product = products.find(
          (p) => p._id.toString() === item.product.toString()
        );
        if (!product) {
          return null; // Skip if the product was not found (can handle this better if needed)
        }
        return {
          product: {
            _id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            image: product.image,
          },
          quantity: item.quantity,
        };
      })
      .filter((cartItem) => cartItem !== null); // Remove null entries

    // Respond with the cart details
    res.status(200).json({ cart, status: true });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Something went wrong!", status: false });
  }
};

exports.get = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res
      .status(404)
      .json({ message: "Product not found", status: false });
  }

  res.status(200).json({ product, status: true });
};

exports.editProduct = async (req, res) => {
  try {
    if (!req.session.user) {
      console.log("User not logged in");
    }
    if (!req.session.user)
      return res.status(401).json({ message: "Unauthorized", status: false });

    const user = await User.findById(req.session.user);
    if (user.role !== "admin")
      return res.status(401).json({ message: "Unauthorized", status: false });

    const { _id, title, image, price, description } = req.body;

    const product = await Product.findById(_id);
    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found", status: false });

    if (title) product.title = title;
    if (image) product.image = image;
    if (price) product.price = price;
    if (description) product.description = description;

    await product.save();

    res
      .status(200)
      .json({ message: "Product updated successfully!", status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!", status: false });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized", status: false });
    }

    const user = await User.findById(req.session.user);
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized", status: false });
    }

    const productId = req.body.id;

    if (!productId) {
      return res
        .status(400)
        .json({ message: "Product ID is required", status: false });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", status: false });
    }

    await Product.findByIdAndDelete(productId);

    res
      .status(200)
      .json({ message: "Product deleted successfully", status: true });
  } catch (error) {
    // Handle any errors
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error", status: false });
  }
};
