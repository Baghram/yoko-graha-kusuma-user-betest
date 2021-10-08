const router = require("express").Router();
const userRoute = require("./user");

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "User Server Connected",
  });
});

router.use("/user", userRoute);

module.exports = router;
