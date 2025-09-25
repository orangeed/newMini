<!--  -->
<script lang="js" setup name=''>
import { getWangyiyun } from '../../serve/wangyiyuan'
import { useClipboard } from '../../utils/index'
import { useNavBarContext } from '../../utils/useNavBarHeight.ts'

const { navBarHeight } = useNavBarContext()
const { copy } = useClipboard()

const wangyiyunInfo = ref({})

// 获取网易云会员
async function handleGetwangyiyun() {
  const res = await getWangyiyun()
  wangyiyunInfo.value = res
}

// 复制
async function handleCopy() {
  await copy(wangyiyunInfo.value.url)
}

onMounted(() => {
  handleGetwangyiyun()
})
</script>

<template>
  <div id="wangyiyun">
    <!-- #ifndef H5 -->
    <CostomNavBar title="网易云会员" showBack background="#F3434C" />
    <!-- #endif -->
    <div class="wangyiyun bg-white" :style="{ paddingTop: `${navBarHeight}px`, height: 'fit-content' }">
      <image
        src="https://fuluapiossproductnew.oss-cn-hangzhou.aliyuncs.com/Icon/FuluMainImage/0120.0190.png"
        style="width: 80vw;height: 200px;" mode="widthFix"
      />
      <p class="mt-4 text-base font-bold">
        {{ wangyiyunInfo.title }}
      </p>
      <p class="mt-4">
        复制以下链接，浏览器打开即可领取啦！
      </p>
      <p class="mt-4">
        地址：{{ wangyiyunInfo.url }}，<span class="cursor-pointer text-blue-500" @click="handleCopy">复制</span>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wangyiyun {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 10px;
}
</style>
