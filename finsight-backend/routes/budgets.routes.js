const express = require('express');
const router = express.Router();
const { getBudgets, createBudget, updateBudget } = require('../controllers/budgets.controller');

router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);

module.exports = router;