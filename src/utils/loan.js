/**
 * 等额本金计算方式
 * @param {number} principal 贷款总额
 * @param {number} annualRate 年利率（百分比，例如5表示5%）
 * @param {number} years 贷款年限
 * @returns {Array} 还款计划表
 */
export const calculateEqualPrincipal = (principal, annualRate, years) => {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  const monthlyPrincipal = principal / months;
  let remainingPrincipal = principal;

  const schedule = [];
  for (let i = 1; i <= months; i++) {
    const interest = Number((remainingPrincipal * monthlyRate).toFixed(2));
    const total = Number((monthlyPrincipal + interest).toFixed(2));
    remainingPrincipal = Number((remainingPrincipal - monthlyPrincipal).toFixed(2));

    if (i === months) remainingPrincipal = 0; // 最后一期清零

    schedule.push({
      month: i,
      monthlyPayment: total,
      principal: Number(monthlyPrincipal.toFixed(2)),
      interest: interest,
      remainingPrincipal: Math.max(remainingPrincipal, 0),
    });
  }
  return schedule;
};

/**
 * 等额本息计算方式
 * @param {number} principal 贷款总额
 * @param {number} annualRate 年利率（百分比）
 * @param {number} years 贷款年限
 * @returns {Array} 还款计划表
 */
export const calculateEqualInstallment = (principal, annualRate, years) => {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  const pow = Math.pow(1 + monthlyRate, months);
  const monthlyPayment = Number(((principal * monthlyRate * pow) / (pow - 1)).toFixed(2));

  let remainingPrincipal = principal;
  const schedule = [];

  for (let i = 1; i <= months; i++) {
    let interest = Number((remainingPrincipal * monthlyRate).toFixed(2));
    let principalPaid = Number((monthlyPayment - interest).toFixed(2));

    // 处理最后一期
    if (i === months) {
      principalPaid = Number(remainingPrincipal.toFixed(2));
      interest = Number((monthlyPayment - principalPaid).toFixed(2));
      remainingPrincipal = 0;
    } else {
      remainingPrincipal = Number((remainingPrincipal - principalPaid).toFixed(2));
    }

    schedule.push({
      month: i,
      monthlyPayment: i === months ? Number((principalPaid + interest).toFixed(2)) : monthlyPayment,
      principal: principalPaid,
      interest: interest,
      remainingPrincipal: Math.max(remainingPrincipal, 0),
    });
  }
  return schedule;
};

/**
 * 组合贷款计算器核心函数
 * @param {Object} options 配置参数
 * @param {Object} options.fundLoan 公积金贷款参数 {principal: 本金, rate: 年利率}
 * @param {Object} options.commercialLoan 商业贷款参数 {principal: 本金, rate: 年利率}
 * @param {number} options.loanYears 贷款年限
 * @param {'等额本息' | '等额本金'} options.method 还款方式
 * @returns {Array} 完整还款计划数组
 */
export const calculateCombinedLoan = (options) => {
  // 参数解构校验
  const { fundLoan, commercialLoan, loanYears, method } = options;
  if (!fundLoan || !commercialLoan || !loanYears || !method) {
    throw new Error('Missing required parameters');
  }

  // 计算各贷款部分
  const fundSchedule = calculateLoanSection(method, fundLoan, loanYears);
  const commercialSchedule = calculateLoanSection(method, commercialLoan, loanYears);

  // 合并结果
  return combineSchedules(fundSchedule, commercialSchedule);
};

// 单贷款部分计算
function calculateLoanSection(method, loan, years) {
  const { principal, rate } = loan;
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;

  return method === '等额本息'
    ? calculateEqualInstallmentZH(principal, monthlyRate, months)
    : calculateEqualPrincipalZH(principal, monthlyRate, months);
}

// 等额本息计算
function calculateEqualInstallmentZH(principal, monthlyRate, months) {
  const factor = Math.pow(1 + monthlyRate, months);
  const monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
  let remaining = principal;

  return Array.from({ length: months }, (_, i) => {
    const interest = remaining * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    remaining -= principalPaid;

    return {
      principal: principalPaid,
      interest: interest,
      remaining: Math.max(remaining, 0),
    };
  });
}

// 等额本金计算
function calculateEqualPrincipalZH(principal, monthlyRate, months) {
  const principalPerMonth = principal / months;
  let remaining = principal;

  return Array.from({ length: months }, (_, i) => {
    const interest = remaining * monthlyRate;
    remaining -= principalPerMonth;

    return {
      principal: principalPerMonth,
      interest: interest,
      remaining: Math.max(remaining, 0),
    };
  });
}

// 合并还款计划
function combineSchedules(fund, commercial) {
  return fund.map((fundMonth, index) => {
    const commercialMonth = commercial[index];
    return {
      month: index + 1,
      fundPrincipal: fundMonth.principal.toFixed(2),
      fundInterest: fundMonth.interest.toFixed(2),
      commercialPrincipal: commercialMonth.principal.toFixed(2),
      commercialInterest: commercialMonth.interest.toFixed(2),
      totalPayment: (
        fundMonth.principal +
        fundMonth.interest +
        commercialMonth.principal +
        commercialMonth.interest
      ).toFixed(2),
      remaining: (fundMonth.remaining + commercialMonth.remaining).toFixed(2),
    };
  });
}


