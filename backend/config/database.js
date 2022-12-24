const mongoose= require("mongoose");

// conncecting the database :: 27017 <-- port --> SheerGhar <-- Databasename --> object
// "mongo://localhost:27017/SheerGhar"
//=========================================================
// connectDatabase is a function and we export this function
// import connectDatabase in Server.js
const connectDatabase = ( )=> {
mongoose.connect(process.env.DB_URI,{useNewUrlParser:true, useUnifiedTopology:true}).then((data)=>{
console.log(`Mongo conntectd with sever data: ${data.connection.host}`);
})
};
module.exports =  connectDatabase