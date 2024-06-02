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
