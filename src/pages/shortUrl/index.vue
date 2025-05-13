<!-- 短链接 -->
<template>
  <div
    id="short-url"
    class="flex flex-col w-full h-screen p-4 items-center justify-center"
  >
    <a-spin
      :loading="loading"
      tip="生成中..."
      class="w-full flex-col items-center"
      style="display: flex"
    >
      <div class="flex mt-4 flex-col w-full items-center">
        <div class="flex-1 lg:w-1/2 md:w-full xs:w-full">
          <a-textarea
            placeholder="请输入原始链接..."
            auto-size
            v-model="longUrl"
            class="h-32"
          />
        </div>
        <div class="flex-1 lg:w-1/2 md:w-full xs:mt-4 xs:w-full">
          <a-textarea
            placeholder="生成后的短链接..."
            auto-size
            v-model="shortUrl"
          />
        </div>
      </div>
      <a-space class="mt-4">
        <a-button type="primary" @click="handleCreate">
          <template #icon> <icon-brush /> </template>生成短链接
        </a-button>
        <a-button type="primary" @click="handleCopy">
          <template #icon> <icon-copy /> </template>复制短链接
        </a-button>
        <a-button @click="handleReset">
          <template #icon> <icon-delete /> </template>清空文本
        </a-button>
      </a-space>

      <div class="relative w-full flex justify-center">
        <div
          class="text-gray-500 leading-7 mt-4 lg:w-1/2 md:w-full xs:mt-4 xs:w-full p-4 absolute top-0 h-32 bg-gray-200 opacity-50 rounded-lg"
        ></div>
        <div
          class="text-gray-500 leading-7 mt-4 lg:w-1/2 md:w-full xs:mt-4 xs:w-full p-4 relative font-bold "
        >
          <p>1.原始链接必须带有http或者https,比如https://www.orangecj.cn</p>
          <p>2.复制生成的短链接后,可以直接在浏览器地址访问使用.</p>
          <p>
            3.目前生成的地址是永久有效的,当然,如果服务器过期了,可能会暂时用不了,等服务器续费了就好了
          </p>
          <p>4.暂时没有其他想说的...</p>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="js" setup>
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconDelete, IconBrush, IconCopy } from '@arco-design/web-vue/es/icon';
import { useClipboard } from '@vueuse/core';
import { createNewUrl } from '../../serve/shortUrl';

const longUrl = ref('')

const shortUrl = ref('')

const loading = ref(false)

const { copy } = useClipboard({ source: shortUrl.value })

// 生成短链接
const handleCreate = () => {
    const reg= /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    if(!reg.test(longUrl.value)) return Message.error('请输入正确的链接!')
    loading.value = true
    createNewUrl({ longUrl: longUrl.value }).then(res => {
        shortUrl.value = `https://api.orangecj.cn/${res}`
    }).finally(() => {
        loading.value = false
    })
}

// 清空
const handleReset = () => {
    longUrl.value = ''
    shortUrl.value = ''
}


// 复制
const handleCopy = async () => {
    await copy(shortUrl.value)
    Message.success('已复制到剪贴板！')
}
</script>

<style lang="scss" scoped></style>
