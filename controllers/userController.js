const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { username } = req.query;
        const filter = { isDeleted: false };
        if (username) {
            filter.username = { $regex: username, $options: 'i' };
        }
        const users = await User.find(filter).populate('role').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        ).populate('role');

        if (!user) return res.status(404).json({ error: 'User not found or deleted' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.softDeleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found or already deleted' });
        res.json({ message: 'User soft deleted', data: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.enableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        if (!email || !username) return res.status(400).json({ error: 'email and username required' });

        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found or invalid credentials' });
        res.json({ message: 'User enabled', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.disableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        if (!email || !username) return res.status(400).json({ error: 'email and username required' });

        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found or invalid credentials' });
        res.json({ message: 'User disabled', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsersByRoleId = async (req, res) => {
    try {
        const roleId = req.params.id;
        const users = await User.find({ role: roleId, isDeleted: false }).populate('role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
