// Bring express
const express = require('express');
// Bring the db connection
const connectDB = require('./config/db');
// Module to manipulate paths
const path = require('path');

//Initialize the app variable with express:
const app = express();

// Call the db connection method to be executed
connectDB();

// Initialize the middleware
app.use(express.json({ extended: false }));
// Create a singlepoint to test out
// take a get request to / and the respond will send data to the
// browser API Running


// Define the routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Server static assets in production
if(process.env.NODE_ENV === 'production'){
    // Set static folder. We set the build folder as the static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


//Take that app variable to listen the port and look for an environment variable called PORT to get the port number. Locally define the port for example 5000
const PORT = process.env.PORT || 5000;
// This will read the port and show a console log with the number of the PORT.
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
