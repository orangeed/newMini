<!-- 贷款计算器 -->
<template>
    <a-form :model="form" ref="formRef" :rules="rules" :style="{ marginTop: '20px' }" auto-label-width
        @submit="handleSubmit">
        <a-form-item field="money" label="贷款金额（元）：">
            <a-input v-model="form.money" placeholder="请输入贷款金额" />
        </a-form-item>
        <a-form-item field="interestRate" label="贷款利率（%）：">
            <a-input-number v-model="form.interestRate" placeholder="请输入贷款利率" />
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
    <p v-if="result.totalInterestEP">总利息：{{ result.totalInterestEP }}</p>
    <a-table v-if="result.equalPrincipalSchedule.length > 0" :columns="columns" :data="result.equalPrincipalSchedule" />
</template>

<script lang="js" setup>
import { reactive, ref } from 'vue';
import { calculateEqualPrincipal, calculateEqualInstallment } from '../../../utils/loan'

const formRef = ref()

const form = reactive({
    money: '',
    interestRate: '',
    years: '',
    type: '2',
});

const rules = {
    money: [{ required: true, message: '请输入贷款金额', },],
    interestRate: [{ required: true, message: '请输入贷款利率', },],
    years: [{ required: true, message: '请输入贷款年限', },],
    type: [{ required: true, message: '请选择还款类型', },],
}

const result = ref({
    equalPrincipalSchedule: [],
    totalInterestEP: 0
})

const columns = [
    { title: '期数', dataIndex: 'month', },
    { title: '月供', dataIndex: 'monthlyPayment', },
    { title: '本金', dataIndex: 'principal', },
    { title: '利息', dataIndex: 'interest', },
    { title: '剩余本金', dataIndex: 'remainingPrincipal', },
];

const handleSubmit = () => {
    formRef.value.validate((errors) => {
        console.log('errors', errors);
        if (!errors) {
            // 等额本息
            if (form.type === '1') {
                result.value.equalPrincipalSchedule = calculateEqualPrincipal(form.money, form.interestRate, form.years);
                result.value.totalInterestEP = result.value.equalPrincipalSchedule.reduce((sum, item) => sum + item.interest, 0).toFixed(2);
            } else {
                // 等额本金
                result.value.equalPrincipalSchedule = calculateEqualInstallment(form.money, form.interestRate, form.years);
                result.value.totalInterestEP = result.value.equalPrincipalSchedule.reduce((sum, item) => sum + item.interest, 0).toFixed(2);
            }
        }
    })
}
const handlReset = () => {
    formRef.value.resetFields()
    formRef.value.clearValidate()
}
</script>
