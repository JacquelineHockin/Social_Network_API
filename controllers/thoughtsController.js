const { Thoughts, User } = require("../models");

const thoughtsController = {
  getAllThoughts(req, res) {
    Thoughts.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  getThoughtsById(req, res) {
    Thoughts.findOne({ _id: req.params.thoughtsId })
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: "No thoughts with that ID" })
          : res.json(thoughts)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new thoughts
  createThoughts(req, res) {
    Thoughts.create(req.body)
      .then((thoughts) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thoughts._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "thoughts created, but found no user with that ID",
            })
          : res.json("Created the thoughts 💭")
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  updateThoughts(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtsId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: "No thoughts with this id!" })
          : res.json(thoughts)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  deleteThoughts(req, res) {
    Thoughts.findOneAndRemove({ _id: req.params.thoughtsId })
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: "No thoughts with this id!" })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtsId },
              { $pull: { thoughts: req.params.thoughtsId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "thoughts created but no user with this id!" })
          : res.json({ message: "thoughts successfully deleted!" })
      )
      .catch((err) => res.status(500).json(err));
  },
  // Add a thoughts reactions
  addReaction({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtsId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dbthoughtsData) => {
        if (!dbthoughtsData) {
          res
            .status(404)
            .json({ message: "No thoughts with this particular ID!" });
          return;
        }
        res.json(dbthoughtsData);
      })
      .catch((err) => res.status(400).json(err));
  },
  // Remove thoughts response
  deleteReaction({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtsId },
      { $pull: { reactions: { reactionsId: body.reactionsId } } },
      { new: true, runValidators: true }
    )
      .then((dbthoughtsData) => {
        if (!dbthoughtsData) {
          res.status(404).json({ message: "No thoughts found with this id" });
          return;
        }
        res.json({ message: "Successfully deleted the reaction" });
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = thoughtsController;
