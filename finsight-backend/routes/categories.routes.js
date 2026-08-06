const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory
} = require('../controllers/categories.controller');

router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

module.exports = router;