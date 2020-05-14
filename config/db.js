// bring mongoose
const mongoose = require('mongoose');
// bring the config package
const config = require('config');
// a variable db to bring the mongo string from the config file
const db = config.get('mongoURI');

// To connect to the database we use here async/await instead of
// the regular promises for updated standar and cleaner process
// So we create an arrow function with try and catch for error handling
const connectDB = async () => {
	try {
    // mongoose.connect returns a promise
    await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});
    console.log('MongoDB Connected...');
  } catch (err) {
    // If error, send an error message
    console.error(err.message);
		// Exit process with failure
		process.exit(1);
  }
};

// export the module
module.exports = connectDB;
