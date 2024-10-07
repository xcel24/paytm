const express = require('express');
const mongoose = require('mongoose');
const z = require('zod');
const { authMiddleWare } = require('../middlewares/index');
const { Account } = require('../db');

const router = express.Router();

const transferBodySchema = z.object({
  to: z.string(),
  amount: z.number(),
});

//get the balance
router.get('/balance', authMiddleWare, async (req, res) => {
  const userId = req.userId;
  const account = await Account.findOne({ userId });

  if (!account) return res.status(404).json({ message: 'No account found' });

  return res.status(200).json({ balance: account.balance });
});

//transfer money
router.post('/transfer', authMiddleWare, async (req, res) => {
  const { success } = transferBodySchema.safeParse(req.body);

  if (!success) return res.status(400).json({ message: 'Bad request' });
  else {
    const session = await mongoose.startSession();

    session.startTransaction();

    const { to, amount } = req.body;

    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const toAccount = await Account.findOne({ userId: to });

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Invalid account' });
    }

    //Perform the transaction
    await Account.findOneAndUpdate(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.findOneAndUpdate(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();

    res.status(200).json({ message: 'Transfer successful' });
  }
});

module.exports = router;
