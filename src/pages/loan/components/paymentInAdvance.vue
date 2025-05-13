<!-- 提前还款计算器 -->
<template>
    <a-form :model="form" ref="formRef" :rules="rules" :style="{ marginTop: '20px' }" auto-label-width
        @submit="handleSubmit">
        <a-form-item field="originalPrincipal" label="原贷款金额（元）：">
            <a-input v-model="form.originalPrincipal" placeholder="请输入贷款金额" />
        </a-form-item>
        <a-form-item field="originalAnnualRate" label="原贷款利率（%）：">
            <a-input-number v-model="form.originalAnnualRate" placeholder="请输入贷款利率" />
        </a-form-item>
        <a-form-item field="newAnnualRate" label="新贷款利率（%）：">
            <a-input-number v-model="form.newAnnualRate" placeholder="请输入新贷款利率" />
        </a-form-item>
        <a-form-item field="loanYears" label="原贷款年限（年）：">
            <a-input-number v-model="form.loanYears" :max="30" :mix="1" placeholder="请输入贷款年限" />
        </a-form-item>
        <a-form-item field="prepayMonth" label="提前还款的月份序号：">
            <a-input-number v-model="form.prepayMonth" :max="360" :mix="1" placeholder="请输入提前还款的月份序号" />
        </a-form-item>
        <a-form-item field="prepayAmount" label="提前还款金额（元）：">
            <a-input v-model="form.prepayAmount" placeholder="请输入提前还款金额" />
        </a-form-item>
        <a-form-item field="type" label="还款方式">
            <a-select v-model="form.type" placeholder="请选择一个">
                <a-option value="1">等额本息</a-option>
                <a-option value="2">等额本金</a-option>
            </a-select>
        </a-form-item>
        <a-form-item field="adjustMethod" label="还款类型">
            <a-select v-model="form.adjustMethod" placeholder="请选择一个">
                <a-option value="reduceTerm">月供不变，缩短期限</a-option>
                <a-option value="reducePayment">月供减少，期限不变</a-option>
            </a-select>
        </a-form-item>
        <a-form-item label="">
            <a-space>
                <a-button html-type="submit">确认</a-button>
                <a-button @click="handlReset">重置</a-button>
            </a-space>
        </a-form-item>
    </a-form>
    <div style="line-height: 2;" class=" text-base font-bold text-orange-500">
        <p v-if="result.savedVsOriginalRate">相比原利率节省：{{ result.savedVsOriginalRate }}</p>
        <p v-if="result.savedInterest">相比就计划节省：{{ result.savedInterest }}</p>
        <p v-if="result.savedMonths">缩短期限节省时间（月）：{{ result.savedMonths }} 月</p>
        <p v-if="result.savedYears">缩短期限节省时间（年）：{{ result.savedYears }} 年</p>
        <p v-if="result.newRemainingMonths">新还款期限：{{ result.newRemainingMonths }} 个月</p>
    </div>
    <a-table v-if="result.equalPrincipalSchedule.length > 0" :columns="columns" :data="result.equalPrincipalSchedule" />
</template>

<script lang="js" setup>
import { reactive, ref } from 'vue';
import { advancedEarlyRepaymentCalculator } from './paymentInAdvance'

const formRef = ref()

const form = reactive({
    originalPrincipal: '',
    originalAnnualRate: '',
    newAnnualRate: "",
    loanYears: "",
    prepayMonth: "",
    prepayAmount: "",
    adjustMethod: "reduceTerm",
    type: '1',
});

const rules = {
    originalPrincipal: [{ required: true, message: '请输入贷款金额', },],
    originalAnnualRate: [{ required: true, message: '请输入贷款利率', },],
    newAnnualRate: [{ required: true, message: '请输入新贷款利率', },],
    loanYears: [{ required: true, message: '请输入贷款年限', },],
    prepayMonth: [{ required: true, message: '请输入提前还款的月份序号', },],
    prepayAmount: [{ required: true, message: '请输入提前还款金额', },],
    adjustMethod: [{ required: true, message: '请选择还款类型', },],
    type: [{ required: true, message: '请选择还款方式', },],
}

const result = ref({
    equalPrincipalSchedule: [],
    totalInterestEP: 0,
    newRemainingMonths: "",
    savedInterest: "",
    savedVsOriginalRate: "",
    timeSavedMonths: "",
    timeSavedYears: ""
})

const columns = [
    { title: '期数', dataIndex: 'month', },
    { title: '本金', dataIndex: 'principal', },
    { title: '利息', dataIndex: 'interest', },
    { title: '剩余本金', dataIndex: 'remainingPrincipal', },
];

const handleSubmit = () => {
    formRef.value.validate((errors) => {
        console.log('errors', errors);
        if (!errors) {
            const params = {
                originalPrincipal: Number(form.originalPrincipal), //原贷款
                originalAnnualRate: Number(form.originalAnnualRate),    // 原利率
                newAnnualRate: Number(form.newAnnualRate),         // 新利率
                loanYears: Number(form.loanYears), // 贷款期数
                repaymentMethod: form.type == '1' ? '等额本息' : "等额本金", //原还款方式
                prepayMonth: Number(form.prepayMonth), // 第xx个月提前还款
                prepayAmount: Number(form.prepayAmount), //提前还款xx万
                adjustMethod: form.adjustMethod
            }
            const data = advancedEarlyRepaymentCalculator(params)
            result.value.equalPrincipalSchedule = data.newSchedule
            result.value.savedVsOriginalRate = data.savedVsOriginalRate.toFixed(2)
            result.value.savedInterest = data.savedInterest.toFixed(2)
            result.value.savedMonths = data.savedMonths
            result.value.savedYears = data.savedYears.toFixed(1)
            result.value.newRemainingMonths = data.adjustmentDetails.newRemainingMonths
            result.value.equalPrincipalSchedule.forEach(v => {
                v.principal = v.principal.toFixed(2)
                v.interest = v.interest.toFixed(2)
                v.remainingPrincipal = v.remainingPrincipal.toFixed(2)
            })
        }
    })
}
const handlReset = () => {
    formRef.value.resetFields()
    formRef.value.clearValidate()
}
</script>
