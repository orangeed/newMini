<template>
  <button
    class="a-button"
    :class="[`a-button-${type}`, { 'is-loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="a-button-spinner"></span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>

<style scoped>
.a-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
  background-color: #fff;
  color: #333;
  user-select: none;
  position: relative;
}

.a-button:hover:not(:disabled):not(.is-loading) {
  opacity: 0.85;
}

.a-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.a-button-default {
  border: 1px solid #d9d9d9;
  background-color: #fff;
  color: #333;
}

.a-button-primary {
  background-color: #1890ff;
  color: #fff;
  border-color: #1890ff;
}

.a-button-secondary {
  background-color: #f5f5f5;
  color: #333;
  border-color: #d9d9d9;
}

.a-button-dashed {
  border-style: dashed;
  border-color: #d9d9d9;
  color: #333;
  background-color: #fff;
}

.a-button-outline {
  background-color: #fff;
  color: #1890ff;
  /* border: 1px solid #1890ff; */
}

.a-button-text {
  border: none;
  background-color: transparent;
  color: #1890ff;
}

.a-button-danger {
  background-color: #ff4d4f;
  color: #fff;
  border-color: #ff4d4f;
}

/* Loading spinner */
.a-button-spinner {
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  animation: spin 0.6s linear infinite;
}

.a-button-primary .a-button-spinner {
  border: 2px solid #fff;
  border-top-color: transparent;
}

.a-button-default .a-button-spinner,
.a-button-outline .a-button-spinner,
.a-button-text .a-button-spinner {
  border: 2px solid #999;
  border-top-color: transparent;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
