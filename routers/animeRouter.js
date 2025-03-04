const express = require('express');
const router = express.Router();
const Anime = require('../models/animeSchema');
const verifyToken = require('./auth');  

// 3. GET /api/anime - Retrieve all anime
router.get('/', async (req, res) => {
    try {
        const data = await Anime.find(); // Fetch all anime without filtering by userId
        console.log('Anime data fetched');
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 4. GET /api/anime/:id - Retrieve details of a specific anime by its ID
router.get('/:id', async (req, res) => {
    try {
        const animeId = req.params.id;
        const data = await Anime.findById(animeId);
        if (!data) {
            return res.status(404).json({ error: 'Anime not found' });
        }
        console.log('Anime details fetched');
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 5. POST /api/anime - Add a new anime
router.post('/', async (req, res) => {
    try {
        const data = req.body; // Take anime details from request body
        const newAnime = new Anime(data); // Create a new Anime document
        const response = await newAnime.save();
        console.log('Anime added');
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 6. PUT /api/anime/:id - Update an existing anime entry by its ID.
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const animeId = req.params.id;
        const updatedAnimeData = req.body;
        const response = await Anime.findByIdAndUpdate(animeId, updatedAnimeData, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json({ error: 'Anime not found' });
        }

        console.log('Anime data updated');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 7. PUT /api/anime/mark-completed - Update the status of all anime entries to "Completed."
router.put('/mark-completed/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;  // The userId is added by the verifyToken middleware
        const response = await Anime.updateMany(
            { userId, status: { $ne: 'Completed' } },
            { $set: { status: 'Completed' } }
        );

        console.log('Anime marked as completed');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 8. DELETE /api/anime/:id - Remove a specific anime entry by its ID.
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const animeId = req.params.id;
        const response = await Anime.findByIdAndDelete(animeId);
        if (!response) {
            return res.status(404).json({ error: 'Anime not found' });
        }
        console.log('Anime deleted');
        res.status(200).json({ message: 'Anime deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 9. DELETE /api/anime - Remove all anime entries for the authenticated user.
router.delete('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;  // The userId is added by the verifyToken middleware
        const response = await Anime.deleteMany({ userId });
        console.log('All anime deleted');
        res.status(200).json({ message: 'All anime deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 10. GET /api/anime/genre/:genre - Retrieve all anime for a specific genre.
router.get('/genre/:genre', verifyToken, async (req, res) => {
    try {
        const genre = req.params.genre;
        const data = await Anime.find({ genre: genre });
        console.log('Anime by genre fetched');
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 11. GET /api/anime/:status - Retrieve all anime for a specific status (e.g., "Watching," "Completed").
router.get('/status/:status', verifyToken, async (req, res) => {
    try {
        const status = req.params.status;
        const validStatuses = ['Watching', 'Completed', 'Plan to Watch'];

        // Validate the status parameter
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Valid statuses are Watching, Completed, or Plan to Watch.' });
        }

        // Query the database for anime with the specified status
        const data = await Anime.find({ status: status });

        console.log('Anime by status fetched');
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching anime by status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Export router
module.exports = router;
