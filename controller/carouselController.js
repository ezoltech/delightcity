const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const { promisify } = require("util");
const prisma = new PrismaClient();
const carouselController = {};

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, callback) {
    const timestamp = Date.now();
    const newFileName = `file_${timestamp}${path.extname(file.originalname)}`;
    callback(null, newFileName);
  },
});

// Initialize Multer
const upload = multer({
  storage: storage,
}).single("photo");
const uploadAsync = promisify(upload);

carouselController.create = async (req, res) => {
  console.log("body:" + JSON.stringify(req.body));

  try {
    let fileUrl = "/uploads/no-image.png";
    const count = await prisma.carousel.count();
    if (count >= 2) {
      return res.status(500).json({
        status: 500,
        message: "limit exceded",
      });
    }
    console.log(fileUrl);
    await uploadAsync(req, res);
    const { title, description, place } = req.body;
    console.log(req.body);
    fileUrl = `/uploads/${req.file.filename}`;
    const newCarousel = await prisma.content.create({
      data: {
        title: title || "untitled",
        description: description || "no carousel",
        place: place || "no place",
        photo: fileUrl,
      },
    });

    res.status(201).json({
      status: 201,
      message: "carousel",
      carousel: newCarousel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

carouselController.deleteCArouselById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    if (isNaN(id)) {
      throw new Error("Please provide a valid ID!");
    }

    const deleteCarousel = await prisma.carousel.findFirst({
      where: {
        id: id,
      },
    });

    if (!deleteCarousel) {
      return res.status(404).json({
        status: 404,
        message: "carousel element  not found",
      });
    }

    await prisma.content.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: 200,
      message: "carousel deleted successfully!",
      deleteCarousel: deleteCarousel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

carouselController.getCarouselById = async (req, res) => {
  const carouselId = Number(req.body.id); // Assuming the contact ID is passed as a route parameter

  try {
    const carousel = await prisma.carousel.findFirst({
      where: {
        id: carouselId,
      },
    });

    if (!carousel) {
      return res.status(404).json({
        status: 404,
        message: "carousel not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Carousel retrieved successfully",
      contact: content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};

carouselController.updateCarouselById = async (req, res) => {
  const carouselId = Number(req.params.id); // Assuming the contact ID is passed as a route parameter
  const { title, description, place } = req.body;

  try {
    if (!title && !description && !place) {
      return res.status(400).json({
        status: 400,
        message: "Please provide data to update",
      });
    }

    let fileUrl = ""; // Assuming you might update the photo, leave it empty if not updating

    // Check if file upload exists in the request and upload it if necessary
    if (req.file) {
      await uploadAsync(req, res);
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const existingCarousel = await prisma.carousel.findFirst({
      where: {
        id: carouselId,
      },
    });

    if (!existingCarousel) {
      return res.status(404).json({
        status: 404,
        message: "carousel not found",
      });
    }

    const updatedCarousel = await prisma.carousel.update({
      where: {
        id: carouselId,
      },
      data: {
        title: title || existingCarousel.title,
        description: description || existingCarousel.description,
        photo: fileUrl || existingCarousel.photo,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Carousel updated successfully!",
      content: updatedCarousel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

carouselController.getAllCarousels = async (req, res) => {
  try {
    const allCarousels = await prisma.carousel.findMany();

    res.status(200).json({
      status: 200,
      message: "All carousels retrieved successfully!",
      contents: allCarousels,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

carouselController.deleteAllCarousels = async (req, res) => {
  try {
    await prisma.carousel.deleteMany();

    res.status(200).json({
      status: 200,
      message: "All carousels deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

carouselController.getCarouselDataByPlace = async (req, res) => {
  const { place } = req.params;

  try {
    const carousel = await prisma.carousel.findMany({
      where: {
        place: place || "first", // Default to "top" if place is not provided
      },
    });

    res.status(200).json({
      status: 200,
      message: `Carousel retrieved successfully for place: ${place}`,
      carousel: carousel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

module.exports = carouselController;
