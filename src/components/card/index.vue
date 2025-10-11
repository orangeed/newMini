<!--
 * @Author: chenjie
 * @Date: 2025-05-14 17:39:15
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-05-14 17:39:34
 * @FilePath: \project3\src\component\card\index.vue
-->
<template>
  <div class="a-card" :class="{ 'a-card-bordered': bordered }">
    <div v-if="$slots.title || title" class="a-card-header">
      <slot name="title">
        {{ title }}
      </slot>
    </div>
    <div class="a-card-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  bordered: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.a-card {
  background-color: #fff;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;
}

.a-card-bordered {
  border: 1px solid #f0f0f0;
}

.a-card-header {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #1f1f1f;
}

.a-card-body {
  font-size: 14px;
  color: #333;
}
</style>
