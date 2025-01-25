const express = require('express');
const router = express.Router();
const RatingReview = require('../models/reviewSchema');
const verifyToken = require('./auth');  

router.get('/watched-hours/:id',verifyToken,async (req, res) =>
     {
    try
     {
        const userId = req.params.id;
        const reviews = await RatingReview.find({ userId }).populate('animeId');
        const totalWatchedHours = reviews.reduce((total, review) => total + (review.animeId?.progress || 0), 0);
        res.status(200).json({ totalWatchedHours });
    } 
    catch (err)
     {
        res.status(500).json({ error: 'Internal Server Error' });
     }
});

router.get('/top-rated/:id', verifyToken, async (req, res) =>
     {
       try 
    {
        const userId = req.params.id;
        const reviews = await RatingReview.find({ userId }).populate('animeId');
        const animeRatings = {};

        reviews.forEach((review) =>
             {
            if (review.animeId)
                 {
                const animeId = review.animeId._id.toString();
                if (!animeRatings[animeId])
                {
                    animeRatings[animeId] = { anime: review.animeId, totalRating: 0, count: 0 };
                }
                animeRatings[animeId].totalRating += review.rating || 0;
                animeRatings[animeId].count += 1;
            }
        });

        let topRatedAnime = null;
        let highestAverageRating = 0;

        Object.values(animeRatings).forEach(({ anime, totalRating, count }) => {
            const averageRating = totalRating / count;
            if (averageRating > highestAverageRating) {
                highestAverageRating = averageRating;
                topRatedAnime = anime;
            }
        });

        res.status(200).json(topRatedAnime || null);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
