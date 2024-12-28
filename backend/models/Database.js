// _models/Database.js
const { Sequelize } = require('sequelize');

// Setup Sequelize connection (SQLite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',  // path to your SQLite database
});

// Test the connection to the database
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
