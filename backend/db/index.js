const mongoose = require('mongoose');

//connect to db
mongoose.connect(
  'mongodb+srv://bob123:bob123@cluster0.kugpsyk.mongodb.net/paytm'
);

//schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 30,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    maxLength: 30,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 30,
    trim: true,
  },
});

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);
const Account = mongoose.model('Account', AccountSchema);

module.exports = {
  User,
  Account,
};
