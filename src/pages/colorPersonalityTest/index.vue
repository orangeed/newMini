<script setup>
import { ref } from 'vue'
import { useNavBarContext } from '../../utils/useNavBarHeight.ts'
import topicList from './components/data'
import Result from './components/result.vue'
import Topic from './components/topic.vue'

const { navBarHeight } = useNavBarContext()
const versions = [
  { key: 'lite', name: '简化版', count: 10, desc: '快速娱乐 / 课间小游戏' },
  { key: 'standard', name: '标准版', count: 30, desc: '团队与沟通使用的中等精度版本' },
  { key: 'deep', name: '深度版', count: 60, desc: '更稳定的性格倾向结果（题库可扩展）' },
]

const selectedVersion = ref(null)
const processState = ref('select') // select, topic, result
const result = ref({
  // primary: 'R',
  // secondary: 'B',
  // raw: {
  //   R: 17,
  //   B: 3,
  //   Y: 3,
  //   G: 2,
  // },
  // radar: [
  //   17,
  //   3,
  //   3,
  //   2,
  // ],
})

function handleStart(versionKey) {
  selectedVersion.value = versionKey
  processState.value = 'topic'
}

function colorScore(answers, list) {
  const raw = { R: 0, B: 0, Y: 0, G: 0 }
  answers.forEach((a) => {
    const q = list.find(k => k.id === a.id)
    if (!q) { return }
    let s = a.score
    if (q.reverse) { s = 6 - s } // 反向计分
    raw[q.color] += s
  })
  // 排序找主色、辅色
  const entries = Object.entries(raw).sort((a, b) => b[1] - a[1])
  const [primary, secondary] = [entries[0][0], entries[1][0]]
  const radar = ['R', 'B', 'Y', 'G'].map(c => raw[c])
  return { primary, secondary, raw, radar }
}

function handleResult(data) {
  processState.value = 'result'
  result.value = colorScore(data, topicList)
}
</script>

<template>
  <div id="color-text">
    <!-- #ifndef H5 -->
    <CostomNavBar title="色彩性格测试" showBack background="#04D76A" />
    <!-- #endif -->
    <div class="color-text  bg-gray-100" :style="{ paddingTop: `${navBarHeight}px` }">
      <div
        :style="{
          height: `calc(${processState === 'result' ? '100%' : '100vh'} - ${navBarHeight}px)`, paddingTop: '20px',
        }"
      >
        <div v-if="processState === 'select'" class="mx-5 max-w-3xl rounded-2xl bg-white p-6 shadow-md">
          <header class="mb-6">
            <h1 class="text-2xl font-semibold">
              色彩性格测试
            </h1>
            <p class="mt-2 text-sm text-gray-500">
              选择测试版本 → 完成题目 → 查看色彩性格结果
            </p>
          </header>

          <div class="grid gap-4 sm:grid-cols-3">
            <div v-for="opt in versions" :key="opt.key" class="rounded-lg border p-4 hover:shadow">
              <h3 class="font-medium">
                {{ opt.name }}
              </h3>
              <p class="my-2 text-sm text-gray-500">
                {{ opt.desc }}
              </p>
              <p class="text-sm">
                题目数：<span class="font-semibold">{{ opt.count }}</span>
              </p>
              <button
                class="mt-3 w-full rounded-md border bg-slate-100 py-2 hover:bg-slate-200"
                @click="handleStart(opt.count)"
              >
                开始测试
              </button>
            </div>
          </div>

          <footer class="mt-6 text-xs text-gray-400">
            注：该测试为性格倾向参考，非诊断性工具。结果计算采用积分制，而不是单一的选项统计制，更加精准详细。
          </footer>
        </div>
        <Topic v-if="processState === 'topic'" :version="selectedVersion" @result="handleResult" />
        <Result v-if="processState === 'result'" :result="result" />
      </div>
    </div>
  </div>
</template>

<style>
#color-text {
  height: 100%;
}
</style>
