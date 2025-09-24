<!-- 壁纸 -->
<script lang="js" setup>
import { reactive, ref } from 'vue'
import { getWallPaperList } from '../../serve/wallPaper'
import { useClipboard } from '../../utils/index'
import { useNavBarContext } from '../../utils/useNavBarHeight.ts'

const pageConfig = reactive({ page: 1, size: 10, total: 0, type: 'all' })
const documentSize = ref(0)
const loading = ref(false)
const result = ref([])
const searchText = ref('')
const { navBarHeight } = useNavBarContext()
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
  getWallPaperList(params).then((res) => {
    result.value = res.data
    pageConfig.total = res.total
  }).finally(() => {
    loading.value = false
  })
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
async function handleGoTo(url) {
  await copy(url)
}

function handleInit() {
  handleSearchByPage()
}
handleInit()
</script>

<template>
  <!-- #ifndef H5 -->
  <CostomNavBar title="壁纸" showBack background="#FFCA28" />
  <!-- #endif -->
  <div class="wallpaper bg-white" :style="{ paddingTop: `${navBarHeight}px`, height: 'fit-content' }">
    <!-- 主要内容区 -->
    <main class="wallpaper-box mx-auto max-w-6xl px-4 pb-12">
      <!-- 壁纸列表 -->
      <a-spin :loading="loading" tip="查询中..." class="w-full">
        <div v-if="result.length > 0" class="flex flex-col items-center justify-center space-y-4 rounded-md bg-white">
          <div
            v-for="wallPaper in result" :key="wallPaper.id"
            class="w-full rounded-lg bg-gray-100 p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="flex flex-col items-start justify-between">
              <div class="img-box">
                <div
                  v-for="(img, index) in wallPaper.img.split(',')" :key="index"
                  :style="{ width: wallPaper.modalType === 0 ? '150px' : '90px', overflow: hidden }"
                  @click="handleGoTo(wallPaper.titleUrl)"
                >
                  <image
                    :src="wallPaper.img.includes('https') ? img : `https://pic2.zhimg.com/${img}.jpg`" :style="{
                      height: wallPaper.modalType === 0 ? '90px' : '160px', width: '100%', overflow: 'hidden',
                    }"
                  />
                </div>
              </div>
              <div class="flex flex-col">
                <h3 class="text-base text-gray-900">
                  {{ wallPaper.title }}
                </h3>
                <div class="flex w-full justify-between">
                  <button
                    type="primary" class="!rounded-button !mr-4 whitespace-nowrap"
                    @click="handleGoTo(wallPaper.kkimgUrl)"
                  >
                    复制夸克链接
                  </button>
                  <button
                    type="primary" class="!rounded-button whitespace-nowrap"
                    @click="handleGoTo(wallPaper.xlimgUrl)"
                  >
                    复制迅雷链接
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <a-empty />
        </div>
        <!-- 加载更多 -->
        <div v-if="pageConfig.total > 0" class="mb-2 flex justify-center">
          <a-pagination
            :size="documentSize >= 1400 ? 'medium' : 'mini'" :current="pageConfig.page"
            :page-size="pageConfig.size" :total="pageConfig.total" :simple="false" showPageSize
            :size-options="[30, 50, 100, 150]" class="mt-2" @change="handleChangePage"
            @pageSizeChange="handleChangeSize"
          />
        </div>
      </a-spin>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.wallpaper {
  height: 100%;
  margin: 20px 0px;
  min-height: calc(100vh - 120px);

  &-box {
    // height: 100%;
    // height: calc(100vh - 120px);
    // overflow-y: auto;
  }
}

.detail-btn {
  background: #165dff;
  padding: 8px 20px;
  color: #fff;
}

.img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;

  img {
    height: 100%;
    width: 100%;
    /* 保持比例并裁剪 */
    object-fit: cover;
  }
}

.arco-space {
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: center;

  // div {
  //     width: 90px !important;
  //     min-height: 100px;
  // }
}
</style>
