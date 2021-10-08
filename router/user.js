const userRoute = require("express").Router();
const UserController = require("../controller/Controller");
const { authentication } = require("../middleware/index");

userRoute.get("/", (req, res) => {
  return res.status(200).json({
    message: "User Route Connected",
  });
});

userRoute.get("/get", authentication, UserController.GetUser);
userRoute.post("/post", authentication, UserController.PostUser);
userRoute.put("/update/:id", authentication, UserController.UpdateUser);
userRoute.delete("/delete/:id", authentication, UserController.DeleteUser);
userRoute.post("/login", UserController.Login);

module.exports = userRoute;
