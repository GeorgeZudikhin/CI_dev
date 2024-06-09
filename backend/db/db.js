const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '.env.local' });

process.env.DB_DIALECT = 'mariadb';
process.env.DB_USER = 'todo-admin';
process.env.DB_PW = 'admin-pw';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'tododot';

const connUrl =
    process.env.DB_DIALECT + '://' +
    process.env.DB_USER + ':' +
    process.env.DB_PW + '@' +
    process.env.DB_HOST + '/' +
    process.env.DB_NAME;

console.log('DB_DIALECT:', process.env.DB_DIALECT); // Debugging
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PW:', process.env.DB_PW);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('connUrl: ', connUrl);

const db = new Sequelize(connUrl);

const models = [
    require('../models/todo'),
    require('../models/user')
];

for (const model of models) {
    model(db);
}

db.sync()
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((err) => {
        console.error('Error synchronizing the database:', err);
    });

module.exports = db;
