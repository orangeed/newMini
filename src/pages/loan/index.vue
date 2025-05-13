<!--
 * @Author: chenjie
 * @Date: 2025-05-13 10:13:38
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-05-13 17:04:46
 * @FilePath: \project3\src\pages\loan\index.vue
-->
<template>
    <div class="w-full min-h-screen flex justify-center items-center px-4">
        <img src="https://picsum.photos/1920/1080" style="position: absolute; z-index: -1; height: 100%; width: 100%" />
        <div class="w-full max-w-2xl md:max-w-4xl">
            <div class="p-4 overflow-auto bg-gray-50 border" style="max-height: 90vh;">
                <div :class="['bg-gray-200 w-24 p-2 rounded', currentTab === 1 ? 'text-blue-600' : 'text-black']" @click="()=>{}">
                    贷款计算器</div>
                <div>组合贷计算器</div>
                <div>提前还贷计算器</div>
            </div>
            <!-- <a-card class="p-4 overflow-auto" style="max-height: 90vh;">
                <a-tabs default-active-key="1">
                    <a-tab-pane key="1" title="贷款计算器">
                        <loan />
                    </a-tab-pane>
                    <a-tab-pane key="2" title="组合贷计算器">
                        <combinedLoanCalculator />
                    </a-tab-pane>
                    <a-tab-pane key="3" title="提前还贷计算器">
                        <paymentInAdvance />
                    </a-tab-pane>
                </a-tabs>
                <p class="text-sm md:text-base font-bold text-center mt-4">
                    注意：以上结果只做参考，不作为实际的结果，还是要按照当地贷款的银行政策为准！
                </p>
            </a-card> -->
        </div>
    </div>
</template>

<script lang="js" setup name="loan">
import loan from './components/loan.vue';
import combinedLoanCalculator from './components/combinedLoanCalculator.vue';
import paymentInAdvance from './components/paymentInAdvance.vue';
import {ref} from 'vue'

const currentTab = ref(1);
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
    .a-card {
        padding: 1rem;
    }
}
</style>