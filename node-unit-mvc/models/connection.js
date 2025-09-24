// This file is initializing the mongodb connection
// and exporting it for use in all other files through the module.exports
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const databaseURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/logindb';

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(databaseURL);
}

module.exports = mongoose;
