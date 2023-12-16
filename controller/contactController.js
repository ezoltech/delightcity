const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const contactController = {};

contactController.create = async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    if (!email || !subject || !message) {
      throw new Error("Please enter all fields");
    }

    const newRequest = await prisma.contact.create({
      data: {
        email,
        subject,
        message,
      },
    });

    res.status(201).json({
      status: 201,
      message: "Contact created successfully!",
      contact: newRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

contactController.deleteRequest = async (req, res) => {
  const id = parseInt(req.body.id);

  try {
    if (isNaN(id)) {
      throw new Error("Please provide a valid ID!");
    }

    const deleteRequest = await prisma.contact.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Contact deleted successfully!",
      deletedRequest: deleteRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

contactController.getContactById = async (req, res) => {
  const contactId = Number(req.body.id); // Assuming the contact ID is passed as a route parameter

  try {
    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
      },
    });

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Contact retrieved successfully",
      contact: contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};

contactController.getAllContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany(); // Fetch all admins

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ error: "No contacts found" });
    }

    res.status(200).json({ contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

contactController.deleAllContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.deleteMany(); // Fetch all admins

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ error: "No admins found" });
    }

    res.status(200).json({ contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = contactController;
