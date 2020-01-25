const express = require('express');

//Initialize the app variable with express:
const app = express();

// Create a singlepoint to test out
// take a get request to / and the respond will send data to the
// browser API Running
app.get('/', (req, res) => res.send('API Running'));

//Take that app variable to listen the port and look for an environment variable called PORT to get the port number. Locally define the port for example 5000
const PORT = process.env.PORT || 5000;
// This will read the port and show a console log with the number of the PORT.
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
