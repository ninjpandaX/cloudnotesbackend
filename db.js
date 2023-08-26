const mongoose = require('mongoose');
require('dotenv').config();
const mongoUrl = process.env.database;

const connectToMongo = ()=>{
    mongoose.connect(mongoUrl,()=>{
        console.log('connected to Mongo hello successfully');
    })
};


module.exports = connectToMongo;