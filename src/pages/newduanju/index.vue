<!-- 新写的短剧页面 -->
<script lang="js" setup>
import { reactive, ref } from 'vue'
import OMessage from '../../component/message/index.vue'
import MyPagination from '../../component/pagination/index.vue'
import Tabs from '../../component/tabs/index.vue'
import TabPane from '../../component/tabs/TabPane.vue'
import { getDuanjuPage, patchNum, saveLookTime } from '../../serve/duanju'
import { MOVIES_TYPE } from '../../utils/emun'
import { useClipboard } from '../../utils/index'
import { Message } from '../../utils/message'
import { useNavBarContext } from '../../utils/useNavBarHeight.ts'

const { navBarHeight } = useNavBarContext()
const pageConfig = reactive({ page: 1, size: 15, total: 0, type: 'all' })
const loading = ref(false)
const result = ref([])
const searchText = ref('')
const navigation = [{ name: '首页', type: 'all' }, { name: '短剧', type: '' }, { name: '电影', type: '3' }, { name: '电视剧', type: '1' }, { name: '动漫', type: '4' }]
const { copy } = useClipboard()

// 分页查询
function handleSearchByPage() {
  loading.value = true
  const params = {
    page: pageConfig.page,
    size: pageConfig.size,
    type: pageConfig.type,
    name: searchText.value,
  }
  // 分页查询
  getDuanjuPage(params).then((res) => {
    result.value = res.data
    pageConfig.total = res.total
  }).finally(() => {
    loading.value = false
  })
}

function handleTabChange(type) {
  pageConfig.type = type
  pageConfig.page = 1
  handleSearchByPage()
}

// 分页查询
function handleChangePage(page) {
  pageConfig.page = page
  handleSearchByPage()
}

// 页码改变
function handleChangeSize(size) {
  pageConfig.size = size
  handleSearchByPage()
}

// 跳转链接
function handleGoTo(item) {
  window.open(item.url)
  patchNum({ id: item.id })
}

// 进入页面保存ip，存访问次数
function handleSaveLookTime() {
  saveLookTime()
}

// 复制链接
async function handleCppy(item) {
  await copy(item.url)
  Message.success('已复制到剪贴板！')
}

function handleInit() {
  handleSearchByPage()
  handleSaveLookTime()
}
handleInit()
</script>

<template>
  <!-- #ifndef H5 -->
  <CostomNavBar title="短剧查询" showBack />
  <!-- #endif -->
  <div class="background-cover min-h-screen" :style="{ paddingTop: `${navBarHeight}px`, height: 'fit-content' }">
    <!-- <div class="background-cover" /> -->
    <!-- 导航栏 -->
    <nav class="fixed z-10 w-full  shadow-sm"
      style="background-color: rgba(255, 255, 255, 0.15);  backdrop-filter: blur(12px);  -webkit-backdrop-filter: blur(12px);  color: #fff;  border-bottom: 1px solid rgba(255, 255, 255, 0.2);">
      <div class="mx-auto max-w-7xl px-4">
        <div class="flex h-16 items-center justify-between">
          <!-- #ifdef H5 -->
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-800">
              橘子的分享
            </h1>
          </div>
          <!-- #endif -->
          <div class="ml-8 flex max-w-xl flex-1 items-center">
            <div class="relative flex w-full ">
              <input v-model="searchText" placeholder="搜索影视剧..." class="!rounded-button w-full text-white" allow-clear
                search-button>
              <button type="primary" class="btn w-24" @click="handleSearchByPage">
                搜索
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="border-b">
        <div class="mx-auto max-w-7xl px-4">
          <div class="flex space-x-8">
            <Tabs v-model="pageConfig.type" type="rounded" @tabChange="handleTabChange">
              <TabPane v-for="nav in navigation" :key="nav.type" :label="nav.name" :name="nav.type" />
            </Tabs>
          </div>
        </div>
      </div>
    </nav>
    <!-- 主要内容区 -->
    <main class="mx-auto max-w-7xl bg-transparent px-4 pb-12 pt-32" style="background:transparent">
      <!-- 影视列表 -->
      <div v-if="result.length > 0" class="space-y-4">
        <div v-for="movie in result" :key="movie.id"
          class="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900">
                {{ movie.name }}
              </h3>
              <div class="mt-2 flex items-center">
                <span class="text-gray-500">{{ movie.year }}</span>
                <div class="flex ">
                  <div class=" h-6 w-10 rounded bg-blue-500 text-center text-white" style="line-height: 24px;">
                    {{
                      movie.type
                        ? MOVIES_TYPE[Number(movie.type)] : '短剧'
                    }}
                  </div>
                </div>
              </div>
              <p class="mt-2 text-gray-600">
                {{ movie.description }}
              </p>
            </div>
            <!-- #ifdef MP-WEIXIN -->
            <button type="primary" class="!rounded-button btn whitespace-nowrap" @click="handleCppy(movie)">
              复制影视链接
            </button>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <button type="primary" class="!rounded-button btn whitespace-nowrap" @click="handleGoTo(movie)">
              立即观看
            </button>
            <!-- #endif -->
          </div>
        </div>
      </div>
      <div v-else>
        <a-empty />
      </div>
      <!-- 加载更多 -->
      <div v-if="pageConfig.total > 0" class="mb-2 mt-4 flex justify-center">
        <MyPagination v-model:current="pageConfig.page" v-model:pageSize="pageConfig.size" :total="pageConfig.total"
          :pageSizeOptions="[15, 30, 50, 100]" @page-change="handleChangePage" @page-size-change="handleChangeSize" />
      </div>
      <!-- 底部 -->
      <!-- <footer class="flex h-16 flex-col items-center justify-center text-center text-sm font-bold text-gray-600">
        <p class="text-hover cursor-pointer" @click.stop="handleToGov">
          蜀ICP备2022021714号-1
        </p>
        <p>Copyright © 2022-2024 by orange</p>
      </footer> -->
    </main>
    <OMessage />
  </div>
</template>
