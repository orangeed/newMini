<!--
 * @Author: chenjie
 * @Date: 2025-05-13 10:13:38
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-05-15 17:50:31
 * @FilePath: \project3\src\pages\login\index.vue
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

// 跳转到官网
// function handleToGov() {
//   window.open('https://beian.miit.gov.cn/')
// }
</script>

<template>
  <div id="home-login">
    <CostomNavBar title="首页" />
    <div class="background-cover" />
    <div class="box" :style="{ paddingTop: `${navBarHeight}px` }">
      <div v-for="(item, index) in list" :key="index" class="item" @click="handleGoTo(item)">
        <!-- <img :src="getAssetsFile(item.img)" class="img" /> -->
        <img :src="item.img" class="img">
        <span class=" mt-2 text-base font-bold">{{ item.name }}</span>
        <!-- <p class="mt-4">{{ item.describe }}</p> -->
      </div>
    </div>
    <!-- <div class="footer font-bold text-orange-600">
      <p class="text-hover cursor-pointer " @click.stop="handleToGov">
        蜀ICP备2022021714号-1
      </p>
      <p>Copyright © 2022-2025 by orange</p>
    </div> -->
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
    height: calc(100% - 100px);
    overflow: auto;
  }

  .footer {
    height: 100px;
    text-align: center;
  }

  .item {
    width: 160px;
    height: 160px;
    border-radius: 10px;
    background-color: rgba(218, 218, 218, 0.6);
    margin: 10px 10px;
    padding: 10px 20px;
    // border: 1px solid #ccc;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .img {
      height: 60px;
      width: 60px;
    }
  }

  .item:hover {
    background-color: #eeeeee;
  }
}
</style>
