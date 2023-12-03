const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminController = {};

adminController.signUp = async (req, res) => {
  const { email, password } = req.body;
  //   console.log(req.body);
  if (!email || !password) {
    return res.status(401).send({
      status: 401,
      message: "Please enter all fields!!",
    });
  }

  try {
    const n = await prisma.admin.count({
      where: {
        email,
      },
    });

    //check if the user by email exists
    let isFound = n > 0 ? true : false;

    if (isFound) {
      return res.status(401).send({
        status: 401,
        message: "Admin already exists!!",
      });
    } else {
      let salt = await bcrypt.genSalt(10);
      let pwd = await bcrypt.hash(password, salt);

      const newAdmin = await prisma.admin.create({
        data: {
          email,
          password: pwd,
        },
      });

      const token = jwt.sign({ newAdmin }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.status(200).json({
        token,
        admin: newAdmin,
      });
      console.log("admin created successfully : )");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};

adminController.logIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).send({
      status: 401,
      message: "Please enter all fields!!",
    });
  }

  try {
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (!existingAdmin) {
      return res.status(401).send({
        status: 401,
        message: "Admin not found!!",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingAdmin.password
    );

    if (!isPasswordValid) {
      return res.status(401).send({
        status: 401,
        message: "Invalid credentials!!",
      });
    }

    const token = jwt.sign({ existingAdmin }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      token,
      admin: existingAdmin,
    });
    console.log("Admin logged in successfully :)");
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};

adminController.updateAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).send({
      status: 401,
      message: "Please enter all fields!!",
    });
  }

  try {
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (!existingAdmin) {
      return res.status(404).send({
        status: 404,
        message: "Admin not found!!",
      });
    }

    let salt = await bcrypt.genSalt(10);
    let pwd = await bcrypt.hash(password, salt);

    const updatedAdmin = await prisma.admin.update({
      where: {
        email,
      },
      data: {
        password: pwd,
      },
    });

    res.status(200).json({
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
    console.log("Admin updated successfully :)");
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};

adminController.deleteAdmin = async (req, res) => {
  const id = parseInt(req.body.id);

  try {
    if (isNaN(id)) {
      throw new Error("Please provide a valid ID!");
    }

    const deleteAdmin = await prisma.admin.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: 200,
      message: "admin deleted successfully!",
      deleteAdmin: deleteAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || "Internal server error!",
    });
  }
};

adminController.getAdminByEmail = async (req, res) => {
  const { email } = req.body.email;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = adminController;

module.exports = adminController;
