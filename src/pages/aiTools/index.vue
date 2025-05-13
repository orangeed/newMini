<template>
    <div class="min-h-screen bg-gray-50">
        <a-spin :loading="loading" tip="加载中..." class="w-full h-screen">
            <!-- Desktop Sidebar -->
            <aside class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg hidden lg:block">
                <div class="p-6">
                    <h1 class="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                        <img src="../../static/ai.png" class="rounded-full w-10 mr-2">
                        橘享AI工具集
                    </h1>
                    <nav>
                        <ul class="space-y-2">
                            <li v-for="category in categories" :key="category.id">
                                <button @click="currentCategory = category.id" :class="{
                                    'w-full p-3 rounded-lg flex items-center text-left transition-colors': true,
                                    'bg-orange-50 text-orange-600': currentCategory === category.id,
                                    'hover:bg-orange-100': currentCategory !== category.id
                                }">
                                    <!-- #ifdef H5 -->
                                    <component :is="category.icon" class="mr-3" />
                                    <!-- #endif -->
                                    <span>{{ category.name }}</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            <!-- Mobile Header -->
            <header class="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
                <div class="flex items-center justify-between p-4">
                    <h1 class="text-xl font-bold flex items-center">
                        <img src="../../static/ai.png" class="rounded-full w-10 mr-2">
                        橘享AI工具集
                    </h1>
                    <div class="flex justify-center">
                        <button @click="mobileMenuOpen = !mobileMenuOpen" class="!rounded-button">
                            <icon-menu-fold />
                        </button>
                    </div>
                </div>
                <!-- Mobile Menu Overlay -->
                <div v-if="mobileMenuOpen"
                    class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-600"
                    :class="{ 'bg-opacity-50': mobileMenuOpen }" @click="mobileMenuOpen = false">
                </div>
                <!-- Mobile Menu -->
                <div class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-all duration-600 ease-in-out-smooth"
                    :class="mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-90'">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-8">
                            <h2 class="text-base font-bold flex items-center">
                                <img src="../../static/ai.png" class="rounded-full w-10 mr-2">
                                橘享AI工具集
                            </h2>
                            <button @click="mobileMenuOpen = false" class="!rounded-button">
                                <icon-menu-unfold />
                            </button>
                        </div>
                        <nav>
                            <ul class="space-y-2">
                                <li v-for="category in categories" :key="category.id">
                                    <button @click="selectMobileCategory(category.id)" :class="{
                                        'w-full p-3 rounded-lg flex items-center text-left transition-colors': true,
                                        'bg-blue-50 text-blue-600': currentCategory === category.id,
                                        'hover:bg-gray-100': currentCategory !== category.id
                                    }">
                                        <!-- #ifdef H5 -->
                                        <component :is="category.icon" class="mr-3" />
                                        <!-- #endif -->
                                        <span>{{ category.name }}</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="lg:ml-64 pt-20 lg:pt-0">
                <div class="w-full mx-auto p-6">
                    <!-- Search Bar -->
                    <div class="relative mb-8">
                        <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="搜索 AI 工具..."
                            class="w-full h-10 pl-4 pr-4 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
                    </div>

                    <div v-if="error" class="text-center mb-8 text-red-500">
                        {{ error }}
                    </div>

                    <!-- Tools Grid -->
                    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        <div v-for="tool in (searchQuery ? filteredTools : tools)" :key="tool.id"
                            class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 cursor-pointer"
                            @click="handleClick(tool)">
                            <div class="w-full h-48 mb-4 rounded-lg overflow-hidden bg-black">
                                <img :src="tool.image" :alt="tool.name" class="w-full h-full object-cover object-top">
                            </div>
                            <h3 class="text-lg font-semibold mb-2">{{ tool.name }}</h3>
                            <p class="text-gray-600 mb-4 text-sm">{{ tool.description }}</p>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="tag in tool.tags" :key="tag"
                                    class="px-3 py-1 bg-orange-500 text-white rounded-full text-sm">
                                    {{ tag }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </a-spin>
    </div>
</template>

<script lang="js" setup>
import {
    ref,
    computed,
    watch
} from 'vue';
import {
    IconSearch,
    IconPenFill,
    IconMusic,
    IconImage,
    IconFileVideo,
    IconCode,
    IconBarChart,
    IconMenuUnfold,
    IconMenuFold,
    IconTranslate,
    IconGift
} from '@arco-design/web-vue/es/icon';
import {
    getAITools
} from '../../serve/aiTools';

const mobileMenuOpen = ref(false);
const currentCategory = ref(1);
const searchQuery = ref('');
const loading = ref(false); // 添加加载状态
const error = ref(null); // 添加错误状态
const filteredTools = ref([])

const categories = [{
    id: 1,
    name: '文本生成',
    icon: IconPenFill
},
{
    id: 2,
    name: '图像生成',
    icon: IconImage
},
{
    id: 3,
    name: '音频处理',
    icon: IconMusic
},
{
    id: 4,
    name: '视频制作',
    icon: IconFileVideo
},
{
    id: 5,
    name: '开发辅助',
    icon: IconCode
},
{
    id: 6,
    name: '数据分析',
    icon: IconBarChart
},
{
    id: 7,
    name: 'AI Agent',
    icon: IconTranslate
},
{
    id: 8,
    name: '其他',
    icon: IconGift
}
];

const tools = ref([]);


const handleSearch = () => {
    if (searchQuery.value.trim() === '') {
        filteredTools.value = tools.value;
        return;
    }

    filteredTools.value = tools.value.filter(tool => {
        const matchesCategory = currentCategory.value === 0 || Number(tool.category) === currentCategory
            .value;
        const matchesSearch =
            (tool.name && tool.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
            (tool.description && tool.description.toLowerCase().includes(searchQuery.value
                .toLowerCase())) ||
            (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.value
                .toLowerCase())));

        return matchesCategory && matchesSearch;
    });
}

const selectMobileCategory = (categoryId) => {
    currentCategory.value = categoryId;
    mobileMenuOpen.value = false;
};

// 获取数据
const handleGetData = async () => {
    try {
        loading.value = true;
        error.value = null;

        const res = await getAITools({
            category: currentCategory.value
        });

        if (!res || !Array.isArray(res)) {
            error.value = '数据格式错误';
            return;
        }

        // 处理数据
        const processedData = res.map(item => {
            return {
                ...item,
                tags: typeof item.tags === 'string' ? item.tags.split(',') : item.tags || []
            };
        });

        tools.value = processedData;

        if (tools.value.length === 0) { }
    } catch (err) {
        error.value = err.message || '获取数据失败';
    } finally {
        loading.value = false;
    }
};

const handleClick = (item) => {
    window.open(item.url)
}

watch(() => currentCategory.value, () => {
    handleGetData();
}, {
    immediate: true
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

input[type="text"]:focus {
    outline: none;
}
</style>