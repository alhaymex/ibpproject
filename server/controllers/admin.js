const User = require("../models/user");

exports.search = async (req, res) => {
  const { q } = req.params;

  const fintdusers = await User.find({
    $or: [
      {
        firstname: { $regex: q, $options: "i" },
      },
    ],
  });

  const users = [
    ...fintdusers.map((user) => ({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    })),
  ];

  res.json(users);
};

exports.getUser = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Access Denied", status: false });
    }

    const adminId = req.session.user;

    const isAdmin = await User.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(401).json({ message: "Access Denied", status: false });
    }

    const { id } = req.params;

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(200).json({ message: "User not found", status: false });
    }

    const resUser = {
      image: user.profile,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    res.status(200).json({ status: true, user: resUser });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server Error", status: false });
  }
};
