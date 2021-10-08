const { User } = require("../model/index");
const { uniqueNumber } = require("../helper/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class UserController {
  static async GetUser(req, res) {
    try {
      const { query, authenticated } = req;
      if (authenticated.validRoute !== "userRoute")
        throw new Error("Invalid Authentication");
      let data;
      if (Object.keys(query).length > 0) {
        if (query.accountNumber) {
          let userExist = await User.exists({
            accountNumber: query.accountNumber,
          });
          if (!userExist) throw new Error("User Does Not Exist");
          data = await User.findOne({ accountNumber: query.accountNumber });
        }
        if (query.identityNumber) {
          let userExist = await User.exists({
            identityNumber: query.identityNumber,
          });
          if (!userExist) throw new Error("User Does Not Exist");
          data = await User.findOne({ identityNumber: query.identityNumber });
        }
      } else {
        data = await User.find();
      }
      return res.status(200).json({
        message: "Get User Success",
        data,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Get User Failed",
        error: error.message,
      });
    }
  }
  static async PostUser(req, res) {
    try {
      const { body, authenticated } = req;
      if (authenticated.validRoute !== "userRoute")
        throw new Error("Invalid Authentication");
      const { userName, emailAddress, identityNumber, password } = body;
      let accountNumber;
      let duplicate = true;
      do {
        accountNumber = uniqueNumber(10);
        let accountDups = await User.exists({ accountNumber: accountNumber });
        if (!accountDups) duplicate = false;
      } while (duplicate === true);
      let salt = Number(process.env.SALT);
      let pass = await bcrypt.hash(password, salt);
      const userQuery = {
        userName,
        accountNumber,
        emailAddress,
        identityNumber,
        password: pass,
      };
      if (!userName) throw new Error("UserName Must be Included");
      if (!emailAddress) throw new Error("Email Address Must Be Included");
      if (!identityNumber) throw new Error("Identity Number Must Be Included");
      const userData = await User.create(userQuery);
      const allUser = await User.find().select("-password");
      return res.status(201).json({
        message: "Create User Success",
        data: userData,
        user: allUser,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Post User Failed",
        error: error.message,
      });
    }
  }
  static async UpdateUser(req, res) {
    try {
      const { body, params, authenticated } = req;
      if (authenticated.validRoute !== "userRoute")
        throw new Error("Invalid Authentication");
      const userExist = await User.exists({ _id: params.id });
      if (!userExist) throw new Error("User Does Not Exist");
      let userData = await User.findOne({ _id: params.id });
      if (body.emailAddress) userData.emailAddress = body.emailAddress;
      if (body.identityNumber) userData.identityNumber = body.identityNumber;
      await userData.save();
      let allUser = await User.find();
      return res.status(200).json({
        message: "Update User Success",
        data: userData,
        user: allUser,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Update User Failed",
        error: error.message,
      });
    }
  }
  static async DeleteUser(req, res) {
    try {
      const { params, authenticated } = req;
      if (authenticated.validRoute !== "userRoute")
        throw new Error("Invalid Authentication");
      const userExist = await User.exists({ _id: params.id });
      if (!userExist) throw new Error("User Does Not Exist");
      let deleteUser = await User.findOneAndDelete({ _id: params.id });
      let allUser = await User.find();
      return res.status(200).json({
        message: "Delete User Success",
        data: deleteUser,
        user: allUser,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Delete User Failed",
        error: error.message,
      });
    }
  }
  static async Login(req, res) {
    try {
      const { body } = req;
      const { userName, password } = body;
      const userExist = await User.exists({ userName });
      if (!userExist) throw new Error("Invalid Username / Password");
      const UserData = await User.findOne({ userName });
      let comparePass = await bcrypt.compare(password, UserData.password);
      if (!comparePass) throw new Error("Invalid Username / Password");
      const data = {
        loginVerified: true,
        loginDate: new Date(),
        _id: UserData._id,
      };
      const token = await jwt.sign(data, process.env.SECRET, {
        expiresIn: "2h",
      });
      return res.status(200).json({
        message: "Login Success",
        userToken: token,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Login Failed",
        error: error.message,
      });
    }
  }
}

module.exports = UserController;
