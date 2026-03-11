import type { Applicant } from "../types/financial";

export function getMonthlyExpenses(applicant: Applicant) {
  return (
    applicant.housing +
    applicant.food +
    applicant.transport +
    applicant.utilities +
    applicant.other
  );
}

export function getDebtToIncome(applicant: Applicant) {
  if (applicant.income === 0) return 100;
  return (applicant.debt / applicant.income) * 100;
}

export function getSavingsBufferMonths(applicant: Applicant) {
  const monthlyExpenses = getMonthlyExpenses(applicant);
  if (monthlyExpenses === 0) return 0;
  return applicant.savings / monthlyExpenses;
}

export function getReadinessScore(applicant: Applicant) {
  const monthlyExpenses = getMonthlyExpenses(applicant);
  const remainingIncome = applicant.income - monthlyExpenses;
  const dti = getDebtToIncome(applicant);
  const savingsBuffer = getSavingsBufferMonths(applicant);

  // 1. Cash flow score: how much income is left after expenses
  const cashFlowRatio = applicant.income > 0 ? remainingIncome / applicant.income : 0;
  const cashFlowScore = Math.max(0, Math.min(30, cashFlowRatio * 30));

  // 2. Debt-to-income score: lower is better
  const dtiScore = Math.max(0, Math.min(30, (40 - dti) * 0.75));

  // 3. Savings buffer score: 6 months is excellent
  const savingsScore = Math.max(0, Math.min(25, (savingsBuffer / 6) * 25));

  // 4. Small stability baseline
  const baseScore = 15;

  const totalScore = baseScore + cashFlowScore + dtiScore + savingsScore;

  return Math.round(Math.max(0, Math.min(100, totalScore)));
}

export function getMaxAffordablePayment(applicant: Applicant) {
  const monthlyExpenses = getMonthlyExpenses(applicant);
  const availableIncome = applicant.income - monthlyExpenses;
  return Math.max(0, Math.round(availableIncome * 0.35));
}

export function getSafeLoanAmount(applicant: Applicant) {
  const maxPayment = getMaxAffordablePayment(applicant);
  return Math.max(0, Math.round(maxPayment * 36));
}

export function getApprovalLikelihood(applicant: Applicant) {
  const score = getReadinessScore(applicant);
  const dti = getDebtToIncome(applicant);
  const savingsBuffer = getSavingsBufferMonths(applicant);

  let likelihood = score;

  if (dti <= 36) likelihood += 5;
  if (savingsBuffer >= 3) likelihood += 5;
  if (savingsBuffer >= 6) likelihood += 5;

  return Math.max(0, Math.min(100, Math.round(likelihood)));
}

export function getStabilityScore(applicant: Applicant) {
  const savingsBuffer = getSavingsBufferMonths(applicant);
  const dti = getDebtToIncome(applicant);

  let score = 50;

  score += Math.min(25, Math.round(savingsBuffer * 4));
  score += Math.max(0, 25 - Math.max(0, dti - 20));

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getSavingsRatio(applicant: Applicant) {
  if (applicant.income === 0) return 0;
  return Math.max(0, Math.min(100, Math.round((applicant.savings / applicant.income) * 100)));
}

export function getAffordabilityScore(applicant: Applicant) {
  const monthlyExpenses = getMonthlyExpenses(applicant);
  const availableIncome = applicant.income - monthlyExpenses;

  if (applicant.income === 0) return 0;

  const ratio = availableIncome / applicant.income;
  return Math.max(0, Math.min(100, Math.round(ratio * 100)));
}