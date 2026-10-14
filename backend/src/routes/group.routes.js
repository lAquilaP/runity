const express = require("express");

const groupController = require("../controllers/group.controller");
const authMiddleware = require("../middlewares/auth.middleware");


const router = express.Router();

router.post("/", authMiddleware, groupController.create);
router.get("/", authMiddleware, groupController.list);
router.get("/:id", authMiddleware, groupController.getById);
router.patch("/:id", authMiddleware, groupController.update);
router.post("/:id/members", authMiddleware, groupController.join);
router.delete("/:id/members/me", authMiddleware, groupController.leave);

module.exports = router;
