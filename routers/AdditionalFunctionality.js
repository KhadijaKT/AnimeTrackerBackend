const express = require('express');
const router = express.Router();
const Anime = require('../models/animeSchema');
const Genre = require('../models/genreSchema');
const verifyToken = require('./auth');  


// Search for anime by title (case-insensitive)
router.get('/anime/title',verifyToken, async (req, res) => {
    try {
        const { title } = req.query;
        const anime = await Anime.find({ title: new RegExp(title, 'i') });
        res.json(anime);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Retrieve the top 10 most popular genres
router.get('/genres/popular',verifyToken, async (req, res) => {
    try {
        const popularGenres = await Genre.find().sort({ popularity: -1 }).limit(10);
        res.json(popularGenres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add or update a user's rating for a specific anime
router.put('/anime/rate/:id',verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const updatedAnime = await Anime.findByIdAndUpdate(id, { userRating: rating }, { new: true });
        res.json(updatedAnime);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
