const mongoose = require("mongoose");

const collectorSchema = mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      dairyname: {
        type: String,
        required: true,
      },
      phonenumber: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      

});

module.exports = mongoose.model("Collector", collectorSchema);
