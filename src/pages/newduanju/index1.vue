<!-- 新写的短剧页面 -->
<template>
  <div class="h-screen w-full">
    <a-spin :loadin="loading" tip="查询中..." class="w-full">
      <!-- 头 -->
      <orange-header @search="handleSearch"></orange-header>
      <!-- 内容 -->
      <!-- style="height: calc(100% - 128px)" -->
      <div style="height: calc(100vh - 128px)" class="flex flex-col w-full items-center relative">
        <a-alert :title="`一共收集了${allTVNum}部！`" style=" max-width: 1400px;" />
        <div class="bg-gray-200 rounded-lg opacity-50 mt-2" style="
            max-width: 1400px;
            height: calc(100vh - 188px);
            z-index: -1;
            position: absolute;
            top: 60px;
            width: 100%;
          "></div>
        <div class="mt-2" style="max-width: 1400px; width: 100%;">
          <a-row :gutter="6">
            <a-col :span="documentSize >= 1400 ? 18 : 24" class="overflow-auto" style="height: calc(100vh - 250px)">
              <div v-for="(item, index) in result" :key="index" @click="handleGoTo(item)"
                class="cursor-pointer p-4 rounded hover:text-orange-400 hover:bg-gray-100 hover:font-bold m-2">
                {{ item.name }}
              </div>
            </a-col>

            <a-col :span="6" v-if="documentSize >= 1400">
              <div style="margin: 40px 0px">
                <div class="flex align-center p-4">
                  <p>
                    短剧网站访问次数：<span class="num">{{ lookTotal }}</span>
                    次
                  </p>
                  <a-tooltip content="一共访问的总数">
                    <icon-question-circle-fill />
                  </a-tooltip>
                </div>
                <div class="flex align-center p-4">
                  <p>
                    短剧查询次数：<span class="num">{{ searchTotal }}</span> 次
                  </p>
                  <a-tooltip content="一共查询到的短剧总数">
                    <icon-question-circle-fill />
                  </a-tooltip>
                </div>
                <div class="flex align-center p-4">
                  <p>
                    短剧点击次数：<span class="num">{{ clickTotal }}</span> 次
                  </p>
                  <a-tooltip content="查询到的短剧点击次数">
                    <icon-question-circle-fill />
                  </a-tooltip>
                </div>
              </div>
            </a-col>
          </a-row>
          <div class="flex justify-center mb-2">
            <a-pagination :size="documentSize >= 1400 ? 'medium' : 'mini'" :current="pageConfig.page"
              :page-size="pageConfig.size" :total="pageConfig.total" :simple="false"  showPageSize
              :size-options="[30, 50, 100, 150]" @change="handleChangePage" @pageSizeChange="handleChangeSize"
              class="mt-2" />
          </div>
        </div>
      </div>
      <!-- 底部 -->
      <footer class="h-16 flex flex-col items-center justify-center text-sm text-center text-gray-600 font-bold">
        <p class="cursor-pointer text-hover" @click.stop="handleToGov">
          蜀ICP备2022021714号-1
        </p>
        <p>Copyright © 2022-2024 by orange</p>
      </footer>
    </a-spin>
  </div>
</template>

<script lang="js" setup name="">
import { reactive, ref } from 'vue';
import { getDuanjuPage, patchNum, getDuanjuSearchNum, saveLookTime, getLookTime, getDuanjuAllSearchNum, getDuanjuAllNum } from '../../serve/duanju';
import OrangeHeader from './header/index.vue'
import { IconQuestionCircleFill } from '@arco-design/web-vue/es/icon';

const pageConfig = reactive({
  page: 1,
  size: 30,
  total: 0
})

const result = ref([])

const allTVNum = ref(0)

const clickTotal = ref(0)

const loading = ref(false)

const lookTotal = ref(0)

const searchTotal = ref(0)

const documentSize = ref(0)

// 分页查询
const handleSearchByPage = (name) => {
  loading.value = true
  const params = {
    page: pageConfig.page,
    size: pageConfig.size
  }
  if (name) { params.name = name }
  // 分页查询
  getDuanjuPage(params).then(res => {
    console.log(res)
    result.value = res.data
    pageConfig.total = res.total
  }).finally(() => {
    loading.value = false
  })
}


// 搜索查询
const handleSearch = (params) => {
  console.log('params', params);
  // 搜索查询
  handleSearchByPage(params)
}

// 跳转链接
const handleGoTo = (item) => {
  window.open(item.url)
  patchNum({ id: item.id })
}

// 分页查询
const handleChangePage = (page) => {
  pageConfig.page = page
  handleSearchByPage()
}

// 页码改变
const handleChangeSize = (size) => {
  pageConfig.size = size
  handleSearchByPage()
}


// 获取所有短剧数量
const handleGetAllTVNum = () => {
  getDuanjuAllNum().then(res => {
    allTVNum.value = res.totalNum
  })
}

// 点击次数
const getClickNum = () => {
  getDuanjuSearchNum().then(res => {
    clickTotal.value = res.totalNum
  })
}

// 查询次数
const getSearchNum = () => {
  getDuanjuAllSearchNum().then(res => {
    searchTotal.value = res.totalNum
  })
}

// 进入页面保存ip，存访问次数
const handleSaveLookTime = () => {
  saveLookTime()
}

// 获取访问次数
const handleGetLookTime = () => {
  getLookTime().then(res => {
    lookTotal.value = res.totalNum
  })
}

// 获取页面大小
const handleGetPageSize = () => {
  documentSize.value = document.body.clientWidth
  console.log('---', documentSize.value);
}

const handleInit = () => {
  handleSearchByPage()
  handleGetAllTVNum()
  handleSaveLookTime()
  getSearchNum()
  getClickNum()
  handleGetLookTime()
  handleGetPageSize()
}
handleInit()
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgb(240, 240, 240);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: rgb(179, 179, 179);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(100, 100, 100);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:active {
  background: rgb(121, 120, 120);
  border-radius: 6px;
}

:deep(.arco-image) {
  width: 30%;
  margin: 10px;
}

:deep(.arco-image img) {
  width: 100%;
}

:deep(.arco-spin) {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.num {
  color: orange;
  font-weight: 600;
  font-size: 20px;
}
</style>
