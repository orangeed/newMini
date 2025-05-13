<!-- 软件收集处 -->
<template>
  <div class="w-full h-screen flex flex-col justify-center items-center">
    <!-- <p class=" text-white font-bold text-3xl text-center p-2">软件收集处</p> -->
    <div class="flex justify-center items-center">
      <div style="width: 80vw; height: 80vh; background-color: #ffffff4f" class="rounded-xl flex items-start p-8">
        <!-- <div style="max-width: 1600px;margin: 0 auto;height: 80vh;" class="flex items-center"> -->
        <div v-for="(item, index) in softList" :key="index"
          class="cursor-pointer text-white font-bold w-32 underline flex flex-col justify-center items-center hover:text-orange-500"
          @click="handleOpen(item)">
          <img :src="getImageByText(item.title)" />
          <a-popover :title="item.name">
            <span class="mt-2 w-28 text-center text-ellipsis overflow-hidden">{{ item.name }}</span>
          </a-popover>
        </div>
      </div>
    </div>
    <a-modal v-model:visible="visible" @ok="handleGoTo" @cancel="visible = false" ok-text="去下载" :width="width">
      <template #title>
        {{ currentData.name }}
      </template>
      <div>{{ currentData.desc }}</div>
    </a-modal>
    <canvas id="imgCanvas" height="50" width="100" style="display: none;"></canvas>
  </div>
</template>

<script lang="js" setup name="soft">
import { ref } from 'vue';
import { getImageByText } from '../../utils';
import { getSoftList } from '../../serve/soft';

const currentData = ref({})

const visible = ref(false)

const width = ref('')

const softList = ref([])

// 获取软件列表
const handleGetSoftListData = async () => {
  const res = await getSoftList()
  softList.value = res
}
handleGetSoftListData()

// 打开详情
const handleOpen = (item) => {
  currentData.value = item
  visible.value = true
}

// 点击跳转
const handleGoTo = () => {
  window.open(currentData.value.url)
}

// 获取屏幕大小
const handleGetScreenSize = () => {
  const w = document.body.clientWidth
  if (w < 500) {
    width.value = '260px'
  } else {
    width.value = ''
  }
}

handleGetScreenSize()
</script>

<style lang="scss" scoped></style>
