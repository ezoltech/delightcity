const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const specialController = {};

specialController.createGold = async (req, res) => {
  const { title, includes, places, price } = req.body;

  try {
    if (!title || !includes || !places || !price) {
      throw new Error("Please enter all fields");
    }

    const newGoldService = await prisma.gold.create({
      data: {
        title,
        includes,
        places,
        price,
        durations: {
          create: [{ days: 1 }, { days: 2 }, { days: 3 }],
        },
      },
      include: {
        durations: true,
      },
    });

    res.status(201).json({
      status: 201,
      message: "Gold Service created successfully!",
      goldService: newGoldService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

specialController.updateGoldById = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, includes, places, price } = req.body;

  try {
    const existingGoldService = await prisma.gold.findUnique({
      where: {
        id,
      },
      include: {
        durations: true,
      },
    });

    if (!existingGoldService) {
      return res.status(404).json({
        status: 404,
        message: "Gold service not found",
      });
    }

    const updatedGoldService = await prisma.gold.update({
      where: {
        id,
      },
      data: {
        title: title || existingGoldService.title,
        includes: includes || existingGoldService.includes,
        places: places || existingGoldService.places,
        price: price || existingGoldService.price,
        durations: {
          // Modify durations if necessary, for instance, update properties
          updateMany: [
            {
              where: {
                goldId: id,
                days: 1, // Specific duration to update (e.g., 1 day)
              },
              data: {
                // Update specific properties of the duration if needed
              },
            },
            // Add more updateMany objects for other durations (2 days, 3 days) if required
          ],
        },
      },
      include: {
        durations: true,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Gold service updated successfully",
      updatedGoldService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

specialController.getAllGoldData = async (req, res) => {
  try {
    const goldServices = await prisma.gold.findMany({
      include: {
        durations: true, // Include durations for each Gold service
      },
    });

    if (!goldServices || goldServices.length === 0) {
      return res.status(404).json({ error: "No services found" });
    }

    res.status(200).json({ goldServices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

specialController.deleteGoldById = async (req, res) => {
  // Deletion logic remains the same, but ensure to delete associated durations if required
};

specialController.deleteAllGoldServices = async (req, res) => {
  // Deletion logic remains the same
};

specialController.createPlatinum = async (req, res) => {
  const { title, includes, places, price } = req.body;

  try {
    if (!title || !includes || !places || !price) {
      throw new Error("Please enter all fields");
    }

    const newPlatinumService = await prisma.platinum.create({
      data: {
        title,
        includes,
        places,
        price,
        durations: {
          create: [{ days: 1 }, { days: 2 }, { days: 3 }],
        },
      },
      include: {
        durations: true,
      },
    });

    res.status(201).json({
      status: 201,
      message: "Platinum Service created successfully!",
      platinumService: newPlatinumService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

specialController.updatePlatinumById = async (req, res) => {
  // Update logic remains the same, but add handling for durations if required
};

specialController.getAllPlatinumData = async (req, res) => {
  try {
    const platinumServices = await prisma.platinum.findMany({
      include: {
        durations: true, // Include durations for each Platinum service
      },
    });

    if (!platinumServices || platinumServices.length === 0) {
      return res.status(404).json({ error: "No services found" });
    }

    res.status(200).json({ platinumServices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

specialController.deletePlatinumById = async (req, res) => {
  // Deletion logic remains the same, but ensure to delete associated durations if required
};

specialController.deleteAllPlatinumServices = async (req, res) => {
  // Deletion logic remains the same
};

module.exports = specialController;
