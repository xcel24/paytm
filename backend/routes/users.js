const express = require('express');
const router = express.Router();
const z = require('zod');
const jwt = require('jsonwebtoken');
const { User, Account } = require('../db/index');
const { JWT_SECRET } = require('../config');
const { authMiddleWare } = require('../middlewares');

const signupSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().max(30),
  lastName: z.string().max(30),
});

const signInSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

const updateProfileSchema = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

//signup
router.post('/signup', async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  const { success } = signupSchema.safeParse({
    username,
    password,
    firstName,
    lastName,
  });

  console.log(JWT_SECRET);

  if (!success)
    return res
      .status(411)
      .json({ message: 'Email already taken/ Incorrect inputs' });
  else {
    const existingUser = await User.findOne({ username });

    if (existingUser)
      return res.status(411).json({ message: 'User already exists' });
    else {
      const newUser = await User.create({
        username,
        password,
        firstName,
        lastName,
      });

      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

      //give initial amount b/w 1-10,000 to each new user
      await Account.create({
        userId: newUser._id,
        balance: 1 + Math.random() * 10000,
      });

      //return token
      return res.status(200).json({
        message: 'User created successfully',
        token,
      });
    }
  }
});

//signin
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  const { success } = signInSchema.safeParse({ username, password });

  if (!success) return res.status(411).json({ message: 'Bad credentials' });
  else {
    const validUser = await User.findOne({
      username,
      password,
    });

    if (!validUser) return res.status(404).json({ message: 'User not found' });
    else {
      const token = jwt.sign({ userId: validUser._id }, JWT_SECRET);

      return res.status(200).json({
        token,
      });
    }
  }
});

//user profile
router.get('/', authMiddleWare, async (req, res) => {
  console.log(req.userId);
  const user = await User.findById(req.userId).select('-password');
  const balance = await Account.findOne({ userId: req.userId }).select(
    'balance'
  );

  if (!user) return res.status(404).json({ message: 'user not found' });
  else return res.status(200).json({ user, balance });
});

//all users except the one sending the req
router.get('/all', authMiddleWare, async (req, res) => {
  const users = await User.find({}).select('-password');

  const filteredUsers = users.filter(function (user) {
    if (user._id == req.userId) return false;
    else return true;
  });

  return res.status(200).json(filteredUsers);
});

//update profile
router.put('/', authMiddleWare, async (req, res) => {
  const { success } = updateProfileSchema.safeParse(req.body);

  if (!success)
    return res
      .status(411)
      .json({ message: 'Error while updating the profile' });
  else {
    await User.updateOne({ _id: req.userId }, req.body);

    return res.status(200).json({ message: 'Updated successfully' });
  }
});

//users based on firstName and lastName
router.get('/bulk', async (req, res) => {
  const filter = req.query.filter || '';

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
          $options: 'i',
        },
      },
      {
        lastName: {
          $regex: filter,
          $options: 'i',
        },
      },
    ],
  });

  return res.json({
    users: users.map((user) => {
      return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    }),
  });
});

//get user profile based on userId
router.get('/:userId', authMiddleWare, async (req, res) => {
  const user = await User.findById(req.params.userId).select('-password');

  if (!user) return res.status(404).json({ message: 'user not found' });
  else return res.status(200).json(user);
});

module.exports = router;
