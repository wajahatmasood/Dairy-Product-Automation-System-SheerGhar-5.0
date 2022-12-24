const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Collector = require("../models/collectorModel");
const ErrorHandler = require("../utils/errorhandler");

// create collector -- Admin
exports.addCollector = catchAsyncErrors(async (req, res, next) => {
  const collector = await Collector.create(req.body);
  res.status(201).json({
    success: true,
    collector,
  });
});
// Get ALL collector -- Admin
exports.getAllCollector = catchAsyncErrors(async (req, res, next) => {
  const collectors = await Collector.find();

  res.status(200).json({
    success: true,
    collectors,
  });
});

// Update collector -- Admin
exports.updateCollector = catchAsyncErrors(async (req, res, next) => {
  let collector = await Collector.findById(req.params.id);
  if (!collector) {
    return res.status(500).json({
      success: false,
      message: "Collector not found",
    });
  }

  collector = await Collector.findByIdAndUpdate(req.params.id, req.body, 
    {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    collector,
  });
});

// Delete collector -- Admin
exports.deleteCollector = catchAsyncErrors(async (req, res, next) => {
    const collector = await Collector.findById(req.params.id);
    if (!collector) {
      return next(new ErrorHandler("Collector Not Exsist", 404));
    }
    await collector.remove();
    res.status(200).json({
      success: true,
      message: "Collector deleted sucessfully",
    });
  });

// get single Collector details
exports.getCollectorDetils = catchAsyncErrors(async (req, res, next) => {
  
  const collector = await Collector.findById(req.params.id);
  if (!collector) {
    return next(new ErrorHandler("Collector Not Found", 404));
    //---------------------------------------------------
    // we dont need to add these line in the code now we use error handler we created
    // return res.status(500).json({
    // success:false,
    // message:"Product Not Found"
    // })
    //---------------------------------------------------
  }
  // there is the issue with productcount <----------- solve it latter
  res.status(200).json({
    success: true,
    collector,
  });
});