<!--
 * @Author: chenjie
 * @Date: 2025-05-13 10:13:38
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-09-25 11:27:04
 * @FilePath: \newMini\src\pages\login\index.vue
-->
<script lang="js" setup name="login">
import { ref } from 'vue'
import { getMenuList } from '../../serve/login'
import { useNavBarContext } from '../../utils/useNavBarHeight.ts'

const { navBarHeight } = useNavBarContext()

const list = ref([])

// 跳转路由
function handleGoTo(item) {
  if (item.out) {
    window.open(item.url)
  }
  else {
    uni.navigateTo({
      url: item.url,
    })
  }
}

// 获取菜单
async function handleGetMenuList() {
  const res = await getMenuList()
  list.value = res.filter(item => item.where.includes('moblie'))
}
handleGetMenuList()
</script>

<template>
  <div id="home-login">
    <CostomNavBar title="首页" />
    <div class="background-cover" />
    <div class="box" :style="{ paddingTop: `${navBarHeight}px` }">
      <div v-for="(item, index) in list" :key="index" class="item" @click="handleGoTo(item)">
        <span class="mt-2 font-bold">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#home-login {
  height: 100vh;

  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    overflow: auto;
  }

  .footer {
    height: 100px;
    text-align: center;
  }

  .item {
    width: 160px;
    height: 160px;
    border-radius: 12px;
    margin: 10px;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    background-size: cover;
    background-position: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }

  .item:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
  }

  .item:first-child {
    width: 88%;
    height: 160px;
  }

  /* 给不同菜单设置不同背景图 */
  .item:nth-child(1) {
    // https://picsum.photos/400/300?random=1
    background-image: url('https://picsum.photos/id/1015/600/400');
    /* 在线去水印 */
  }

  .item:nth-child(2) {
    background-image: url('https://picsum.photos/id/1005/600/400');
    /* 影视查询 */
  }

  .item:nth-child(3) {
    background-image: url('https://picsum.photos/id/1025/600/400');
    /* 短链接 */
  }

  .item:nth-child(4) {
    background-image: url('https://picsum.photos/id/1035/600/400');
    /* 软件收集处 */
  }

  .item:nth-child(5) {
    background-image: url('https://picsum.photos/id/1045/600/400');
    /* 壁纸 */
  }

  .item:nth-child(6) {
    background-image: url('https://picsum.photos/id/1055/600/400');
    /* 网易云会员 */
  }

  .item:nth-child(7) {
    background-image: url('https://picsum.photos/id/1065/600/400');
    /* 网盘会员 */
  }
}
</style>
