  var logger = require('./server/utils/logger');

  // Bring Mongoose into the app
  var mongoose = require('mongoose');

  // Build the connection string
  var dbName = 'Ks';
  var dbURI = 'mongodb://localhost:27017/' + dbName;
  // Create the database connection
  mongoose.connect(dbURI);

  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on('connected', function() {
      logger.info('Mongoose default connection open to ' + dbURI);
  });

  // If the connection throws an error
  mongoose.connection.on('error', function(err) {
      logger.info('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function() {
      logger.info('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function() {
      mongoose.connection.close(function() {
          logger.info('Mongoose default connection disconnected through app termination');
          process.exit(0);
      });
  });


  // BRING IN YOUR SCHEMAS & MODELS
  // For example
//   require('./server/models/category');
//   require('./server/models/requestType');
//   require('./server/models/subCategory');