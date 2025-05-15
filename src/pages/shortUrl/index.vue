<!--
 * @Author: chenjie
 * @Date: 2025-05-13 20:43:03
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-05-15 17:30:48
 * @FilePath: \project3\src\pages\shortUrl\index.vue
-->
<script lang="js" setup>
import { ref } from 'vue'
import OButton from '../../component/button/index.vue'
import OMessage from '../../component/message/index.vue'
import OSpin from '../../component/spin/index.vue'
import OTextarea from '../../component/textarea/index.vue'
import { createNewUrl } from '../../serve/shortUrl'
import { useClipboard } from '../../utils/index'
import { Message } from '../../utils/message'
import { useNavBarContext } from '../../utils/useNavBarHeight.ts'

const { navBarHeight } = useNavBarContext()

const longUrl = ref('')

const shortUrl = ref('')

const loading = ref(false)

const { copy } = useClipboard({ source: shortUrl.value })

// 生成短链接
function handleCreate() {
  const reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/
  if (!reg.test(longUrl.value)) { return Message.error('请输入正确的链接!') }
  loading.value = true
  createNewUrl({ longUrl: longUrl.value }).then((res) => {
    shortUrl.value = `https://api.orangecj.cn/${res}`
  }).finally(() => {
    loading.value = false
  })
}

// 清空
function handleReset() {
  longUrl.value = ''
  shortUrl.value = ''
}

// 复制
async function handleCopy() {
  await copy(shortUrl.value)
  Message.success('已复制到剪贴板！')
}
</script>

<template>
  <div id="short-url" class="flex h-screen w-full flex-col items-center justify-center px-4">
    <div class="background-cover" />
    <!-- #ifndef H5 -->
    <CostomNavBar title="短链接" showBack />
    <!-- #endif -->
    <OSpin :loading="loading" tip="生成中..." class="w-full flex-col items-center" style="display: flex">
      <div :style="{ paddingTop: `${navBarHeight + 10}px` }">
        <div class="rounded bg-white p-2">
          <div class="mt-4 flex w-full flex-col items-center">
            <div class="mb-4 w-full">
              <OTextarea v-model="longUrl" placeholder="请输入原始链接..." auto-size />
            </div>
            <div class="mt-4 w-full">
              <OTextarea v-model="shortUrl" placeholder="生成后的短链接..." auto-size />
            </div>
          </div>
          <div style="gap: 10px;display: inline-flex;" class="mt-4">
            <OButton type="primary" @click="handleCreate">
              生成短链接
            </OButton>
            <OButton type="primary" @click="handleCopy">
              复制短链接
            </OButton>
            <OButton @click="handleReset">
              清空文本
            </OButton>
          </div>
          <div class="relative flex w-full justify-center">
            <div
              class="relative mt-4 p-4 font-bold leading-7 text-gray-500 xs:mt-4 xs:w-full md:w-full"
              style="font-size: 14px;"
            >
              <p>1.原始链接必须带有http或者https,比如https://www.orangecj.cn</p>
              <p>2.复制生成的短链接后,可以直接在浏览器地址访问使用.</p>
              <p>
                3.目前生成的地址是永久有效的,当然,如果服务器过期了,可能会暂时用不了,等服务器续费了就好了
              </p>
            </div>
          </div>
        </div>
      </div>
    </OSpin>
    <OMessage />
  </div>
</template>

<style lang="scss" scoped></style>
