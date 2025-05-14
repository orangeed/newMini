<template>
  <div class="a-image">
    <img :src="src" class="a-image-thumb" @click="visible = true" @error="handleError" />

    <Teleport to="body">
      <div v-if="visible" class="a-image-preview-mask" @click.self="close">
        <img :src="src" class="a-image-preview-img" :style="previewStyle" @wheel.stop.prevent="onWheel" />
      </div>
      <div v-if="visible" class="a-image-preview-toolbar-fixed">
        <div class="a-image-preview-toolbar">
          <button @click.stop="zoomIn">＋</button>
          <button @click.stop="zoomOut">－</button>
          <button @click.stop="rotate">⟳</button>
          <button @click.stop="close">✕</button>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  }
});

const visible = ref(false);
const scale = ref(1);
const rotateDeg = ref(0);

const previewStyle = computed(() => ({
  transform: `scale(${scale.value}) rotate(${rotateDeg.value}deg)`
}));

function zoomIn() {
  scale.value = Math.min(scale.value + 0.2, 5);
}
function zoomOut() {
  scale.value = Math.max(scale.value - 0.2, 0.2);
}
function rotate() {
  rotateDeg.value = (rotateDeg.value + 90) % 360;
}
function close() {
  visible.value = false;
  scale.value = 1;
  rotateDeg.value = 0;
}
function onWheel(e) {
  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
}
function handleError(e) {
  e.target.src =
    'https://via.placeholder.com/100x100?text=Image+Error';
}

function onKeyDown(e) {
  if (e.key === 'Escape') {
    close();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>

<style scoped>
.a-image-thumb {
  width: 100px;
  height: 100px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 4px;
  transition: transform 0.3s;
}

.a-image-thumb:hover {
  transform: scale(1.05);
}

.a-image-preview-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.a-image-preview-img {
  max-width: 80%;
  max-height: 80%;
  transition: transform 0.3s;
}

/* 固定底部工具栏容器 */
.a-image-preview-toolbar-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: transparent;
  z-index: 10000;
  /* 比预览图层高 */
  display: flex;
  justify-content: center;
  pointer-events: none;
  /* 避免遮挡图片操作 */
}

/* 内部按钮区域可点击 */
.a-image-preview-toolbar {
  background: rgba(0, 0, 0, 0.5);
  padding: 12px 20px;
  border-radius: 10px 10px 0 0;
  display: flex;
  gap: 16px;
  pointer-events: auto;
}

.a-image-preview-toolbar button {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.a-image-preview-toolbar button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
}
</style>
