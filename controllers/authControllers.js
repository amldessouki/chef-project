const asynHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");

/**---------------------------------------------*
 * @desc  register new user -sing up
 * @route  /api/auth/register
 * @method POST
 * @access public
 * 
 ...........................................*/
module.exports.registerUserCtrl = asynHandler(async (req, res) => {
  //validation
  const { error } = validateRegisterUser(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //is user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "user already exists" });
  }
  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  //new user and save it to Db
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
  });
  await user.save();
  //send a response to client
  res
    .status(201)
    .json({ message: "you registered sucessfully ,please log in" });
});

/**---------------------------------------------*
 * @desc  Log in user
 * @route  /api/auth/login
 * @method POST
 * @access public
 * 
 ...........................................*/
module.exports.loginUserCtrl = asynHandler(async (req, res) => {
  //validation
  const { error } = validateLoginUser(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // is user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "invalid email or password" });
  }
  // check the password
  const isPassWordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPassWordMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }
  // generate token (jwt)
  const token = user.generateAuthToken();
  // response to client
  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
  });
});
