<!-- 新写的短剧页面 -->
<template>
    <div class="min-h-screen bg-gray-50">
        <!-- 导航栏 -->
        <nav class="bg-white shadow-sm fixed w-full z-10">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between h-16 items-center">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold text-gray-800">橘子的分享</h1>
                    </div>
                    <div class="flex items-center flex-1 max-w-xl ml-8">
                        <div class="w-full relative flex ">
                            <input v-model="searchText" placeholder="搜索影视剧..." class="!rounded-button w-full"
                                allow-clear search-button>
                            <button @click="handleSearchByPage" type="primary" class="btn w-24">搜索</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="border-b">
                <div class="max-w-7xl mx-auto px-4">
                    <div class="flex space-x-8">
                        <Tabs type="rounded" v-model="pageConfig.type" @tabChange="handleSearchByPage">
                            <TabPane v-for="nav in navigation" :key="nav.type" :label="nav.name" :name="nav.type" />
                        </Tabs>
                    </div>
                </div>
            </div>
        </nav>
        <!-- 主要内容区 -->
        <main class="pt-32 pb-12 max-w-7xl mx-auto px-4">
            <!-- 影视列表 -->
            <div class="space-y-4" v-if="result.length > 0">
                <div v-for="movie in result" :key="movie.id"
                    class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-gray-900">{{ movie.name }}</h3>
                            <div class="mt-2 flex items-center">
                                <span class="text-gray-500">{{ movie.year }}</span>
                                <div class="flex ">
                                    <div class=" h-6 w-10 bg-blue-500 text-white text-center rounded"
                                        style="line-height: 24px;">{{ movie.type ?
                                            MOVIES_TYPE[Number(movie.type)] : '短剧'
                                        }}</div>
                                </div>
                            </div>
                            <p class="mt-2 text-gray-600">{{ movie.description }}</p>
                        </div>
                        <button type="primary" class="!rounded-button whitespace-nowrap btn" @click="handleGoTo(movie)">
                            立即观看
                        </button>
                    </div>
                </div>
            </div>
            <div v-else><a-empty /></div>
            <!-- 加载更多 -->
            <div class="flex justify-center mb-2" v-if="pageConfig.total > 0">
                <!-- <MyPagination :size="documentSize >= 1400 ? 'medium' : 'mini'" :current="pageConfig.page"
                    :page-size="pageConfig.size" :total="pageConfig.total" :simple="false" showPageSize
                    :size-options="[30, 50, 100, 150]" @change="handleChangePage" @pageSizeChange="handleChangeSize"
                    class="mt-2" /> -->
                <MyPagination v-model:current="pageConfig.page" v-model:pageSize="pageConfig.size"
                    :total="pageConfig.total" :pageSizeOptions="[15, 30, 50, 100]" @page-change="handleChangePage"
                    @page-size-change="handleChangeSize" />
            </div>
            <!-- 底部 -->
            <footer class="h-16 flex flex-col items-center justify-center text-sm text-center text-gray-600 font-bold">
                <p class="cursor-pointer text-hover" @click.stop="handleToGov">蜀ICP备2022021714号-1</p>
                <p>Copyright © 2022-2024 by orange</p>
            </footer>
        </main>
    </div>
</template>
<script lang="js" setup>
import { ref, reactive } from 'vue';
import { getDuanjuPage, patchNum, saveLookTime } from '../../serve/duanju';
import { MOVIES_TYPE } from '../../utils/emun';
import Tabs from '../../component/tabs/index.vue';
import TabPane from '../../component/tabs/TabPane.vue';
import MyPagination from '../../component/pagination/index.vue';

const pageConfig = reactive({ page: 1, size: 15, total: 0, type: 'all' })
const documentSize = ref(0)
const loading = ref(false)
const result = ref([])
const searchText = ref('');
const navigation = [{ name: '首页', type: 'all' }, { name: '短剧', type: '' }, { name: '电影', type: '3' }, { name: '电视剧', type: '1' }, { name: '动漫', type: '4' }];

// 分页查询
const handleSearchByPage = () => {
    console.log('pageConfig.type', pageConfig.type);
    loading.value = true
    const params = {
        page: pageConfig.page,
        size: pageConfig.size,
        type: pageConfig.type,
        name: searchText.value
    }
    // 分页查询
    getDuanjuPage(params).then(res => {
        console.log(res)
        result.value = res.data
        pageConfig.total = res.total
    }).finally(() => {
        loading.value = false
    })
}

// 分页查询
const handleChangePage = (page) => {
    pageConfig.page = page
    handleSearchByPage()
}

// 页码改变
const handleChangeSize = (size) => {
    pageConfig.size = size
    handleSearchByPage()
}

// 跳转链接
const handleGoTo = (item) => {
    window.open(item.url)
    patchNum({ id: item.id })
}

// 进入页面保存ip，存访问次数
const handleSaveLookTime = () => {
    saveLookTime()
}

// 获取页面大小
const handleGetPageSize = () => {
    documentSize.value = document.body.clientWidth
}
const handleInit = () => {
    handleSearchByPage()
    handleSaveLookTime()
    handleGetPageSize()
}
handleInit()
</script>
