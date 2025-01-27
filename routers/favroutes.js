
const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const Anime = require('../models/animeSchema');
const verifyToken = require('./auth');  

router.post('/', verifyToken, async (req, res) => {
    try {
        const { email, password, animeId } = req.body;

        // Validate required fields
        if (!email || !password || !animeId) {
            return res.status(400).json({ error: 'Email, password, and animeId are required.' });
        }

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        // Check if the anime exists
        const anime = await Anime.findById(animeId);
        if (!anime) {
            return res.status(400).json({ error: 'Anime not found.' });
        }

        // Create a new user
        const newUser = new User({ email, password });

        // Add the anime to the user's favorites
        newUser.favorites.push(animeId);

        // Save the user with the updated favorites list
        const savedUser = await newUser.save();

        console.log('User saved successfully');
        res.status(200).json(savedUser);
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

19.// Retrieve favorites
router.get('/:id',verifyToken, async (req, res) =>
     {
       try 
       {
        const user = await User.findById(req.params.id);
        res.status(200).json(user.favorites);
       }
     catch (err) 
     {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
 });

20.// Remove from favorites
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.params.id; // Get userId from URL params, not body

        // Find the user by ID
        const user = await User.findById(userId);

        // If user is not found, return an error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Filter out the animeId from the favorites list
        const animeIdToRemove = req.body.animeId; // Make sure animeId is passed in the body
        user.favorites = user.favorites.filter(id => id.toString() !== animeIdToRemove);

        // Save the updated user
        await user.save();

        // Send back the updated favorites list
        res.status(200).json(user.favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;