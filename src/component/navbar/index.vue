<script setup lang="ts">
import { useNavBarContext } from '../../utils/useNavBarHeight.ts'

const props = defineProps<{
  title?: string
  showBack?: boolean
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
  <view class="custom-navbar" :style="{ paddingTop: `${statusBarHeight}px`, height: `${navBarHeight}px` }">
    <view class="nav-content">
      <view v-if="props.showBack" class="back-btn" @tap="goBack">
        <image
          src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTUgMThMOSAxMkwxNSA2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K"
          class="back-icon"
        />
      </view>
      <view class="title">
        {{ props.title }}
      </view>
    </view>
  </view>
</template>

<style scoped>
.custom-navbar {
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: transparent;
  color: #fff; */

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
}

.back-icon {
  width: 36rpx;
  height: 36rpx;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: bold;
}
</style>
