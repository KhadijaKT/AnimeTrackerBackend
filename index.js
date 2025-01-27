const express=require('express')
const app=express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const db=require('./routers/db')
const additionalFunctionalityRoutes = require('./routers/AdditionalFunctionality');
const userAnalyticsRoutes = require('./routers/useranalyticsroutes');
const profileManagementRoutes = require('./routers/profilemanagementRoutes');
const animeroutes = require('./routers/animeRouter');
const favroutes = require('./routers/favroutes');
const watchlistroutes = require('./routers/watchlistroutes');
const genreroutes = require('./routers/genrerouters');
const userRoutes = require('./routers/auth');


// Routes
app.use('/additional', additionalFunctionalityRoutes);
app.use('/usernalytics', userAnalyticsRoutes);
app.use('/profile', profileManagementRoutes);
app.use('/anime', animeroutes);
app.use('/fav', favroutes);
app.use('/watchlist', watchlistroutes);
app.use('/genre', genreroutes);
app.use('/user', userRoutes);

// Start the server
app.listen(3000,()=>{console.log("Server is listening on port 3000")})
