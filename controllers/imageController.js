const multer = require("multer");

const { Image } = require("../models/imageModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../util/catchAsync");
const AppError = require("../util/appError");
const User = require("../models/userMode");

exports.getImage = async (req, res, next) => {
  const { id } = req.params;
  const image = await Image.findById(id);

  res.json({ image });
};
exports.uploadImage = (req, res) => {
  const upload = multer({
    storage: cloudinaryStorage,
  }).array("image", 2);

  upload(req, res, (err) => {
    if (err) {
      res.send(err);
    }
    // storre images in database

    res.send(req.files);
  });
};
exports.postImage = factory.createOne(Image);

exports.upvote = catchAsync(async (req, res, next) => {
  const {
    params: { imageId },
    user,
    user: {
      mongouser: { _id: userId },
    },
  } = req;

  

  if (!user) return next(new AppError(`User isn't Found`, 401));

  const image = await Image.findById(imageId);
  if (!image) return next(new AppError("Image is not found", 404));
  if (!image.votes.find((vote) => vote.toString() === userId.toString())) {
    image.votes.push(userId.toString()  );
    image.voutesCount = image.voutesCount + 1; // TODO: move this to separate vote model
    await image.save(); //TODO: handle this error properly
    res.json({ image });
  } else {
    return next(new AppError("Already Voted", 400));
  }
});
