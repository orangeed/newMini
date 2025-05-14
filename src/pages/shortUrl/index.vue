<!--
 * @Author: chenjie
 * @Date: 2025-05-13 20:43:03
 * @LastEditors: orangeed 1208917130@qq.com
 * @LastEditTime: 2025-05-14 20:48:26
 * @FilePath: \newMini\src\pages\shortUrl\index.vue
-->
<!-- 短链接 -->
<template>
  <div id="short-url" class="flex flex-col w-full h-screen p-4 items-center justify-center">
    <OSpin :loading="loading" tip="生成中..." class="w-full flex-col items-center" style="display: flex">
      <div class="flex mt-4 flex-col w-full items-center">
        <div class="flex-1  md:w-full xs:w-full mb-4">
          <OTextarea placeholder="请输入原始链接..." auto-size v-model="longUrl" />
        </div>
        <div class="flex-1  md:w-full xs:mt-4 xs:w-full mt-4">
          <OTextarea placeholder="生成后的短链接..." auto-size v-model="shortUrl" />
        </div>
      </div>
      <div style="gap: 10px;display: inline-flex;" class="mt-4">
        <OButton type="primary" @click="handleCreate"> 生成短链接 </OButton>
        <OButton type="primary" @click="handleCopy"> 复制短链接 </OButton>
        <OButton @click="handleReset"> 清空文本 </OButton>
      </div>
      <div class="relative w-full flex justify-center">
        <div class="text-gray-500 leading-7 mt-4 md:w-full xs:mt-4 xs:w-full p-4 relative font-bold ">
          <p>1.原始链接必须带有http或者https,比如https://www.orangecj.cn</p>
          <p>2.复制生成的短链接后,可以直接在浏览器地址访问使用.</p>
          <p>
            3.目前生成的地址是永久有效的,当然,如果服务器过期了,可能会暂时用不了,等服务器续费了就好了
          </p>
          <p>4.暂时没有其他想说的...</p>
        </div>
      </div>
    </OSpin>
    <OMessage />
  </div>
</template>

<script lang="js" setup>
import { ref } from 'vue';
import { useClipboard } from '../../utils/index';
import { createNewUrl } from '../../serve/shortUrl';
import OSpin from '../../component/spin/index.vue';
import OTextarea from '../../component/textarea/index.vue';
import OButton from '../../component/button/index.vue';
import { Message } from '../../utils/message';
import OMessage from '../../component/message/index.vue';

const longUrl = ref('')

const shortUrl = ref('')

const loading = ref(false)

const { copy } = useClipboard({ source: shortUrl.value })

// 生成短链接
const handleCreate = () => {
  const reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  if (!reg.test(longUrl.value)) return Message.error('请输入正确的链接!')
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
