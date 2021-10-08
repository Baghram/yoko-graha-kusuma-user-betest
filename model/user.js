const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const UserSchema = new Schema({
  userName: {
    type: String,
    required: [true, "User Name Must be Included"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password Must be Included']
  },
  accountNumber: {
    type: String,
    required: [true, "Account Number Must Be Included"],
    unique: true,
  },
  emailAddress: {
    type: String,
    required: [true, "Email Must Be Included"],
    unique: true,
    validate: [validator.isEmail, "Invalid Email"],
  },
  identityNumber: {
    type: String,
    required: [true, "Identity Number Must be Included"],
    unique: true,
  },
});

const User = mongoose.model("User", UserSchema, "User");

module.exports = User;
