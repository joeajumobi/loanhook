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
  if (applicant.income <= 0) return 100;

  const monthlyDebtPayment = applicant.monthlyDebtPayment ?? 0;

  return (monthlyDebtPayment / applicant.income) * 100;
}

export function getSavingsBufferMonths(applicant: Applicant) {
  const monthlyExpenses = getMonthlyExpenses(applicant);
  const monthlyDebtPayment = applicant.monthlyDebtPayment ?? 0;
  const totalMonthlyObligations = monthlyExpenses + monthlyDebtPayment;

  if (totalMonthlyObligations <= 0) return 0;
  return applicant.savings / totalMonthlyObligations;
}

export function getReadinessScore(applicant: Applicant) {
  const monthlyExpenses = getMonthlyExpenses(applicant);
  const monthlyDebtPayment = applicant.monthlyDebtPayment ?? 0;
  const totalMonthlyObligations = monthlyExpenses + monthlyDebtPayment;

  const remainingIncome = applicant.income - totalMonthlyObligations;
  const dti = getDebtToIncome(applicant);
  const savingsBuffer = getSavingsBufferMonths(applicant);

  const cashFlowRatio =
    applicant.income > 0 ? remainingIncome / applicant.income : 0;
  const cashFlowScore = Math.max(0, Math.min(30, cashFlowRatio * 30));

  const dtiScore = Math.max(0, Math.min(30, (40 - dti) * 0.75));

  const savingsScore = Math.max(0, Math.min(25, (savingsBuffer / 6) * 25));

  const baseScore = 15;
  const totalScore = baseScore + cashFlowScore + dtiScore + savingsScore;

  return Math.round(Math.max(0, Math.min(100, totalScore)));
}

export function getMaxAffordablePayment(applicant: Applicant) {
  const monthlyExpenses = getMonthlyExpenses(applicant);
  const monthlyDebtPayment = applicant.monthlyDebtPayment ?? 0;

  const availableIncome =
    applicant.income - monthlyExpenses - monthlyDebtPayment;

  console.log({
    income: applicant.income,
    monthlyExpenses,
    monthlyDebtPayment,
    availableIncome,
  });

  return Math.max(0, Math.round(availableIncome * 0.35));
}

export function getSafeLoanAmount(applicant: Applicant) {
  const maxPayment = getMaxAffordablePayment(applicant);

  console.log({
    income: applicant.income,
    monthlyExpenses: getMonthlyExpenses(applicant),
    monthlyDebtPayment: applicant.monthlyDebtPayment,
    availableIncome:
      applicant.income -
      getMonthlyExpenses(applicant) -
      applicant.monthlyDebtPayment,
    maxPayment: maxPayment,
    safeLoanAmount: maxPayment * 36
  });

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
  if (applicant.income <= 0) return 0;

  return Math.max(
    0,
    Math.min(100, Math.round((applicant.savings / applicant.income) * 100))
  );
}

export function getAffordabilityScore(applicant: Applicant) {
  const monthlyExpenses = getMonthlyExpenses(applicant);
  const monthlyDebtPayment = applicant.monthlyDebtPayment ?? 0;
  const availableIncome =
    applicant.income - monthlyExpenses - monthlyDebtPayment;

  if (applicant.income <= 0) return 0;

  const ratio = availableIncome / applicant.income;
  return Math.max(0, Math.min(100, Math.round(ratio * 100)));
}