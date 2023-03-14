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
        res.status(202).send("Added")
    })
})

router.put('/expenses', function(req, res) {
    let expense = req.body
    let item = expense.item;
    let amount = expense.amount
    let group = expense.group
    let date = expense.date ? expense.date : moment().format('YYYY-MM-DD')

    let newExpense = new Expense({ item, amount, group, date })
    newExpense.save().then(() => {
        console.log(`you spent ${amount} on ${item}`);
        res.status(202).send("Added")
    })
})

module.exports = router