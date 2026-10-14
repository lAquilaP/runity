const express = require("express");

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/me", authMiddleware, userController.me);
router.patch("/me", authMiddleware, userController.updateMe);

// Perfil público de outro usuário
router.get("/:id", authMiddleware, userController.getById);

module.exports = router;