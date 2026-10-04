const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes in this router
router.use(protect);

router.route('/summary').get(getExpenseSummary);

router
  .route('/')
  .post(createExpense)
  .get(getExpenses);

router
  .route('/:id')
  .get(getExpenseById)
  .patch(updateExpense)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
