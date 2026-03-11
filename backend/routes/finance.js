import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mockDataPath = path.join(__dirname, '../mockData.json');

router.get('/ratio', (req, res) => {
  const rawData = fs.readFileSync(mockDataPath, 'utf-8');
  const data = JSON.parse(rawData);

  const totalSpend = data.transactions.reduce((sum, item) => sum + item.amount, 0);
  const income = data.monthlyIncome;
  const ratio = (totalSpend / income) * 100;

  let suggestion = 'Your spending is within a healthy range.';
  if (ratio > 70) {
    suggestion = 'Your spending is quite high compared to your income. Consider reviewing your expenses.';
  } else if (ratio > 30) {
    suggestion = "Your spending is moderate, but there's room for improvement.";
  }

  res.json({
    totalSpend,
    income,
    ratio: ratio.toFixed(2),
    suggestion
  });
});

router.get('/loaninterest', (req, res) => {
  const amount = parseFloat(req.query.amount);
  const rate = parseFloat(req.query.rate);
  const years = parseFloat(req.query.years);

  if (isNaN(amount) || isNaN(rate) || isNaN(years)) {
    return res.status(400).json({
      error: 'Invalid input. Please provide amount, rate, and years as query parameters.'
    });
  }

  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = years * 12;
  const monthlyPayment =
    (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - amount;

  res.json({
    monthlyPayment: monthlyPayment.toFixed(2),
    totalPayment: totalPayment.toFixed(2),
    totalInterest: totalInterest.toFixed(2),
    message:
      `Based on the provided loan details, your monthly payment will be $${monthlyPayment.toFixed(2)}. ` +
      `Over the course of ${years} years, you will pay a total of $${totalPayment.toFixed(2)}, ` +
      `which includes $${totalInterest.toFixed(2)} in interest.`
  });
});

export default router;