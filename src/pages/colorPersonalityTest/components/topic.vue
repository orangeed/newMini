<script lang="js" setup name=''>
import topicList from './data'

const props = defineProps({
  version: {
    type: String,
    required: true,
  },
})

const emits = defineEmits(['result'])

// 洗牌函数（Fisher–Yates）
function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * 抽题函数：按颜色保证数量 + 随机补足
 * @param {Array} fullList — 全题库
 * @param {number} total — 要抽的题目总数（如 10 或 30）
 * @param {object} guarantee — 各颜色最少要抽的题数，如 { G:2, B:2, Y:2, R:2 } 或 { G:7, B:7, Y:7, R:7 }
 * @returns {Array} 抽出的题目数组（已打乱顺序）
 */
function pickQuestions(fullList, total, guarantee) {
  const groups = { G: [], B: [], Y: [], R: [] }
  fullList.forEach((q) => {
    const c = q.color
    if (groups[c]) {
      groups[c].push(q)
    }
    else {
      // 如果有意外颜色，放到一个备用组
      groups[c] = groups[c] || []
      groups[c].push(q)
    }
  })

  const picked = []
  // 先保证每种颜色抽 guarantee[color] 题
  for (const color of Object.keys(guarantee)) {
    const grp = groups[color] || []
    const num = guarantee[color]
    if (grp.length <= num) {
      // 如果这一颜色题目本来就不够，就全部拿，后面再从其它颜色补
      picked.push(...grp)
      groups[color] = []
    }
    else {
      const shuffled = shuffle(grp)
      picked.push(...shuffled.slice(0, num))
      groups[color] = shuffled.slice(num)
    }
  }

  // 还差多少题
  const remain = total - picked.length
  if (remain > 0) {
    // 把所有剩余题合并
    let restPool = []
    for (const color in groups) {
      restPool = restPool.concat(groups[color])
    }
    restPool = shuffle(restPool)
    picked.push(...restPool.slice(0, remain))
  }
  // 最终打乱顺序
  return shuffle(picked)
}

// 根据 props.version 决定 guarantee 数目
const topicCount = Number(props.version)
let guarantee = {}
if (topicCount === 10) {
  guarantee = { G: 2, B: 2, Y: 2, R: 2 }
}
else if (topicCount === 30) {
  guarantee = { G: 7, B: 7, Y: 7, R: 7 }
}
else {
  // 若有其它版本需求，可以在这里扩展
  // 默认不保证颜色分布，全部随机
}

// 抽题
const pickedList = pickQuestions(topicList, topicCount, guarantee)

const currentIndex = ref(0)
const currentData = ref(pickedList[0])
const result = ref([])
const currentChecked = ref(null)

function handleNext() {
  if (currentChecked.value === null) {
    uni.showToast({
      title: '请选择一个选项',
      icon: 'error',
    })
    return
  }

  // 保存答案
  result.value.push({
    id: currentData.value.id,
    score: currentData.value.options[currentChecked.value].score,
    color: currentData.value.color,
  })

  // 下一题或结束
  if (currentIndex.value + 1 >= topicCount) {
    emits('result', result.value)
  }
  else {
    currentIndex.value++
    currentData.value = pickedList[currentIndex.value]
    currentChecked.value = null
  }
}

function handleChangeRadio(idx) {
  currentChecked.value = idx
}
</script>

<template>
  <div id="topic" class="h-full px-4">
    <div class="mb-4 rounded bg-white px-6 py-4 shadow-md">
      <p style="font-size: 13px;" class="mb-2">
        色彩性格测试：<span style="font-size: 13px;"> {{ `${currentIndex + 1}/${props.version}` }} </span>
      </p>
      <div class="process mb-1">
        <div class="process-inner" :style="{ width: `${(currentIndex + 1) / Number(props.version) * 100}%` }" />
      </div>
    </div>
    <div class="rounded bg-white p-6 shadow-md" style="height: 60vh;">
      <p class="mb-4 text-lg font-bold">
        {{ `${currentIndex + 1}、${currentData.stem}` }}
      </p>
      <radio-group>
        <p v-for="(item, index) in currentData.options" :key="index" class="mb-3">
          <radio :value="index" :checked="index === currentChecked" @click="handleChangeRadio(index)" />
          {{ `${index === 0 ? 'A' : index === 1 ? 'B' : index === 2 ? 'C' : 'D'}、${item.text}` }}
        </p>
      </radio-group>
      <div class="flex h-8 items-center justify-center rounded bg-green-400 text-white" @click="handleNext">
        下一题
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.process {
  height: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  width: 100%;

  &-inner {
    height: 100%;
    border-radius: 10px;
    background-color: #4ade80;
    transition: width 0.5s ease-in-out;
  }
}
</style>
