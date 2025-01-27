
const express = require('express');
const router = express.Router();
const Genre = require('../models/genreSchema');
const Anime = require('../models/animeSchema');
const verifyToken = require('./auth');  
12.// Retrieve unique genres in user's collection
router.get('/uniquegenre',verifyToken,async (req, res) => 
    {
     try
       {
        const uniqueGenres = await Anime.distinct('genre');
        res.status(200).json(uniqueGenres);
     } 
    catch (err) 
        {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
        }
});

router.post('/add/:name', verifyToken, async (req, res) => {
  try {
    const name = req.params.name; // Extract 'name' from the URL parameter

    // Check if the genre already exists
    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      return res.status(400).json({ error: 'Genre already exists' });
    }

    // Create a new genre
    const newGenre = new Genre({ name });

    // Save the genre to the database
    const response = await newGenre.save();
    console.log('Genre saved:', response);
    res.status(201).json(response);
  } catch (err) {
    console.error('Error saving genre:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


14.// Rename a genre
router.put('/:id',verifyToken,async (req, res) =>
     {
       try
        {
        const genreId  = req.params.id;
        const updatedgenre =req.body;
        const response = await Genre.findByIdAndUpdate(genreId,updatedgenre,{ new: true, runValidators: true });
        if (!response)
        {
            return res.status(404).json({error:'Genre not found'});
        }
        res.status(200).json(response);
    } 
    catch (err)
     {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error' });
     }
});

15.// Delete a genre
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const genreId = req.params.id; // Extract ID from URL parameter

    // Delete the genre by ID
    const response = await Genre.findByIdAndDelete(genreId);
    if (!response) {
      return res.status(404).json({ error: 'Genre not found' });
    }

    res.status(200).json({ message: 'Genre deleted successfully' });
  } catch (err) {
    console.error('Error deleting genre:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;