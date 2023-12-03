const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const servicesController = {};

servicesController.create = async (req, res) => {
  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      throw new Error("Please enter all fields");
    }

    const newService = await prisma.contact.create({
      data: {
        title,
        description,
        price,
      },
    });

    res.status(201).json({
      status: 201,
      message: "Service created successfully!",
      contact: newService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

servicesController.update = async (req, res) => {
  const { id, title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      throw new Error(
        "Please provide all fields (id, title, description, price) for update"
      );
    }

    const existingService = await prisma.services.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingService) {
      return res.status(404).json({
        status: 404,
        message: "Service not found!",
      });
    }

    const updatedService = await prisma.services.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        description,
        price,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Service updated successfully!",
      service: updatedService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

module.exports = servicesController;

module.exports = servicesController;
