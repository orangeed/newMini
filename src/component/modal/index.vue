<!--  -->
<script lang="ts" setup name=''>
const props = defineProps<{
  title?: string
  visible: boolean
}>()

const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'cancel'): void
}>()

const defalutVisible = ref(props.visible)

function handleClose() {
  defalutVisible.value = false
  emits('cancel')
}

watch(() => props.visible, (newVal) => {
  defalutVisible.value = newVal
})
</script>

<template>
  <div v-if="defalutVisible" class="omodal">
    <div class="inner">
      <div class="flex">
        <div />
        <span class="w-72 flex-1 truncate">{{ props.title }}</span>
        <span class="flex size-5 items-center justify-center" @click="handleClose">x</span>
      </div>
      <div class="mt-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.omodal {
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: inherit;

  .inner {
    width: 80%;
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    padding: 20px;
  }
}
</style>
