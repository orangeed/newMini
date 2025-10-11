<!-- 软件收集处 -->
<script lang="js" setup name="soft">
import { ref } from 'vue'
import omodal from '../../components/modal/index.vue'
import { getSoftList } from '../../serve/soft'
import { useClipboard } from '../../utils/index'
import { Message } from '../../utils/message'
import { useNavBarContext } from '../../utils/useNavBarHeight.ts'

const visible = ref(false)
const currentData = ref(null)
const softList = ref([])
const { navBarHeight } = useNavBarContext()
const { copy } = useClipboard()

// 获取软件列表
async function handleGetSoftListData() {
  const res = await getSoftList()
  softList.value = res
}
handleGetSoftListData()

// 打开详情
function handleOpen(item) {
  currentData.value = item
  visible.value = true
}

// 点击跳转夸克
async function handleGoToKuake() {
  await copy(currentData.value.url.split(',')[0])
  Message.success('已复制夸克地址到剪贴板！')
}

// 点击跳转迅雷
async function handleGoToXunlei() {
  await copy(currentData.value.url.split(',')[1])
  Message.success('已复制迅雷地址到剪贴板！')
}

function handleClose() {
  visible.value = false
}
</script>

<template>
  <!-- #ifndef H5 -->
  <CostomNavBar title="软件收集" showBack background="#FFCA28" />
  <!-- #endif -->
  <div
    class="h-screen w-full overflow-auto bg-white"
    :style="{ paddingTop: `${navBarHeight}px`, height: 'fit-content' }"
  >
    <!-- <div style="margin-top: 520px;margin-bottom: 100px;"> -->
    <div class="mb-24 flex justify-center">
      <div :style="{ width: '99vw' }" class="items-start rounded-xl bg-white p-8 ">
        <div
          v-for="(item, index) in softList" :key="index"
          class="mb-4  mt-2 flex cursor-pointer flex-col items-start justify-center rounded-md bg-gray-100 p-4 font-bold transition-shadow hover:text-orange-400 hover:shadow-md"
          @click="handleOpen(item)"
        >
          <p class="w-72 truncate">
            {{ item?.name }}
          </p>
          <p style="font-size: 12px;" class="!pt-2 text-gray-500">
            时间：{{ item?.createTime }}
          </p>
        </div>
      </div>
    </div>
    <omodal v-model:visible="visible" :title="currentData?.name" @cancel="handleClose">
      <template #default>
        <div>{{ currentData?.desc }}</div>
        <div class="mt-6">
          <button type="primary" class="btn mb-4" @click="handleGoToKuake">
            复制夸克下载地址
          </button>
          <button v-if="currentData?.url?.split(',').length > 1" type="primary" class="btn" @click="handleGoToXunlei">
            复制迅雷下载地址
          </button>
        </div>
      </template>
    </omodal>
  </div>
</template>

<style lang="scss" scoped></style>
