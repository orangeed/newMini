<template>
    <view class="pagination-wrapper">
        <!-- 页码按钮区域 -->
        <view class="pagination">
            <view class="btn" :class="{ disabled: currentPage <= 1 }" @tap="goPrev">
                ‹
            </view>

            <view v-for="item in pageList" :key="item.key" class="btn"
                :class="{ active: item.num === currentPage, ellipsis: item.ellipsis }"
                @tap="() => onClickPage(item.num)">
                {{ item.ellipsis ? '...' : item.num }}
            </view>

            <view class="btn" :class="{ disabled: currentPage >= pageCount }" @tap="goNext">
                ›
            </view>
        </view>

        <!-- 每页数量选择器 -->
        <view class="page-size-selector">
            每页
            <picker :range="pageSizeOptions" @change="onPageSizeChange">
                <view class="picker">
                    {{ pageSize }} 条
                </view>
            </picker>
        </view>

        <!-- 快速跳页 -->
        <view class="quick-jump">
            跳至
            <input class="jump-input" v-model="jumpInput" type="number" placeholder="页码" @confirm="onJumpConfirm"
                @blur="onJumpConfirm" />
            页
        </view>
    </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    total: Number,
    current: Number,
    pageSize: Number,
    pageSizeOptions: {
        type: Array,
        default: () => [10, 20, 50, 100]
    }
})

const emit = defineEmits(['update:current', 'update:pageSize', 'page-change', 'page-size-change'])

const currentPage = ref(props.current)
const pageSize = ref(props.pageSize)
const jumpInput = ref('')

watch(() => props.current, val => {
    currentPage.value = val
})

watch(() => props.pageSize, val => {
    pageSize.value = val
})

watch(currentPage, val => {
    emit('update:current', val)
    emit('page-change', val)
})

watch(pageSize, val => {
    emit('update:pageSize', val)
    emit('page-size-change', val)
    currentPage.value = 1 // 切换条数时重置页码
})

const pageCount = computed(() => Math.ceil(props.total / pageSize.value))

function goPrev() {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}
function goNext() {
    if (currentPage.value < pageCount.value) {
        currentPage.value++
    }
}
function onClickPage(num) {
    if (!num || num === currentPage.value) return
    currentPage.value = num
}

function onPageSizeChange(e) {
    const newSize = props.pageSizeOptions[e.detail.value]
    pageSize.value = newSize
}

function onJumpConfirm() {
    const page = Number(jumpInput.value)
    if (!page || page < 1 || page > pageCount.value) return
    currentPage.value = page
    jumpInput.value = ''
}

const pageList = computed(() => {
    const pages = []
    const total = pageCount.value
    const current = currentPage.value
    const showPages = 5
    const half = Math.floor(showPages / 2)

    let start = Math.max(1, current - half)
    let end = Math.min(total, current + half)

    if (end - start + 1 < showPages) {
        if (start === 1) end = Math.min(total, start + showPages - 1)
        else if (end === total) start = Math.max(1, end - showPages + 1)
    }

    if (start > 1) {
        pages.push({ num: 1, key: 'first' })
        if (start > 2) pages.push({ ellipsis: true, key: 'ellipsis-prev' })
    }

    for (let i = start; i <= end; i++) {
        pages.push({ num: i, key: i })
    }

    if (end < total) {
        if (end < total - 1) pages.push({ ellipsis: true, key: 'ellipsis-next' })
        pages.push({ num: total, key: 'last' })
    }

    return pages
})
</script>

<style scoped lang="scss">
.pagination-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 20rpx;
    font-size: 28rpx;
}

.pagination {
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
}

.btn {
    padding: 12rpx 20rpx;
    background: #f1f1f1;
    color: #333;
    border-radius: 8rpx;
}

.btn.active {
    background: #007aff;
    color: #fff;
    font-weight: bold;
}

.btn.disabled {
    color: #ccc;
    pointer-events: none;
}

.btn.ellipsis {
    background: transparent;
    pointer-events: none;
}

.page-size-selector,
.quick-jump {
    display: flex;
    align-items: center;

    .uni-input-placeholder {
        padding-left: 0
    }
}

.picker {
    padding: 0 16rpx;
    border: 1px solid #ccc;
    border-radius: 6rpx;
    margin-left: 10rpx;
    height: 32px;
    line-height: 32px;
}

.jump-input {
    width: 80rpx;
    margin: 0 8rpx;
    padding: 6rpx;
    border: 1px solid #ccc;
    text-align: center;
    border-radius: 6rpx;
}
</style>
