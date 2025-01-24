
const express = require('express');
const router = express.Router();
const Genre = require('../models/genreSchema');
const Anime = require('../models/animeSchema');
12.// Retrieve unique genres in user's collection
router.get('/genres/uniquegenre',async (req, res) => 
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

13.// Add a new genre
router.post('/genres/:newgenre',async (req, res) =>
     {
       try
        {
        const title = req.params.newgenre;
        const existingGenre = await Genre.findOne({newgenre:title});
        if (existingGenre) 
            {
            return res.status(400).json({error: 'Genre already exists'});
            }
        const newGenre = new Genre(title);
        const response=await newGenre.save();
        console.log('data saved'); 
        res.status(201).json(response);
    } 
    catch (err)
     {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
     }
});

14.// Rename a genre
router.put('/genres/:id',async (req, res) =>
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
router.delete('/genres/:id',async (req, res) =>
     {
       try
        {
        const genreId  = req.body.id;
        const response = await Genre.findByIdAndDelete(genreId);
        if (!response)
        {
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.status(200).json({ message: 'Genre deleted successfully' });
     }
     catch (err)
      {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

module.exports = router;