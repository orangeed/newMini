<template>
  <div class="a-spin" :class="{ 'a-spin-loading': loading }">
    <div v-if="loading" class="a-spin-indicator">
      <div class="a-spin-dot">
        <span class="dot dot1"></span>
        <span class="dot dot2"></span>
        <span class="dot dot3"></span>
        <span class="dot dot4"></span>
      </div>
      <div v-if="tip" class="a-spin-tip">{{ tip }}</div>
    </div>
    <div class="a-spin-content" :style="{ opacity: loading ? 0.5 : 1 }">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  tip: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.a-spin {
  position: relative;
  display: inline-block;
}

.a-spin-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.a-spin-dot {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  margin: 0 2px;
  border-radius: 50%;
  background-color: #1890ff;
  animation: spin-bounce 1.2s infinite ease-in-out both;
}

.dot1 {
  animation-delay: -0.45s;
}
.dot2 {
  animation-delay: -0.3s;
}
.dot3 {
  animation-delay: -0.15s;
}
.dot4 {
  animation-delay: 0s;
}

.a-spin-tip {
  font-size: 14px;
  color: #666;
  text-align: center;
}

@keyframes spin-bounce {
  0%, 100% {
    transform: scale(0.6);
    opacity: 0.3;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

.a-spin-content {
  transition: opacity 0.3s;
}
</style>
