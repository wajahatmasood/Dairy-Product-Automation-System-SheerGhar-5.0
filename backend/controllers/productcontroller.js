//imporing productmodel here which we created in model for product

//----------------------------------------------------------------
// All the route are of product controller function are in product route
//----------------------------------------------------------------

const Product = require("../models/productModel");
// const ErrorHandler = require("../utils/errorHandler");
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

//Create product method--> ADmin Acces function
// async function-->

//Create product function
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  // setting cloudnarrry
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  // this statement "do"---> ke body mein se uss user-->ke-->id ko display ge jiss user ne product create ke thy

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product from DB --> User/ADmin Acces function
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  // return next(new ErrorHandler("My error", 400));
  // return next(new ErrorHandler("Temp Error",))
  // pagenation <-----------show result per page
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();
  // seraching api --> apifeature
  // this search method is in apifeature and there we use regex to find the word using keyword
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query.clone();

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);
  // const products = await Product.find(); we comment this becasue we use apifeature now here----
  products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});
// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});
// update the product from the database --> ADmin Acces function

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }


  // Images update Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete the product from the database --> ADmin Acces function
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  // deleting image from cloudnary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product deleted sucessfully",
  });
});
// get single product details
exports.getProductDetils = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    // next is a callback function
    return next(new ErrorHandler("Product Not Found", 404));
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
    product,
  });
});

//-----------------------------------------------------------------------
// Create 'A' Review & Update 'A' Review
//-----------------------------------------------------------------------

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  // which product we rate ?? we need to find
  const product = await Product.findById(productId);
  // now b yaha hum ek frnction bnae h ke jiss user ke login kya hoa hy kya uss ne review kya hoa hy ??
  // this mainly check the user id and compare it with already reviwed id and tell ke kya review hoa wa hy ke nai
  const isRviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isRviewed) {
    product.reviews.forEach((rev) => {
      // how to check ke uss user ke rev --> we do this if statement downthere
      if ((rev) => rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    // ::This reviews is the array in product-model::
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  // finding avg of ratings
  // 4,5,5,2 == 16 / 4 so overall rating is 4 for the product
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

//-----------------------------------------------------------------------
// Get All Reviews
// to gain revie hmay product id dene hy
//-----------------------------------------------------------------------

exports.getProductReviews = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//-----------------------------------------------------------------------
// delete A Review
//-----------------------------------------------------------------------

exports.deletetReviews = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  // this filter is for the reviews jo hmay del nai karnay
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
    // we are doing this because we want to delete the last ratings <> without if our ratings does'nt delete
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});
