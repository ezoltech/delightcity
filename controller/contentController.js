const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const { promisify } = require("util");
const prisma = new PrismaClient();
const contentController = {};

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
}).single("photo"); // 'myFile' should match the name attribute in your HTML form
const uploadAsync = promisify(upload);
contentController.create = async (req, res) => {
  console.log("body:" + JSON.stringify(req.body));

  try {
    let fileUrl = "/uploads/no-image.png";
    const count = await prisma.content.count();
    if (count >= 3) {
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
    const newContent = await prisma.content.create({
      data: {
        title: title || "untitled",
        description: description || "no content",
        place: place || "top",
        photo: fileUrl,
      },
    });

    res.status(201).json({
      status: 201,
      message: "Content created successfully!",
      contact: newContent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

contentController.deleteContent = async (req, res) => {
  const id = parseInt(req.body.id);

  try {
    if (isNaN(id)) {
      throw new Error("Please provide a valid ID!");
    }

    const deleteContent = await prisma.content.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: 200,
      message: "content deleted successfully!",
      deleteContent: deleteContent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

contentController.getContenttById = async (req, res) => {
  const contentId = Number(req.body.id); // Assuming the contact ID is passed as a route parameter

  try {
    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
      },
    });

    if (!content) {
      return res.status(404).json({
        status: 404,
        message: "Content not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Content retrieved successfully",
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

contentController.getContentLastThree = async (req, res) => {
  try {
    const content = await prisma.content.findMany({
      take: 3,
      orderBy: {
        created_at: "desc",
      },
    });

    if (!content) {
      return res.status(404).json({
        status: 404,
        message: "Contents not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Content retrieved successfully",
      content: content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};
contentController.updatePrice = async (req, res) => {
  const { price } = req.body.price;

  try {
    const updatedContent = await prisma.content.update({
      data: {
        price,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Price updated successfully!",
      content: updatedContent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

module.exports = contentController;
