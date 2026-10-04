const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
  try {
    const { amount, category, date, note } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount greater than 0',
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Please select an expense category',
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please select an expense date',
      });
    }

    const expense = await Expense.create({
      user: req.user._id, // User ID MUST come from authenticated JWT
      amount: Number(amount),
      category,
      date: new Date(date),
      note: note || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expenses for authenticated user with category & date filtering
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const { category, from, to } = req.query;

    // Strict ownership filtering: match user === req.user._id
    const filter = { user: req.user._id };

    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Date range filter
    if (from || to) {
      filter.date = {};
      if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        filter.date.$gte = fromDate;
      }
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        filter.date.$lte = toDate;
      }
    }

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expense by ID (Ownership restricted)
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    // Ensure the expense belongs ONLY to the logged-in user
    const expense = await Expense.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense (Ownership restricted)
// @route   PATCH /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, category, date, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    // Find expense and verify ownership
    const expense = await Expense.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found or unauthorized',
      });
    }

    if (amount !== undefined) {
      if (Number(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0',
        });
      }
      expense.amount = Number(amount);
    }

    if (category !== undefined) {
      expense.category = category;
    }

    if (date !== undefined) {
      expense.date = new Date(date);
    }

    if (note !== undefined) {
      expense.note = note;
    }

    const updatedExpense = await expense.save();

    return res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense (Ownership restricted)
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    const expense = await Expense.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly category summary & dashboard metrics using MongoDB aggregation
// @route   GET /api/expenses/summary
// @access  Private
const getExpenseSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get month parameter or fallback to current month (YYYY-MM)
    let { month } = req.query;
    if (!month) {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      month = `${yr}-${mo}`;
    }

    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;

    const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

    // MongoDB Aggregation pipeline for category summary of selected month
    const categoryAggregation = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    // Format category summary
    const categorySummary = categoryAggregation.map((item) => ({
      category: item._id,
      amount: item.totalAmount,
      count: item.count,
    }));

    // Calculate this month's total spending
    const thisMonthSpending = categorySummary.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    // Calculate all-time total spending & expense count for user
    const totalAggregation = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalSpending: { $sum: '$amount' },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    const totalSpending =
      totalAggregation.length > 0 ? totalAggregation[0].totalSpending : 0;
    const totalExpensesCount =
      totalAggregation.length > 0 ? totalAggregation[0].totalCount : 0;

    // Determine top category for selected month
    let topCategory = 'None';
    let topCategoryAmount = 0;
    if (categorySummary.length > 0) {
      topCategory = categorySummary[0].category;
      topCategoryAmount = categorySummary[0].amount;
    }

    return res.status(200).json({
      success: true,
      data: {
        month,
        categorySummary,
        totalSpending,
        thisMonthSpending,
        totalExpensesCount,
        topCategory: {
          name: topCategory,
          amount: topCategoryAmount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
};
