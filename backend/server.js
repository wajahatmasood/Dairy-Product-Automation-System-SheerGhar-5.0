const app = require("./app");

// we download env because takky hmary env.porcess ko pata chaly ke env file ko se hy
const dotenv =  require("dotenv");

// importing database
const connectDatabase = require("./config/database");

const cloudinary = require("cloudinary");

// uncaught error--------------------------Youtube wala 
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting Down this server due to uncaught exception`);
    process.exit(1);

})


//config --> to locate where config file reside
// dotenv.config({path:"backend/config/config.env"});
// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
  }
  

// Connecing DB :: calling database function --> always call this function after above line 
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
// creating listen server:::
//()-> call back function
const server = app.listen(process.env.PORT,()=> {

    // What is process.env.Port -> This is port And we create variable of this port in config.env
    // process the esnv file have port 4000 cuz we set port 4000 there
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});



// database issue handler in short
// unhandled promise rejection --> whenever iss type ka error aye ga tu hmay jan boj kar server crash karna hy 
process.on("unhandledRejection", err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting Down this server due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    });
});