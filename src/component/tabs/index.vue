<template>
  <view class="tabs">
    <!-- 横向滑动 Tab Header -->
    <scroll-view scroll-x class="tab-headers" :show-scrollbar="false">
      <view v-for="pane in panes" :key="pane.name" :class="['tab-header', {
        active: pane.name === current,
        disabled: pane.disabled
      }]" @tap="() => onTabClick(pane)">
        {{ pane.label }}
      </view>
    </scroll-view>

    <!-- 内容区动画切换 -->
    <view class="tab-content">
      <view class="tab-pane-wrapper" :class="{ fade: enableTransition }" :key="current">
        <slot />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, provide } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  transition: {
    type: Boolean,
    default: true // 是否启用动画
  }
})

const emit = defineEmits(['update:modelValue', 'tabChange'])

const current = ref(props.modelValue)
const enableTransition = ref(props.transition)

watch(() => props.modelValue, val => {
  if (val !== current.value) {
    current.value = val
  }
})

watch(current, val => {
  emit('update:modelValue', val)
})

const panes = ref([])

const registerPane = (pane) => {
  if (!panes.value.find(p => p.name === pane.name)) {
    panes.value.push(pane)
  }
}

const onTabClick = (pane) => {
  if (pane.disabled || pane.name === current.value) return
  current.value = pane.name
  emit('update:modelValue', pane.name)  // ✅ 只在点击时同步外部
  emit('tabChange', pane.name)
}

provide('registerPane', registerPane)
provide('activeName', current)
</script>

<style scoped>
.tabs {
  width: 100%;
}

.tab-headers {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  overflow-x: auto;
}

.tab-header {
  display: inline-block;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #666;
  flex-shrink: 0;
}

.tab-header.active {
  color: #007aff;
  font-weight: bold;
  border-bottom: 4rpx solid #007aff;
}

.tab-header.disabled {
  color: #ccc;
  pointer-events: none;
}

.tab-content {
  padding: 20rpx;
}

.tab-pane-wrapper.fade {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0.2;
    transform: scale(0.98);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
