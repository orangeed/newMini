<!-- 将json字符串转化为json -->
<template>
  <div id="tojson" class="flex flex-col w-full h-screen lg:p-20 md:p-2 xs:p-2">
    <img src="https://picsum.photos/1920/1080" style="position: absolute; z-index: -1; height: 100%; width: 100%" />
    <a-space>
      <a-button type="primary" @click="handleClick">
        <template #icon> <icon-brush /> </template>格式化
      </a-button>
      <a-button type="primary" @click="handleDownload">
        <template #icon> <icon-download /> </template>下载
      </a-button>
      <a-button type="primary" @click="handleCopy">
        <template #icon> <icon-copy /> </template>复制
      </a-button>
      <a-button @click="handleReset">
        <template #icon> <icon-delete /> </template>清空
      </a-button>
    </a-space>
    <div class="flex h-full mt-4 lg:flex-row md:flex-col xs:flex-col">
      <div class="flex-1 lg:w-1/2 md:w-full xs:w-full">
        <a-textarea placeholder="请输入json字符串内容" class="h-full" v-model="jsonText" />
      </div>
      <div class="flex-1 border bg-gray-100 lg:w-1/2 lg:ml-10 lg:mt-0 md:w-full xs:mt-4 xs:w-full overflow-auto">
        <vue-json-pretty :data="jsonResult" v-if="jsonResult" :showIcon="true" :virtual="true" :height="resultHeight" />
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { Message } from '@arco-design/web-vue';
import { IconDelete, IconBrush, IconDownload, IconCopy } from '@arco-design/web-vue/es/icon';
import { saveAs } from 'file-saver';
import { useClipboard } from '@vueuse/core';
import { getSessStorage } from '../../utils/storage';
import { StoreKey } from '../../enmu';

const jsonText = ref('')

const jsonResult = ref('')

const resultHeight = ref(0)

const { copy } = useClipboard({ source: jsonText.value })

// 格式化
const handleClick = () => {
    if (!jsonText.value) return Message.warning('请输入json字符串')
    try {
        jsonResult.value = JSON.parse(jsonText.value)
    } catch (error) {
        jsonResult.value = error
    }
}

// 清空
const handleReset = () => {
    jsonText.value = ''
    jsonResult.value = ''
}

// 下载
const handleDownload = () => {
    const data = new Blob([jsonText.value], { type: 'application/json' })
    saveAs(data, 'json文件.json')
}

// 复制
const handleCopy = async () => {
    await copy(jsonText.value)
    Message.success('已复制到剪贴板！')
}

// 获取缓存
const handleGetCache = () => {
    const cache = JSON.stringify(getSessStorage(StoreKey.CODE))
    console.log('cache',cache);
    if (cache && cache != 'null') {
        jsonText.value = cache
        handleClick()
    }

    // 设置高度
    const height = document.documentElement.clientHeight
    resultHeight.value = height - 164
}
handleGetCache()
</script>

<style lang="scss" scoped></style>
