import API from './axios';

export const getExpensesApi = async (params = {}) => {
  const response = await API.get('/expenses', { params });
  return response.data;
};

export const getExpenseByIdApi = async (id) => {
  const response = await API.get(`/expenses/${id}`);
  return response.data;
};

export const createExpenseApi = async (expenseData) => {
  const response = await API.post('/expenses', expenseData);
  return response.data;
};

export const updateExpenseApi = async (id, expenseData) => {
  const response = await API.patch(`/expenses/${id}`, expenseData);
  return response.data;
};

export const deleteExpenseApi = async (id) => {
  const response = await API.delete(`/expenses/${id}`);
  return response.data;
};

export const getExpenseSummaryApi = async (month) => {
  const params = month ? { month } : {};
  const response = await API.get('/expenses/summary', { params });
  return response.data;
};
