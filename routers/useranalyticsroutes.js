const express = require('express');
const router = express.Router();
const Anime = require('../models/animeSchema');
const verifyToken = require('./auth');  

// Calculate total watched hours
router.get('/watched-hours/:id',verifyToken, async (req, res) => 
    {
    try {
        const userId = req.params.id; 

        const userAnimes = await Anime.find({ userId, status: 'Completed' }); 

        const totalWatchedHours = userAnimes.reduce((total, anime) => total + anime.progress, 0); 

        res.status(200).json({
            totalWatchedHours
        });
    } 
    catch (err) 
    {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get top-rated anime
router.get('/top-rated/:id',verifyToken, async (req, res) =>
     {
    try {
        const userId = req.params.id; 

        const userAnimes = await Anime.find({ userId }); 
        if (userAnimes.length > 0)
             {
            const topRatedAnime = userAnimes.reduce((top, anime) => (anime.rating > top.rating ? anime : top), userAnimes[0]); 
            res.status(200).json(topRatedAnime);
        } else 
        {
            res.status(404).json({ error: 'No anime found for this user' });
        }
    } 
    catch (err)
     {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET most-watched-genre based on the user's collection.
router.get('/:id',verifyToken, async (req, res) => {
    try {
        const userId = req.params.id; 
        const userAnimes = await Anime.find({ userId });

        const genreCount = {};
        userAnimes.forEach(anime => {
            anime.genre.forEach(genre => {
                genreCount[genre] = (genreCount[genre] || 0) + 1;
            });
        });

        const mostWatchedGenre = Object.keys(genreCount).reduce((a, b) => genreCount[a] > genreCount[b] ? a : b);
        res.status(200).json({ mostWatchedGenre });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    
    }
});
// GET total-anime in the user's collection.
router.get('/total-anime/:id',verifyToken, async (req, res) => {
    try {
        const userId = req.params.id; 
        const totalAnime = await Anime.countDocuments({ userId });
        res.status(200).json({ totalAnime });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// GET completed-percentage of anime marked as "Completed" by the user.
router.get('/completed-percentage/:id',verifyToken, async (req, res) => {
    try {
        const userId = req.params.id; 
        const totalAnime = await Anime.countDocuments({ userId });
        const completedAnime = await Anime.countDocuments({ userId, status: 'Completed' });

        const completedPercentage = totalAnime > 0 ? (completedAnime / totalAnime) * 100 : 0;
        res.status(200).json({ completedPercentage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
