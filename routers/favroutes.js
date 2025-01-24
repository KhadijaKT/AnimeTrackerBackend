
const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const Anime = require('../models/animeSchema');
18.// Add anime to favorites
router.post('/fav/add', async (req, res) =>
     {
    try {
        const data = req.body;
        const newFavorite = new User(data);
        const response = await newFavorite.save();
        console.log('data saved');
        res.status(200).json(response);
    } catch (err)
     {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


19.// Retrieve favorites
router.get('/fav/:id', async (req, res) =>
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
router.delete('/fav/remove/:id', async (req, res) => 
    {
    try {
        const userid = req.body.id;
        const user = await User.findById(userid);
        user.favorites = user.favorites.filter(id => id.toString() !== userid);
        await user.save();
        res.status(200).json(user.favorites);
    } 
    catch (err)
     {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
 });
module.exports = router;