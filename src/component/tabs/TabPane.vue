<template>
  <view v-if="isActive">
    <slot />
  </view>
</template>

<script setup>
import { inject, computed, onMounted } from 'vue'

const props = defineProps({
  label: String,
  name: String,
  disabled: {
    type: Boolean,
    default: false
  }
})

const registerPane = inject('registerPane')
const activeName = inject('activeName')

const isActive = computed(() => props.name === activeName.value)

onMounted(() => {
  registerPane({
    label: props.label,
    name: props.name,
    disabled: props.disabled
  })
})
</script>
