const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");
const { promisify } = require("util");
const galleryController = {};

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, callback) {
    const timestamp = Date.now();
    const newFileName = `file_${timestamp}${path.extname(file.originalname)}`;
    callback(null, newFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
}).single("photo");

const uploadAsync = promisify(upload);
const dummyPhoto = "/uploads/no-image.png";

galleryController.addPhoto = async (req, res) => {
  try {
    await uploadAsync(req, res);

    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: "No file uploaded",
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const count = await prisma.gallery.count();
    if (count >= 6) {
      return res.status(500).json({
        status: 500,
        message: "Limit exceeded",
      });
    }

    const newPhoto = await prisma.gallery.create({
      data: {
        photo: fileUrl || dummyPhoto,
      },
    });

    res.status(201).json({
      status: 201,
      message: "Photo added successfully!",
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
  const fileUrl = `/uploads/${req.file.filename}`;

  try {
    const existingPhoto = await prisma.gallery.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingPhoto) {
      return res.status(404).json({
        status: 404,
        message: "Photo not found",
      });
    }

    await uploadAsync(req, res);

    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: "No file uploaded",
      });
    }

    const updatedPhoto = await prisma.gallery.update({
      where: {
        id: parseInt(id),
      },
      data: {
        photo: fileUrl || dummyPhoto,
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

galleryController.deletePhotoById = async (req, res) => {
  const id = req.params.id;

  try {
    const existingPhoto = await prisma.gallery.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingPhoto) {
      return res.status(404).json({
        status: 404,
        message: "Photo not found",
      });
    }

    await prisma.gallery.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      status: 200,
      message: "Photo deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

galleryController.deleteAllPhotos = async (req, res) => {
  try {
    await prisma.gallery.deleteMany();

    res.status(200).json({
      status: 200,
      message: "All photos deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

galleryController.getAllPhotos = async (req, res) => {
  try {
    const photos = await prisma.gallery.findMany();

    res.status(200).json({
      status: 200,
      message: "All photos retrieved successfully!",
      photos: photos,
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
