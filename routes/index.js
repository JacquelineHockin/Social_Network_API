const router = require("express").Router();

const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.use((req, res) => res.send("Wrong route!"));
res.status(404).send("<h1>👋 This is not the website you are looking 404</h1>");
module.exports = router;
