const express = require('express');
const router = express.Router();
const Anime = require('../models/animeSchema');

// Calculate total watched hours
router.get('/useranalytics/watched-hours/:id', async (req, res) => 
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
router.get('/useranalytics/top-rated/:id', async (req, res) =>
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
module.exports = router;
