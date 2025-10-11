<!-- components/Message.vue -->
<template>
  <view
    v-if="visible"
    class="message"
    :class="type"
    :style="{ top: top + 'rpx' }"
  >
    {{ text }}
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 提示内容与状态
const visible = ref(false)
const text = ref('')
const type = ref('info') // 'success' | 'error' | 'info' | 'warning'
const top = ref(100)

let timer = null

function showMessage(msg, options = {}) {
  text.value = msg
  type.value = options.type || 'info'
  top.value = options.top || 100
  visible.value = true

  clearTimeout(timer)
  timer = setTimeout(() => {
    visible.value = false
  }, options.duration || 2000)
}

// ⚠️ 注册为全局唯一实例
onMounted(() => {
  // 每次挂载都将自己注册为当前 Message
  getApp().globalData.__currentMessage = {
    showMessage
  }
})
onUnmounted(() => {
  const cur = getApp().globalData.__currentMessage
  if (cur?.showMessage === showMessage) {
    getApp().globalData.__currentMessage = null
  }
})
</script>

<style scoped>
.message {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 20rpx 40rpx;
  border-radius: 4rpx;
  color: #fff;
  font-size: 28rpx;
  opacity: 0.95;
  max-width: 80%;
  text-align: center;
}
.success {
  background-color: #4caf50;
}
.error {
  background-color: #f44336;
}
.info {
  background-color: #2196f3;
}
.warning {
  background-color: #ff9800;
}
</style>
