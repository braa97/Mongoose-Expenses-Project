const express = require("express");
const router = express.Router();
const app = express();
const Expense = require("../model/Expense");
const moment = require("moment");

router.get("/expenses", function (req, res) {
  Expense.find({})
    .sort({ date: -1 })
    .then((expenses) => {
      res.send(expenses);
    });
});

router.get("/expenses", function (req, res) {
  let d1 = moment(req.query.d1, "YYYY-MM-DD");
  let d2 = req.query.d2 ? moment(req.query.d2, "YYYY-MM-DD") : moment().format("YYYY-MM-DD");

  if (d1 != undefined) {
    Expense.find({
      $and: [{ date: { $gt: d1 } }, { date: { $lt: d2 } }],
    })
      .sort({ date: -1 })
      .then((expenses) => res.send(expenses));
  }

  else {
    Expense.find({})
      .then((expenses) => {
        res.send(expenses);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
});

router.post("/expenses", function (req, res) {
  let expense = req.body;
  let item = expense.item;
  let amount = expense.amount;
  let group = expense.group;
  let date = expense.date ? moment(expense.date, "YYYY-MM-DD") : moment().format("YYYY-MM-DD");

  let newExpense = new Expense({ item, amount, group, date });
  newExpense.save().then(() => {
    console.log(`you spent ${amount} on ${item}`);
    res.status(200).send("Added");
  });
});

router.put("/update", function (req, res) {
  let group1 = req.body.group1;
  let group2 = req.body.group2;

  Expense.findOneAndUpdate(
    { group: group1 },
    { $set: { group: group2 } },
    { new: true }
  )
    .then((expense) => {
      res
        .status(200)
        .send(
          `Expense ${expense.item} was update from group ${group1} to group ${expense.group}.`
        );
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/expenses/:group", function (req, res) {
  let reqGroup = req.params.group;
  let total = req.query.total;


  if (total == "true") {
    Expense.aggregate([
      { $match: { group: reqGroup } },
      { $group: { _id: "$group", total: { $sum: "$amount" } } },
    ])
      .exec()
      .then((expense) => res.send(expense));
  }

  else {
    Expense.find({ group: reqGroup })
      .then((expenses) => {
        res.send(expenses);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  }
});

module.exports = router;
