const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads")
    }, 
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})
const galleryController = {};


galleryController.AddPhoto = async (req, res) => {
  const photo = req.file;
  try {
    if (!photo) {
      throw new Error("Please upload a photo");
    }

    const imagePath = photo.path;

    const newPhoto = await prisma.gallery.create({
      data: {
        photo: imagePath,
      },
    });

    res.status(201).json({
      status: 201,
      message: "Photo created successfully!",
      photo: newPhoto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

galleryController.updatePhotoById = async (req, res) => {
  const { id } = req.params;
  const { photo } = req.file;
  try {
    if (!photo) {
      throw new Error("Please upload a photo to update");
    }

    const imagePath = photo.path;

    const updatedPhoto = await prisma.gallery.update({
      where: {
        id: parseInt(id),
      },
      data: {
        photo: imagePath,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Photo updated successfully!",
      photo: updatedPhoto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

module.exports = galleryController;
