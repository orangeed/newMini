<!--  -->
<script lang="js" setup name=''>
import topicList from './data.json'

const props = defineProps({
  version: {
    type: String,
    required: true,
  },
})

const emits = defineEmits(['result'])

const currentData = ref(topicList[0])
const currentIndex = ref(0)
const result = ref([])
const currentChecked = ref(null)

function handleNext() {
  if (currentIndex.value + 1 === Number(props.version)) {
    emits('result', result.value)
  }
  else {
    currentChecked.value = null
    currentData.value = topicList[currentIndex.value + 1]
    currentIndex.value = currentIndex.value + 1
  }
}

function handleChangeRadio(item, index) {
  currentChecked.value = index
  result.value.push({
    id: currentData.value.id,
    score: item.score,
  })
}
</script>

<template>
  <div id="topic" class="h-full px-4">
    <div class="bg-white p-6 shadow-md" style="height: 80vh;">
      <p class="mb-4 text-lg font-bold">
        {{ `${currentIndex + 1}、${currentData.stem}` }}
      </p>
      <radio-group>
        <p v-for="(item, index) in currentData.options" :key="item.score" class="mb-3">
          <radio :value="item.value" :checked="index === currentChecked" @click="handleChangeRadio(item, index)" />
          {{ `${index === 0 ? 'A' : index === 1 ? 'B' : index === 2 ? 'C' : 'D'}、${item.text}` }}
        </p>
      </radio-group>
      <div class="flex h-8 items-center justify-center rounded bg-green-400 text-white" @click="handleNext">
        下一题
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
