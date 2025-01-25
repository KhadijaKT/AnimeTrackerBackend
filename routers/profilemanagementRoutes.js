const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const verifyToken = require('./auth');  

// GET /api/profile/:id - Retrieve the profile information of a user by ID.
router.get('/:id',verifyToken, async (req, res) => {
    try {
        const userId = req.params.id; // Extract user ID from route parameters
        const userProfile = await User.findById(userId).select('-password'); // Exclude password from response
        if (!userProfile) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(userProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/profile/:id - Update user profile details, such as name or password.
router.put('/:id',verifyToken, async (req, res) => {
    try {
        const userId = req.params.id; // Extract user ID from route parameters
        const updatedData = req.body; // Get updated data from request body
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/profile/upload-picture/:id - Update the user's profile picture using ID from parameters.
router.put('/upload-picture/:id',verifyToken, async (req, res) => {
    try {
        const userId = req.params.id; // Extract user ID from route parameters
        const { profilePicture } = req.body; // Assuming the request body contains the picture URL/path
        if (!profilePicture) {
            return res.status(400).json({ error: 'Profile picture is required' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Admin-only: GET /api/admin/users - Retrieve a list of all registered users.
router.get('/admin/users',verifyToken, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Admin-only: DELETE /api/admin/users/:id - Delete a user account by its ID.
router.delete('/admin/users/:id',verifyToken, async (req, res) => {
    try {
        const userId = req.params.id; // Extract user ID from route parameters
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
