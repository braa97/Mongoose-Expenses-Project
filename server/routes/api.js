const express = require('express')
const router = express.Router()
const app = express()
const Expense = require('../model/Expense')
// const ExpenseClass = require('../model/expenseModel')
const moment = require('moment')

router.get('/expenses', function(req, res) {
    Expense.find({}).then((expenses) => {
        // let date = moment().format('YYYY-MM-DD')
        res.send(expenses)
    })
})

// router.get('/expenses', function(req, res) {
//     Expense.find({}).sort({date: 'asc'}).then((expenses) => {
//         res.send(expenses)
//     })
// })

router.post('/expenses', function(req, res) {
    let expense = req.body
    let item = expense.item;
    let amount = expense.amount
    let group = expense.group
    let date = expense.date ? expense.date : moment().format('YYYY-MM-DD')

    let newExpense = new Expense({ item, amount, group, date })
    newExpense.save().then(() => {
        console.log(`you spent ${amount} on ${item}`);
        res.status(200).send("Added")
    })
})

router.put("/update", function (req, res) {
    let group1 = req.body.group1;
    let group2 = req.body.group2;
  
    Expense.findOneAndUpdate({ group: group1 }, { $set: { group: group2 } })
      .then((expense) => {
        res.status(200).send(`Expense ${expense.item} was update from group ${group1} to group ${expense.group}.`);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  router.get("/expenses/:group", function (req, res) {
    let reqGroup = req.params.group
  
    Expense.find({group: reqGroup})
      .then((expenses) => {
        res.send(expenses)
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  });

module.exports = router