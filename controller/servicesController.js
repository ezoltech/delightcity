const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const servicesController = {};

servicesController.create = async (req, res) => {
  const { title, includes, places, duration, price } = req.body;

  try {
    if (!title || !includes || !places || !duration || !price) {
      throw new Error("Please enter all fields");
    }

    const newService = await prisma.services.create({
      data: {
        title,
        includes,
        places,
        duration,
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

// servicesController.update = async (req, res) => {
//   const id = parseInt(req.params.id);

//   try {
//     const service = await prisma.services.findFirst({
//       where: {
//         id,
//       },
//     });

//     if (!service) {
//       res.status(404).json({
//         status: 404,
//         message: "Service not found",
//       });
//       return;
//     }

//     const updatedService = await prisma.services.update({
//       where: {
//         id,
//       },
//       data: {
//         title: title || service.title,
//         description: description || service.description,
//         price: price || service.price,
//       },
//     });

//     res.status(200).json({
//       status: 200,
//       message: "Service updated successfully",
//       updatedService,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: 500,
//       message: error.message || "Internal server error!",
//     });
//   }
// };

servicesController.update = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, includes, places, duration, price } = req.body; // Destructure variables from req.body

  try {
    const service = await prisma.services.findFirst({
      where: {
        id,
      },
    });

    if (!service) {
      return res.status(404).json({
        status: 404,
        message: "Service not found",
      });
    }

    const updatedService = await prisma.services.update({
      where: {
        id,
      },
      data: {
        title: title || service.title,
        includes: includes || service.includes,
        places: places || service.places,
        duration: duration || service.duration,
        price: price || service.price,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Service updated successfully",
      updatedService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

servicesController.updatePrice = async (req, res) => {
  const { id } = req.params; // Assuming 'id' is passed in the request params
  const { price } = req.body;

  try {
    const service = await prisma.services.findUnique({
      where: {
        id,
      },
    });

    if (!service) {
      res.status(404).json({
        status: 404,
        message: "Service not found",
      });
      return;
    }

    const updatedService = await prisma.services.update({
      where: {
        id,
      },
      data: {
        price: price || service.price,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Price updated successfully",
      updatedService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

servicesController.getAllServices = async (req, res) => {
  try {
    const services = await prisma.services.findMany(); // Fetch all admins
    if (!services || services.length === 0) {
      return res.status(404).json({ error: "No services found" });
    }

    res.status(200).json({ services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

servicesController.deleteAllServices = async (req, res) => {
  try {
    const services = await prisma.services.deleteMany(); // Fetch all admins

    if (!services || services.length === 0) {
      return res.status(404).json({ error: "No services found" });
    }

    res.status(200).json({ services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

servicesController.deleteById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const service = await prisma.services.findFirst({
      where: {
        id: id,
      },
    });

    if (!service) {
      return res.status(404).json({
        status: 404,
        message: "Service not found",
      });
    }

    await prisma.services.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Service deleted successfully",
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
