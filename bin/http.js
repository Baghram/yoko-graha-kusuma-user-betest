const env = process.env.NODE_ENV || "development";
switch (env) {
  case "development":
    require("dotenv").config({
      path: process.cwd() + "/.env",
    });
    break;
  case "testing":
    require("dotenv").config({
      path: process.cwd() + "/.env.test",
    });
    break;
  case "production":
    require("dotenv").config({
      path: process.cwd() + "/.env.prod",
    });
    break;

  default:
    require("dotenv").config({
      path: process.cwd() + "/.env",
    });
    break;
}

const app = require("../app");
const http = require("http").createServer(app);

http.listen(process.env.PORT, () => {
  console.log(`listening to port ${process.env.PORT}`);
});
