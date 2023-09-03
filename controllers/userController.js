const { User, Thought } = require('../models');

const userController = {
    // get all users
    async getUsers(req, res) {
        try {
            const data = await User.find()
            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json(err); 
        }
    },
    // get a single user by id params
    async getSingleUser(req, res) {
        try {
            const data = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                .populate('friends')
                .populate('thoughts');

            if (!data) {
                return res.status(400).json({ message: 'No user with such id in database!' });
            }

            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // create new user
    async createUser(req, res) {
        try {
            const data = await User.create(req.body);
            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // delete user by id
    async deleteUser(req, res) {
        try {
            const data = await User.findOneAndDelete({ _id: req.params.userId })

            if(!data) {
                return res.status(404).json({ message: 'No user with such id in database!' });
            }
            // delete 'thoughts' associated with user being deleted
            await Thought.deleteMany({ _id: { $in: data.thoughts }});
            res.json({ message: 'User and associated thoughts successfully deleted!' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // update user by id
    async updateUser(req, res) {
        try {
            const data = await User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body, }, { runValidators: true, new: true, });

            if (!data) {
                return res.status(404).json({ message: 'No user with such id in database!' });
            }

            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // add friend
    async addFriend(req, res) {
        try {
            const data = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId }}, { new: true });

            if(!data) {
                return res.status(400).json({ message: 'No user with such id in database!' });
            }

            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // delete friend
    async deleteFriend(req, res) {
        try {
            const data = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId }}, { new: true });

            if(!data) {
                return res.status(400).json({ message: 'No user with such id in database!' });
            }

            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
};

module.exports = userController;