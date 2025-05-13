<!-- 思维导图 -->
<template>
  <div
    id="markmap-box"
    :style="{ flexDirection: isSmall1920 ? 'row' : 'column' }"
  >
    <!-- markdown编辑器 -->
    <MdEditor
      class="markmap-editor"
      v-model="initValue"
      :preview="false"
      @onChange="handleChangeEditor"
      :style="{
        display: isFullScreen ? 'none' : '',
        width: isSmall1920 ? '50%' : '100%',
      }"
    />
    <div
      ref="markMap"
      class="markmap-view"
      :style="{ width: isFullScreen || !isSmall1920 ? '100%' : '50%' }"
    >
      <!-- 操作栏 -->
      <div
        class="operate"
        :style="{ width: isFullScreen ? '50%' : '100%' }"
        v-if="isSmall1920"
      >
        <a-space style="margin-right: 20px">
          <a-button type="primary" @click="handleFullScreen">
            <template #icon>
              <icon-fullscreen v-if="!isFullScreen" /><icon-fullscreen-exit
                v-else
              /> </template
            >{{ isFullScreen ? "退出全屏" : "全屏" }}
          </a-button>
          <a-button type="primary" @click="handleLoadHistory">
            <template #icon> <icon-to-bottom /> </template>加载最近历史
          </a-button>
          <a-button type="primary" @click="handleSave">
            <template #icon> <icon-save /> </template>暂存
          </a-button>
          <a-button type="primary" @click="handleExportHtml">
            <template #icon> <icon-code /> </template>保存为svg
          </a-button>
          <a-button type="primary" @click="handleExportPng">
            <template #icon> <icon-file-image /> </template>保存为png
          </a-button>
          <a-button type="primary" @click="handleExportPdf">
            <template #icon> <icon-file-pdf /> </template>保存为pdf
          </a-button>
          <a-button type="primary" @click="handleExportMd">
            <template #icon> <icon-branch /> </template>下载md数据源
          </a-button>
        </a-space>
      </div>
      <div
        class="operate"
        :style="{ width: isSmall1920 ? '50%' : '100%' }"
        v-else
      >
        <a-space style="margin-right: 20px">
          <a-button type="primary" @click="handleLoadHistory">
            <template #icon> <icon-to-bottom /> </template>加载最近历史
          </a-button>
          <a-button type="primary" @click="handleSave">
            <template #icon> <icon-save /> </template>暂存
          </a-button>
          <a-dropdown position="bottom">
            <a-button type="primary">保存为</a-button>
            <template #content>
              <a-button type="primary" @click="handleExportHtml">
                <template #icon> <icon-code /> </template>保存为svg
              </a-button>
              <a-button type="primary" @click="handleExportPng">
                <template #icon> <icon-file-image /> </template>保存为png
              </a-button>
              <a-button type="primary" @click="handleExportPdf">
                <template #icon> <icon-file-pdf /> </template>保存为pdf
              </a-button>
              <a-button type="primary" @click="handleExportMd">
                <template #icon> <icon-branch /> </template>下载md数据源
              </a-button>
            </template>
          </a-dropdown>
        </a-space>
      </div>
      <!-- markmap绘制区域 -->
      <svg id="markMap"></svg>
    </div>
  </div>
</template>

<script lang="js" setup>
import { Transformer } from "markmap-lib";
import { Toolbar } from "markmap-toolbar";
import { loadCSS, loadJS, Markmap } from "markmap-view";
import { onMounted, ref } from "vue";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { IconToBottom, IconSave, IconCode, IconFilePdf, IconFileImage, IconFullscreen, IconFullscreenExit, IconBranch } from '@arco-design/web-vue/es/icon';
import { setStorage, getStorage, removeStorage } from "../../utils/storage";
import { StoreKey } from "../../enmu";
import { Notification, Modal } from "@arco-design/web-vue";
import { toPng, toSvg } from 'html-to-image';
import html2pdf from "html2pdf.js";
import { saveAs } from "file-saver";

const initValue = ref('')

const isFullScreen = ref(false)

const markMap = ref()

const mm = ref(null)

const transformer = new Transformer();

const isSmall1920 = ref(false)

// initValue就是我们的markdom数据，此方法就是转换markdom数据，可以打印root查看数据结构
const { root, features } = transformer.transform(initValue.value);

const { styles, scripts } = transformer.getUsedAssets(features);
// 加载数据
const handleLoad = () => {
    if (styles) loadCSS(styles)
    if (scripts) loadJS(scripts, { getMarkmap: () => markmap })
    const svgEl = document.querySelector('#markMap');
    mm.value = Markmap.create(svgEl, undefined, root);
    const toolbar = new Toolbar();
    // 隐藏 toolbar 中 markmap 的logo和url
    toolbar.setBrand(false);
    toolbar.attach(mm.value);
    // 重新设置默认的功能模块，添加导图导航栏
    toolbar.setItems(['zoomIn', 'zoomOut', 'fit', 'fullOpenView']);
    markMap.value.append(toolbar.render());
}

// 当输入的markdown变化时候，需要更新markmap
const handleChangeEditor = () => {
    const { root } = transformer.transform(initValue.value)
    mm.value.setData(root)
    mm.value.fit()
}

// markmap全屏
const handleFullScreen = () => {
    isFullScreen.value = !isFullScreen.value
}

// 加载最近历史
const handleLoadHistory = () => {
    const history = getStorage(StoreKey.markMap)
    if (history) {
        initValue.value = history
        Notification.success('加载成功')
    } else {
        Notification.error('没有保存最近的历史记录')
    }
}

// 暂存
const handleSave = () => {
    setStorage(StoreKey.markMap, initValue.value)
    Notification.success('暂存成功')
}

// 导出为svg
const handleExportHtml = () => {
    const filter = (node) => {
        return (node.tagName !== 'i');
    }
    const node = document.getElementById('markMap');
    toSvg(node, { filter }).then(res => {
        saveAs(res, '思维导图.svg')
    })
}

// 导出为png
const handleExportPng = () => {
    const node = document.getElementById('markMap');
    toPng(node).then(res => {
        saveAs(res, '思维导图.png')
    })
}

// 导出为pdf
const handleExportPdf = () => {
    const opt = {
        margin: [0.5, 0.6],
        filename: "思维导图",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    const node = document.getElementById('markMap');
    html2pdf().set(opt).from(node).save();
}

// 下载md数据源
const handleExportMd = () => {
    const data = new Blob([initValue.value], { type: "text/plain" });
    saveAs(data, '思维导图.md')
}

// 页面初始化的时候先去访问本地有没有缓存，有的话先调用缓存，无的话就调用默认为空
const handleGetCanche = () => {
    const history = getStorage(StoreKey.markMap)
    if (history) {
        Modal.info({
            title: '提示',
            content: '检测到您本地有缓存，是否使用？',
            closable: true,
            cancelText: '取消',
            okText: '使用',
            hideCancel: false,
            onOk: () => {
                initValue.value = history
                Notification.success('加载成功')
            }, onCancel: () => {
                removeStorage(StoreKey.markMap)
            }
        })
    }
}

onMounted(() => {
    handleGetCanche()
    handleLoad()
    isSmall1920.value = document.body.clientWidth > 1600
    window.addEventListener('resize', () => {
        isSmall1920.value = document.body.clientWidth >1600
        console.log('isSmall1920',isSmall1920.value);
        console.log('document.body.clientWidth ',document.body.clientWidth );
    })
})
</script>

<style lang="scss" scoped>
#markmap-box {
  display: flex;

  .markmap-editor {
    width: 50%;
    height: 100vh;
  }

  .markmap-view {
    width: 50%;
    position: relative;

    .operate {
      height: 38px;
      width: 50%;
      background-color: #e9e8e8;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: absolute;
      top: 0;
    }
  }
}

#markMap {
  height: 99vh;
  width: 100%;
}

:deep(.mm-toolbar) {
  display: flex;
  position: absolute;
  bottom: 0;
  right: 50px;
}
</style>
<style>
.arco-dropdown-list {
  display: flex !important;
  flex-direction: column !important;
}

.arco-dropdown-list > .arco-btn {
  margin: 5px;
}
</style>
