const mongoose = require('mongoose');
require('dotenv').config();
const mongoUrl = process.env.database;
mongoose.set('strictQuery', true);
const connectToMongo = ()=>{
    mongoose.connect(mongoUrl,()=>{
        console.log('connected to Mongo hello successfully');
    })
};


module.exports = connectToMongo;