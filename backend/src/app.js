const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const groupRoutes = require("./routes/group.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Runity API funcionando!"
    });
});
app.use("/groups", groupRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

module.exports = app;