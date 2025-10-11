<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  previewList: { type: Array, default: () => [] }, // 多图预览
})

const visible = ref(false)
const scale = ref(1)
const rotateDeg = ref(0)
const currentIndex = ref(0)

const isWeb = typeof window !== 'undefined'
const imageList = computed(() => props.previewList.length ? props.previewList : [props.src])
const currentImage = computed(() => imageList.value[currentIndex.value])

const previewStyle = computed(() => ({
  transform: `scale(${scale.value}) rotate(${rotateDeg.value}deg)`,
}))

const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < imageList.value.length - 1)

function handleClick() {
  const index = imageList.value.findIndex(i => i === props.src)
  currentIndex.value = index === -1 ? 0 : index

  if (isWeb) {
    visible.value = true
  }
  else {
    uni.previewImage({
      urls: imageList.value,
      current: imageList.value[currentIndex.value],
    })
  }
}

function zoomIn() {
  scale.value = Math.min(scale.value + 0.2, 5)
}
function zoomOut() {
  scale.value = Math.max(scale.value - 0.2, 0.2)
}
function rotate() {
  rotateDeg.value = (rotateDeg.value + 90) % 360
}
function close() {
  visible.value = false
  scale.value = 1
  rotateDeg.value = 0
}

function prev() {
  if (hasPrev.value) {
    currentIndex.value--
    resetTransform()
  }
}
function next() {
  if (hasNext.value) {
    currentIndex.value++
    resetTransform()
  }
}

function resetTransform() {
  scale.value = 1
  rotateDeg.value = 0
}

function onWheel(e) {
  e.deltaY < 0 ? zoomIn() : zoomOut()
}

function onKeyDown(e) {
  if (!visible.value) { return }
  switch (e.key) {
    case 'Escape': close(); break
    case 'ArrowLeft': prev(); break
    case 'ArrowRight': next(); break
    case '+': zoomIn(); break
    case '-': zoomOut(); break
    case 'r': rotate(); break
  }
}

function handleError(e) {
  e.target.src = 'https://via.placeholder.com/100x100?text=Image+Error'
}

if (isWeb) {
  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
}
</script>

<template>
  <div class="a-image">
    <image :src="src" mode="widthFix" class="a-image-thumb" @click="handleClick" @error="handleError" />

    <!-- H5 预览层 -->
    <div v-if="visible && isWeb" class="a-image-preview-mask" @click.self="close">
      <img :src="currentImage" class="a-image-preview-img" :style="previewStyle" @wheel.stop.prevent="onWheel">
    </div>

    <!-- 工具栏 -->
    <div v-if="visible && isWeb" class="a-image-preview-toolbar-fixed">
      <div class="a-image-preview-toolbar">
        <button @click.stop="zoomIn">
          ＋
        </button>
        <button @click.stop="zoomOut">
          －
        </button>
        <button @click.stop="rotate">
          ⟳
        </button>
        <button :disabled="!hasPrev" @click.stop="prev">
          ←
        </button>
        <button :disabled="!hasNext" @click.stop="next">
          →
        </button>
        <button @click.stop="close">
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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

.a-image-preview-toolbar-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: transparent;
  z-index: 10000;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

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

.a-image-preview-toolbar button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.a-image-preview-toolbar button:hover:enabled {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
}
</style>
