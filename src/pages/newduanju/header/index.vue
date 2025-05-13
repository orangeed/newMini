<!--  -->
<template>
  <div class="h-16 flex items-center justify-center">
    <div class="w-96 flex">
      <a-textarea
        placeholder="直接输入短剧名称..."
        allow-clear
        auto-size
        v-model="text"
        class="w-80"
      />
      <a-button
        type="primary"
        @click="handleOk"
        class="ml-2"
        style="background-color: orange"
        >搜索</a-button
      >
    </div>
  </div>
</template>

<script lang="js" setup name="">
import { ref } from 'vue'

const text = ref('')

const emit = defineEmits(['search'])
const handleOk = () => {
  emit('search', text.value.trim())
}
</script>

<style lang="scss" scoped></style>
