const express=require('express')
const app=express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const db=require('./db')
const additionalFunctionalityRoutes = require('./routers/Additionalfunctionality');
const userAnalyticsRoutes = require('./routers/useranalyticsroutes');
const profileManagementRoutes = require('./routers/profilemanagementRoutes');

// Routes
app.use('/api', additionalFunctionalityRoutes);
app.use('/api', userAnalyticsRoutes);
app.use('/api', profileManagementRoutes);

// Start the server
app.listen(3000,()=>{console.log("Server is listening on port 3000")})
