const express = require("express");
const router = express.Router();
const User = require("../modules/users");

//Getting all
router.post("/login", async (req, res) => {
  try {
    const users = await User.find({ email: req.body.email });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Getting One
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

//Creating One
router.post("/", async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//OwnID endpoint1 set data by Login ID
router.post("/setOwnIDDataByLoginId", async (req, res) => {
  const email = req.body.loginId; //The unique id of a user in your database, usually email or phone
  const ownIdData = req.body.ownIdData; //OwnID authentication information as string
  const filter = { email };
  const update = { ownIdData };
  const user = await User.findOneAndUpdate(filter, update, {
    new: true,
  }).exec();
  await user.save();
  return res.sendStatus(204);
});

//OwnID endpoint2 get data by Login ID
router.post("/getOwnIDDataByLoginId", async (req, res) => {
  const email = req.body.loginId; //The unique id of a user in your database, usually email or phone
  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    return res.json({ errorCode: 404 });
  } //Error code when user doesn't exist
  res.json({ ownIdData: user.ownIdData }); //OwnID authentication information as string
});

//OwnID endpoint3 get session by Login ID
router.post("/getSessionByLoginId", async (req, res) => {
  const sign = require("jwt-encode");
  const email = req.body.loginId; //The unique id of a user in your database, usually email or phone
  const user = await User.findOne({ email: email }).exec();
  const jwt = sign({ email: user.email }, "secret");
  return res.json({ token: jwt });
});

//Updating one
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//Deleting One
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Cannot find user" });
  }

  res.user = user;
  next();
}

module.exports = router;
