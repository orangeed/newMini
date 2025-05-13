<template>
  <div class="wx-editor" :class="currentTheme">
    <img src="https://picsum.photos/1920/1080"
      style="position: absolute; z-index: -1; height: 100%; width: 100%;left: 0;top:0" />
    <!-- #ifdef H5 -->
    <mavon-editor v-model="markdownText" @change="onEditorChange" class="editor" :toolbars="toolbars" />
    <div v-if="isShowMyStyle" class="theme-editor">
      <a-textarea v-model="cssTextString" @change="updateCssText" placeholder="请输入JSON格式的主题样式"
        class="theme-editor-bottom" />
    </div>
    <div class="tools">
      <a-button class="tools-button" type="primary" @click="copyHtmlToClipboard">复制</a-button>
      <a-button class="tools-button" type="primary" @click="handleAddOld">往期推荐</a-button>
      <a-button class="tools-button" type="primary" @click="handleEditorMyStyle">自定义主题</a-button>
      <a-button class="tools-button" type="primary" @click="handleSaveCurrentTheme">保存当前主题</a-button>
      <a-dropdown @select="handleSelect">
        <a-button type="primary">切换主题</a-button>
        <template #content>
          <a-doption v-for="(item, index) in defaultThemeList" :key="index" :value="item.value" style="width: 100%">{{
            item.label
          }}</a-doption>
        </template>
      </a-dropdown>
    </div>
    <a-modal v-model:visible="visible" title="主题名称" @cancel="visible = false" @ok="handleSaveThemeName">
      <a-input placeholder="给你的主题取个名称吧！" allow-clear v-model="currentNewName" />
    </a-modal>
    <a-modal v-model:visible="visibleOld" title="往期推荐" width="80%" @cancel="visibleOld = false" @ok="handleCloseOld">
      <div class="flex">
        <div class="flex-1">
          <a-textarea default-value="输入文章的连接，使用英文的逗号作为分割。比如," :auto-size="{
            minRows: 6,
            maxRows: 20,
          }" v-model="oldText" />
          <a-space>
            <a-button class="tools-button" type="primary" @click="handleGetOldLink">获取往期推荐</a-button>
          </a-space>
          <p>这里获取往期推荐很慢，因为我的服务器很小，慢到服务器超时，正常大概3秒就返回结果了，所以后面这个会制作一个客户端，然后在电脑端使用。不过这样的话，就只能在电脑端使用，背离了我的初衷，就是手机端和平板也能使用！
          </p>
        </div>
        <div class="flex-1 ml-4">
          <div class="flex flex-wrap gap-2">
            <span v-for="(item, index) in oldArticleStyle" :key="index" @click="handleSelectOldArticleStyle(item.value)"
              :class="['w-14 bg-gray-300 rounded text-center text-gray-600 font-bold cursor-pointer', currentOldTheme === item.value ? '!bg-orange-400 text-white' : '']">{{
                item.name }}
            </span>
            <div :class="[currentOldTheme, 'cursor-pointer w-full']">
              <div v-for="(item, index) in oldArticleList" :key="index" @click="handleGoToArticle(item.url)"
                class="box">
                <div class="img">
                  <img :src="item.cover">
                </div>
                <div class="text">
                  <p class="title">
                    {{ item.title }}
                  </p>
                  <p class="time"> {{ item.publishTime }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <!-- #endif -->
  </div>
</template>
<script setup lang="js">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { themeStyles, themeList } from './themeStyles'
import { applyStyles, createStyleSheet, removeStyleSheet } from './styleApplier'
import { toolbars, oldArticleStyle } from './config'
import { MITT_CODE } from '../../utils/emun'
import { getWeiXinLink } from '../../serve/wxEditor'

// 初始化 Markdown 编辑器内容
const markdownText = ref('')

const isMyStyle = ref(false)

// 当前主题
const currentTheme = ref('default')

// 是否显示自定义主题
const isShowMyStyle = ref(false)

// 主题文本
const cssText = ref('')

const cssTextString = ref('')

const visible = ref(false)

// 保存的主题名称
const currentNewName = ref('')

const defaultThemeList = ref([])

const defaultThemeStyles = ref({})

const visibleOld = ref(false)

const oldText = ref('')

// 当前的往期推荐主题
const currentOldTheme = ref(oldArticleStyle[0].value)

const oldArticleList = ref([
  {
    "url": "https://mp.weixin.qq.com/s/Du63Hbcimo-KMkTh4GyDDw",
    "title": "工具小程序又恢复了更新啦！同时开始写一个全新的微信公众号编辑器，欢迎大家给建议啊！",
    "publishTime": "2025年05月11日 22:35",
    "cover": "https://mmbiz.qpic.cn/mmbiz_jpg/O8mvE6ujic0n7HYibxXqc9erPeKvKIeRrVkRMoeibRQHH30TCKHlONb9xY67oWrXHfCVFS5iaSs2FZAW0UXKBicAmHg/0?wx_fmt=jpeg"
  }
])

const copyHtmlToClipboard = () => {
  // 先应用主题样式
  applyThemeToPreview()

  // 获取应用样式后的 HTML
  const vShowContent = document.getElementsByClassName('v-show-content')[0]
  if (!vShowContent) {
    Message.error('找不到预览区域')
    return
  }

  const html = vShowContent.innerHTML
  console.log('v-show-content', html)

  // 尝试使用现代 Clipboard API
  if (navigator.clipboard && navigator.clipboard.write) {
    const blob = new Blob([html], { type: 'text/html' })
    const clipboardItem = new ClipboardItem({ 'text/html': blob })

    navigator.clipboard.write([clipboardItem])
      .then(() => {
        Message.success('富文本已成功复制！可以粘贴到公众号后台了')
      })
      .catch(err => {
        Message.error('复制失败', err)
      })
  } else {
    Message.error('复制失败')
  }
}

// 添加防抖函数
function debounce(fn, delay) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

// 添加一个函数，用于将主题样式应用到 v-show-content 元素的子元素
function applyThemeToPreview(showMessage = true, theme) {
  const vShowContent = document.getElementsByClassName('v-show-content')[0]
  if (!vShowContent) {
    if (showMessage) Message.error('找不到预览区域')
    return
  }

  // 移除所有主题类
  vShowContent.classList.remove('default-theme', 'dark-theme', 'elegant-theme')

  // 添加当前主题类
  vShowContent.classList.add(`${currentTheme.value}-theme`)

  // 应用当前主题的样式
  applyStyles(vShowContent, theme ? theme : defaultThemeStyles.value[currentTheme.value])

  // 处理图片错误
  const imgElements = vShowContent.querySelectorAll('img')
  imgElements.forEach(el => {
    el.setAttribute('onerror', "this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'24\\' height=\\'24\\' viewBox=\\'0 0 24 24\\'%3E%3Cpath fill=\\'%23ccc\\' d=\\'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z\\' /%3E%3C/svg%3E';")
  })
}

// 添加编辑器内容变化的处理函数
const debouncedApplyTheme = debounce(() => {
  applyThemeToPreview(false, cssText.value) // 不显示消息，避免频繁提示
}, 500) // 500毫秒的防抖时间

function onEditorChange() {
  // 使用防抖函数应用样式，减少性能影响
  debouncedApplyTheme()
}

// 选择主题
const handleSelect = (value) => {
  currentTheme.value = value
  // 应用新主题
  applyThemeToPreview()
  cssText.value = defaultThemeStyles.value[currentTheme.value]
  console.log('cssText', cssText.value)
  const themeName = defaultThemeList.value.find(item => item.value === currentTheme.value).label
  Message.success(`已切换到${themeName}主题`)
}

// 自定义主题
const handleEditorMyStyle = () => {
  isShowMyStyle.value = !isShowMyStyle.value
  cssText.value = defaultThemeStyles.value[currentTheme.value]
  console.log('cssText', cssText.value)
}

const updateCssText = () => {
  try {
    cssText.value = JSON.parse(cssTextString.value)
    console.log('cssText', cssText.value)
    applyThemeToPreview(true, cssText.value)
    Message.success('样式更新成功')
  } catch (e) {
    Message.error('JSON格式错误，请检查输入')
  }
}

// 保存当前主题
const handleSaveCurrentTheme = () => {
  visible.value = !visible.value
}

// 保存主题名称
const handleSaveThemeName = () => {
  // 保存主题列表
  const timeStr = new Date().getTime().toString()
  const data = [...defaultThemeList.value, { label: currentNewName.value, value: timeStr }]
  localStorage.setItem(MITT_CODE.THEME_LIST, JSON.stringify(data))
  // 保存主题内容
  const themeContent = { ...defaultThemeStyles.value }
  themeContent[timeStr] = cssText.value
  localStorage.setItem(MITT_CODE.THEME_CONTENT, JSON.stringify(themeContent))
  handleGetCache()
}

watch(cssText, (newVal) => {
  cssTextString.value = JSON.stringify(newVal, null, 2)
}, { immediate: true })

// 获取缓存
const handleGetCache = () => {
  try {
    // 使用解构赋值简化代码
    const [themeData, themeStyle] = [
      localStorage.getItem(MITT_CODE.THEME_LIST),
      localStorage.getItem(MITT_CODE.THEME_CONTENT)
    ]

    // 使用空值合并运算符设置默认值
    defaultThemeList.value = themeData ? JSON.parse(themeData) : themeList
    defaultThemeStyles.value = themeStyle ? JSON.parse(themeStyle) : themeStyles
  } catch (error) {
    // 添加错误处理，当JSON解析失败时使用默认值
    console.error('缓存数据解析失败:', error)
    defaultThemeList.value = themeList
    defaultThemeStyles.value = themeStyles
  }
}

// 添加往期推荐
const handleAddOld = () => {
  visibleOld.value = !visibleOld.value
}

// 关闭往期推荐
const handleCloseOld = () => {
  visibleOld.value = !visibleOld.value
}

// 获取往期推荐的连接
const handleGetOldLink = async () => {
  const linkArr = oldText.value.split(',')
    .map(url => url.trim())  // 去除每个URL两端的空格
    .filter(url => url);     // 过滤掉空字符串
  const res = await getWeiXinLink({ urls: linkArr })
  oldArticleList.value = res
}

// 选择往期推荐的主题
const handleSelectOldArticleStyle = (value) => {
  currentOldTheme.value = value
  console.log('currentOldTheme', currentOldTheme.value);
}

// 跳转到往期推荐的文章
const handleGoToArticle = (url) => {
  console.log('url');
  window.open(url)
}

// 在组件挂载后创建样式表并应用主题
onMounted(() => {
  handleGetCache()

  // 为每个主题创建样式表
  Object.keys(defaultThemeStyles.value).forEach(themeName => {
    createStyleSheet(themeName, defaultThemeStyles.value[themeName])
  })

  // 页面加载后延迟一点时间，确保 mavon-editor 已经渲染
  setTimeout(() => {
    applyThemeToPreview()
  }, 300)
})

// 在组件卸载前移除样式表
onBeforeUnmount(() => {
  // 移除所有主题样式表
  Object.keys(defaultThemeStyles.value).forEach(themeName => {
    removeStyleSheet(themeName)
  })
})
</script>

<style lang="scss">
@import url(./index.scss);
</style>
