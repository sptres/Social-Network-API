const { User, Thought } = require('../models');

const thoughtController = {
    //get all thoughts
    async getThoughts(req, res) {
        try {
            const data = await Thought.find().sort({ createdAt: -1 }); // sort the thoughts so that the newly added thoughts show up first
            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // get a single thought by id params
    async getSingleThought(req, res) {
        try {
            const data = await Thought.findOne({ _id: req.params.thoughtId });

            if (!data) {
                return res.status(404).json({ message: 'No thought with such id!' });
            }

            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // create thought
    async createThought(req, res) {
        try {
            const thoughtData = await Thought.create(req.body);
            const userData = await User.findOneAndUpdate({ _id: req.body.userId }, { $push: { thoughts: thoughtData._id }}, { new: true });

            if (!userData) {
                return res.status(404).json({ message: 'User with such id was not found!' });
            }

            res.json({ message: 'Thought successfully created and linked to id!' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // delete thought
    async deleteThought(req, res) {
        try {
            const thoughtData = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

            if (!thoughtData) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
            // delete association of thoughts and user by id 
            const userData = User.findOneAndUpdate({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId }}, { new: true });

            if (!userData) {
                return res.status(404).json({ message: 'Thought not associated with such id!' });
            }

            res.json({ message: 'Thought successfully deleted!' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // update thought
    async updateThought(req, res) {
        try {
            const data = await Thought.findOneAndUpdate({ _id: req.params.thoughtId}, { $set: req.body }, { runValidators: true, new: true });

            if(!data) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(data);
            res.json({ message: 'Thought successfully updated!' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // add reaction to thought
    async addReaction(req, res) {
        try {
            const data = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body }}, { runValidators: true, new: true });

            if(!data) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(data);
            res.json({ message: 'Reaction added to the thought!' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // delete reaction from thought
    async deleteReaction(req, res) {
        try {
            const data = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.params.reactionId }}}, { runValidators: true, new: true});

            if (!data) {
                return res.status(400).json({ message: 'No thought with this id!' });
            }

            res.json(data);
            res.json({ message: 'Reaction removed from the thought!' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
};

module.exports = thoughtController;