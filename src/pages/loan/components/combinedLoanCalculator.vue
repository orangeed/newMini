<!-- 组合贷计算器 -->
<template>
    <a-form :model="form" ref="formRef" :rules="rules" :style="{ marginTop: '20px' }" auto-label-width
        @submit="handleSubmit">
        <a-form-item field="money" label="商业贷款金额（元）：">
            <a-input v-model="form.money" placeholder="请输入贷款金额" />
        </a-form-item>
        <a-form-item field="interestRate" label="贷款利率（%）：">
            <a-input-number v-model="form.interestRate" placeholder="请输入贷款利率" />
        </a-form-item>
        <a-form-item field="money" label="公积金贷款金额（元）：">
            <a-input v-model="form.houseMoney" placeholder="请输入贷款金额" />
        </a-form-item>
        <a-form-item field="interestRate" label="公积金贷款利率（%）：">
            <a-input-number v-model="form.houseInterestRate" placeholder="请输入贷款利率" />
        </a-form-item>
        <a-form-item field="years" label="贷款年限（年）：">
            <a-input-number v-model="form.years" :max="30" :mix="1" placeholder="请输入贷款年限" />
        </a-form-item>
        <a-form-item field="type" label="还款方式">
            <a-select v-model="form.type" placeholder="请选择一个">
                <a-option value="2">等额本息</a-option>
                <a-option value="1">等额本金</a-option>
            </a-select>
        </a-form-item>
        <a-form-item label="">
            <a-space>
                <a-button html-type="submit">确认</a-button>
                <a-button @click="handlReset">重置</a-button>
            </a-space>
        </a-form-item>
    </a-form>
    <a-table v-if="result.equalPrincipalSchedule.length > 0" :columns="columns" :data="result.equalPrincipalSchedule" />
</template>

<script lang="js" setup>
import { reactive, ref } from 'vue';
import { calculateCombinedLoan } from '../../../utils/loan'

const formRef = ref()

const form = reactive({
    money: '',
    interestRate: '',
    houseMoney: "",
    houseInterestRate: "",
    years: '',
    type: '2',
});

const rules = {
    money: [{ required: true, message: '请输入贷款金额', },],
    interestRate: [{ required: true, message: '请输入贷款利率', },],
    years: [{ required: true, message: '请输入贷款年限', },],
    type: [{ required: true, message: '请选择贷款类型', },],
}

const result = ref({
    equalPrincipalSchedule: [],
    totalInterestEP: 0
})

const columns = [
    { title: '期数', dataIndex: 'month', },
    { title: '公积金本金', dataIndex: 'fundPrincipal', },
    { title: '公积金利息', dataIndex: 'fundInterest', },
    { title: '商业本金', dataIndex: 'commercialPrincipal', },
    { title: '商业利息', dataIndex: 'commercialInterest', },
    { title: '月供总额', dataIndex: 'totalPayment', },
    { title: '剩余贷款', dataIndex: 'remaining', },
];

const handleSubmit = () => {
    formRef.value.validate((errors) => {
        console.log('errors', errors);
        if (!errors) {
            result.value.equalPrincipalSchedule = calculateCombinedLoan({
                fundLoan: {
                    principal: form.houseMoney, // 公积金贷款
                    rate: form.houseInterestRate, // 年利率
                },
                commercialLoan: {
                    principal: form.money, // 商业贷款
                    rate: form.interestRate, // 年利率
                },
                loanYears: 30, // 30年
                method: form.type == 2 ? '等额本息' : "等额本金", // 还款方式
            });
            console.log('result', result.value.equalPrincipalSchedule);
        }
    })
}
const handlReset = () => {
    formRef.value.resetFields()
    formRef.value.clearValidate()
}
</script>
