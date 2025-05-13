/* 支持利率变动的提前还贷计算器
 * @param {Object} params 参数对象
 * @param {number} params.originalPrincipal 原始贷款本金
 * @param {number} params.originalAnnualRate 原始年利率（百分比）
 * @param {number} [params.newAnnualRate] 新利率（百分比），可选
 * @param {number} params.loanYears 原始贷款年限
 * @param {'等额本息' | '等额本金'} params.repaymentMethod 还款方式
 * @param {number} params.prepayMonth 提前还款的月份序号
 * @param {number} params.prepayAmount 提前还款金额
 * @param {'reduceTerm' | 'reducePayment'} params.adjustMethod 调整方式
 * @returns {Object} 计算结果对象
 */
export function advancedEarlyRepaymentCalculator(params) {
  // 参数校验
  const requiredParams = [
    'originalPrincipal',
    'originalAnnualRate',
    'loanYears',
    'repaymentMethod',
    'prepayMonth',
    'prepayAmount',
    'adjustMethod',
  ];
  if (!requiredParams.every((p) => params[p] !== undefined)) {
    throw new Error('缺少必要参数');
  }

  // 验证prepayMonth范围
  const totalMonths = params.loanYears * 12;
  if (params.prepayMonth < 1 || params.prepayMonth > totalMonths) {
    throw new Error('prepayMonth 超出有效范围');
  }

  // 使用新利率或保持原利率
  const newRate = params.newAnnualRate ?? params.originalAnnualRate;

  // 原始贷款计算
  const originalSchedule = calculateOriginalLoan(params);
  const originalTotalInterest = originalSchedule.reduce((sum, m) => sum + m.interest, 0);

  // 获取提前还款前的剩余本金
  const remainingPrincipal = originalSchedule[params.prepayMonth - 1].remainingPrincipal;
  if (params.prepayAmount > remainingPrincipal) {
    throw new Error('提前还款金额不能超过剩余本金');
  }

  // 计算新本金
  const newPrincipal = remainingPrincipal - params.prepayAmount;

  // 计算调整后的还款计划
  const adjusted = calculateAdjustedPlan({
    ...params,
    newPrincipal,
    remainingMonths: totalMonths - params.prepayMonth,
    annualRate: newRate,
    originalMonthlyPayment: originalSchedule[0]?.totalPayment,
  });

  // 计算结果
  const originalRemainingMonths = totalMonths - params.prepayMonth;
  const adjustedTotalInterest =
    originalSchedule.slice(0, params.prepayMonth).reduce((sum, m) => sum + m.interest, 0) +
    adjusted.newSchedule.reduce((sum, m) => sum + m.interest, 0);
  const originalRemainingInterest = originalSchedule.slice(params.prepayMonth).reduce((sum, m) => sum + m.interest, 0);

  return {
    savedInterest: originalRemainingInterest - adjustedTotalInterest,
    savedVsOriginalRate: originalTotalInterest - adjustedTotalInterest,
    savedMonths: originalRemainingMonths - adjusted.newSchedule.length,
    savedYears: (originalRemainingMonths - adjusted.newSchedule.length) / 12,
    newSchedule: adjusted.newSchedule,
    rateChanged: params.newAnnualRate !== undefined,
    adjustmentDetails: {
      originalRate: params.originalAnnualRate,
      newRate: newRate,
      originalMonthlyPayment: originalSchedule[0].totalPayment,
      newMonthlyPayment: adjusted.newSchedule[0]?.totalPayment || 0,
      originalRemainingMonths: originalRemainingMonths,
      newRemainingMonths: adjusted.newSchedule.length,
      monthsSaved: originalRemainingMonths - adjusted.newSchedule.length,
    },
  };
}

// 原始还款计划计算
function calculateOriginalLoan(params) {
  const monthlyRate = params.originalAnnualRate / 100 / 12;
  const months = params.loanYears * 12;

  return params.repaymentMethod === '等额本息'
    ? calculateEqualInstallment(params.originalPrincipal, monthlyRate, months)
    : calculateEqualPrincipal(params.originalPrincipal, monthlyRate, months);
}

// 调整后的还款计划计算
function calculateAdjustedPlan(params) {
  const monthlyRate = params.annualRate / 100 / 12;

  if (params.adjustMethod === 'reduceTerm') {
    if (params.repaymentMethod === '等额本息') {
      if (!params.originalMonthlyPayment) {
        throw new Error('缺少原始月供信息');
      }
      const months = calculateNewTerm(params.newPrincipal, monthlyRate, params.originalMonthlyPayment);
      return {
        newSchedule: calculateEqualInstallment(params.newPrincipal, monthlyRate, months),
        remainingMonths: months,
      };
    } else {
      const newMonths = Math.ceil(params.newPrincipal / (params.originalPrincipal / (params.loanYears * 12)));
      return {
        newSchedule: calculateEqualPrincipal(params.newPrincipal, monthlyRate, newMonths),
        remainingMonths: newMonths,
      };
    }
  } else {
    const months = params.remainingMonths;
    return {
      newSchedule:
        params.repaymentMethod === '等额本息'
          ? calculateEqualInstallment(params.newPrincipal, monthlyRate, months)
          : calculateEqualPrincipal(params.newPrincipal, monthlyRate, months),
      remainingMonths: months,
    };
  }
}

// 等额本息计算
function calculateEqualInstallment(principal, monthlyRate, months) {
  if (months === 0 || principal === 0) return [];
  const factor = Math.pow(1 + monthlyRate, months);
  const monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
  let remaining = principal;

  return Array.from({ length: months }, (_, i) => {
    const interest = remaining * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    remaining -= principalPaid;
    return {
      month: i + 1,
      principal: principalPaid,
      interest,
      totalPayment: monthlyPayment,
      remainingPrincipal: remaining,
    };
  });
}

// 等额本金计算
function calculateEqualPrincipal(principal, monthlyRate, months) {
  if (months === 0 || principal === 0) return [];
  const principalPerMonth = principal / months;
  let remaining = principal;

  return Array.from({ length: months }, (_, i) => {
    const interest = remaining * monthlyRate;
    remaining -= principalPerMonth;
    return {
      month: i + 1,
      principal: principalPerMonth,
      interest,
      totalPayment: principalPerMonth + interest,
      remainingPrincipal: remaining,
    };
  });
}

// 计算新还款期限（等额本息专用）
function calculateNewTerm(principal, monthlyRate, monthlyPayment) {
  if (monthlyPayment <= principal * monthlyRate) {
    throw new Error('月供不足以支付利息');
  }

  // 初始估算
  let months = Math.ceil(-Math.log(1 - (principal * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate));
  let payment = calculateMonthlyPayment(principal, monthlyRate, months);
  let prevDiff = payment - monthlyPayment;

  // 精确调整
  while (Math.abs(payment - monthlyPayment) >= 0.01) {
    if (payment > monthlyPayment) {
      months++;
    } else {
      months--;
    }

    if (months <= 0) {
      months = 1;
      break;
    }

    const newPayment = calculateMonthlyPayment(principal, monthlyRate, months);
    const newDiff = newPayment - monthlyPayment;

    // 检测震荡情况
    if (newDiff * prevDiff < 0) {
      if (Math.abs(newDiff) < Math.abs(prevDiff)) months += newDiff > 0 ? 1 : -1;
      break;
    }

    prevDiff = newDiff;
    payment = newPayment;
  }

  return months;
}

// 计算月供金额（等额本息）
function calculateMonthlyPayment(principal, monthlyRate, months) {
  if (months === 0 || monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}
