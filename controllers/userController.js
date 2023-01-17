const User = require("../models/User");

const userController = {
  getAllUsers(req, res) {
    console.log("reach all users");
    User.find()
      .select("-__v")
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).json(err);
      });
  },
  getUsersById(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new users
  createUsers(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },
  // update users
  updateUsers({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUsersData) => {
        if (!dbUsersData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  // delete users
  deleteUsers({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then((dbUsersData) => {
        if (!dbUsersData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        res.json(dbUsersData);
      })
      .catch((err) => res.status(400).json(err));
  },
  // add friend
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbUsersData) => {
        if (!dbUsersData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        res.json(dbUsersData);
      })
      .catch((err) => res.json(err));
  },
  // delete friend
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbUsersData) => {
        if (!dbUsersData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        res.json(dbUsersData);
      })
      .catch((err) => res.status(400).json(err));
  },
};
// Export module users controller
module.exports = userController;
