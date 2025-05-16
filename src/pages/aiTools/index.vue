<script lang="js" setup>
import {
  ref,
  watch,
} from 'vue'
import {
  getAITools,
} from '../../serve/aiTools'
import { useNavBarContext } from '../../utils/useNavBarHeight.ts'

const { navBarHeight } = useNavBarContext()
const mobileMenuOpen = ref(false)
const currentCategory = ref(1)
const searchQuery = ref('')
const loading = ref(false) // 添加加载状态
const error = ref(null) // 添加错误状态
const filteredTools = ref([])

const categories = [{
  id: 1,
  name: '文本生成',
}, {
  id: 2,
  name: '图像生成',
}, {
  id: 3,
  name: '音频处理',
}, {
  id: 4,
  name: '视频制作',
}, {
  id: 5,
  name: '开发辅助',
}, {
  id: 6,
  name: '数据分析',
}, {
  id: 7,
  name: 'AI Agent',
}, {
  id: 8,
  name: '其他',
}]

const tools = ref([])

function handleSearch() {
  if (searchQuery.value.trim() === '') {
    filteredTools.value = tools.value
    return
  }

  filteredTools.value = tools.value.filter((tool) => {
    const matchesCategory = currentCategory.value === 0 || Number(tool.category) === currentCategory
      .value
    const matchesSearch
      = (tool.name && tool.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
        || (tool.description && tool.description.toLowerCase().includes(searchQuery.value
          .toLowerCase()))
        || (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.value
          .toLowerCase())))

    return matchesCategory && matchesSearch
  })
}

function selectMobileCategory(categoryId) {
  currentCategory.value = categoryId
  mobileMenuOpen.value = false
}

// 获取数据
async function handleGetData() {
  try {
    loading.value = true
    error.value = null

    const res = await getAITools({
      category: currentCategory.value,
    })

    if (!res || !Array.isArray(res)) {
      error.value = '数据格式错误'
      return
    }

    // 处理数据
    const processedData = res.map((item) => {
      return {
        ...item,
        tags: typeof item.tags === 'string' ? item.tags.split(',') : item.tags || [],
      }
    })

    tools.value = processedData
  }
  catch (err) {
    error.value = err.message || '获取数据失败'
  }
  finally {
    loading.value = false
  }
}

function handleClick(item) {
  window.open(item.url)
}

watch(() => currentCategory.value, () => {
  handleGetData()
}, {
  immediate: true,
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- #ifndef H5 -->
    <CostomNavBar title="AI工具集" showBack backStyle="background:#000" titleStyle="color:#000" />
    <!-- #endif -->
    <a-spin :loading="loading" tip="加载中..." class="h-screen w-full">
      <!-- Desktop Sidebar -->
      <aside class="fixed left-0 top-0 hidden h-full w-64 bg-white shadow-lg lg:block">
        <div class="p-6">
          <h1 class="mb-8 flex items-center text-2xl font-bold text-gray-800">
            <img src="../../static/ai.png" class="mr-2 w-10 rounded-full">
            橘享AI工具集
          </h1>
          <nav>
            <ul class="space-y-2">
              <li v-for="category in categories" :key="category.id">
                <button
                  class="flex w-full items-center rounded-lg p-3 text-left transition-colors" :class="{
                    'bg-orange-50 text-orange-600': currentCategory === category.id,
                    'hover:bg-orange-100': currentCategory !== category.id,
                  }" @click="currentCategory = category.id"
                >
                  <!-- #ifdef H5 -->
                  <component :is="category.icon" class="mr-3" />
                  <!-- #endif -->
                  <span>{{ category.name }}</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- Mobile Header -->
      <header
        class="fixed inset-x-0 top-0 z-50 bg-white shadow-sm lg:hidden"
        :style="{ paddingTop: `${navBarHeight}px` }"
      >
        <div class="flex items-center justify-between p-4">
          <h1 class="flex items-center text-xl font-bold" @click="mobileMenuOpen = !mobileMenuOpen">
            <img src="../../static/ai.png" class="mr-2 size-10 rounded-full">
            橘享AI工具集
          </h1>
        </div>
        <!-- Mobile Menu -->
        <div
          class="duration-600 fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-lg transition-all ease-in-out-smooth"
          :class="mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-90'"
          :style="{ paddingTop: `${navBarHeight}px` }"
        >
          <div class="p-6">
            <div class="mb-8 flex items-center justify-between">
              <h2 class="flex items-center text-base font-bold" @click="mobileMenuOpen = false">
                <img src="../../static/ai.png" class="mr-2 size-10 rounded-full">
                橘享AI工具集
              </h2>
              <button class="!rounded-button" @click="mobileMenuOpen = false" />
            </div>
            <nav>
              <ul class="space-y-2">
                <li v-for="category in categories" :key="category.id">
                  <button
                    class="flex w-full items-center rounded-lg p-3 text-left transition-colors" :class="{
                      'bg-blue-50 text-blue-600': currentCategory === category.id,
                      'hover:bg-gray-100': currentCategory !== category.id,
                    }" @click="selectMobileCategory(category.id)"
                  >
                    <!-- #ifdef H5 -->
                    <component :is="category.icon" class="mr-3" />
                    <!-- #endif -->
                    <span>{{ category.name }}</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="pt-20 lg:ml-64 lg:pt-0">
        <div class="mx-auto w-full p-6">
          <!-- Search Bar -->
          <div class="relative mb-8">
            <input
              v-model="searchQuery" type="text" placeholder="搜索 AI 工具..."
              class="h-10 w-full rounded-lg border border-gray-200 bg-white px-4 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              @input="handleSearch"
            >
          </div>

          <div v-if="error" class="mb-8 text-center text-red-500">
            {{ error }}
          </div>

          <!-- Tools Grid -->
          <div v-if="!loading && !error" class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
            <div
              v-for="tool in (searchQuery ? filteredTools : tools)" :key="tool.id"
              class="cursor-pointer rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
              @click="handleClick(tool)"
            >
              <div class="mb-4 h-48 w-full overflow-hidden rounded-lg bg-black">
                <img :src="tool.image" :alt="tool.name" class="size-full object-cover object-top">
              </div>
              <h3 class="mb-2 text-lg font-semibold">
                {{ tool.name }}
              </h3>
              <p class="mb-4 text-sm text-gray-600">
                {{ tool.description }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in tool.tags" :key="tag"
                  class="rounded-full bg-orange-500 px-3 py-1 text-sm text-white"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </a-spin>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

input[type='text']:focus {
  outline: none;
}
</style>
