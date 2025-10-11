<!--
 * @Author: chenjie
 * @Date: 2025-05-15 16:14:04
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-09-24 16:46:57
 * @FilePath: \newMini\src\component\navbar\index.vue
-->
<script setup lang="ts">
import { useNavBarContext } from '../../utils/useNavBarHeight.js'

const props = defineProps<{
  title?: string
  showBack?: boolean
  backStyle?: string
  titleStyle?: string
  background?: string
}>()

const { statusBarHeight, navBarHeight } = useNavBarContext()

function goBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  }
  else {
    uni.switchTab({ url: '/pages/login/index' })
  }
}
</script>

<template>
  <view
    class="custom-navbar"
    :style="{ paddingTop: `${statusBarHeight}px`, height: `${navBarHeight}px`, background: props.background }"
  >
    <view class="nav-content">
      <view class="back-btn" @tap="goBack">
        <image
          v-if="props.showBack"
          src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTUgMThMOSAxMkwxNSA2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K"
          class="back-icon" :style="props.backStyle"
        />
      </view>
      <view class="title" :style="props.titleStyle">
        {{ props.title }}
      </view>
      <view class="w-6" />
    </view>
  </view>
</template>

<style scoped>
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.15);
  /* 半透明白色 */
  backdrop-filter: blur(12px);
  /* 毛玻璃核心 */
  -webkit-backdrop-filter: blur(12px);
  /* 兼容性前缀 */
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  /* 可选分割线 */
}

.nav-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20rpx;
}

.back-btn {
  padding-right: 20rpx;
  flex: 1;
}

.back-icon {
  width: 36rpx;
  height: 36rpx;
}

.title {
  text-align: center;
  font-size: 34rpx;
  font-weight: bold;
  width: 100%;
}
</style>
