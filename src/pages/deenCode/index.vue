<!--
 * @Author: chenjie
 * @Date: 2025-05-13 10:13:38
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-05-13 16:32:01
 * @FilePath: \project3\src\pages\deenCode\index.vue
-->
<template>
    <div id="code" class="flex flex-col w-full h-screen lg:p-20 md:p-2 xs:p-2">
        <img src="https://picsum.photos/1920/1080"
            style="position: absolute; z-index: -1; height: 100%; width: 100%;left: 0;top: 0;" />
        <div style="gap:10px" class="flex">
            <button type="primary" class="btn" @click="handleEncode">
                编码
            </button>
            <button type="primary" class="btn" @click="handleDecode">
                解码
            </button>
            <button type="primary" class="btn" @click="handleCopy">
                复制
            </button>
            <button @click="handleReset" class="btn">
                清空
            </button>
            <p class="p-2 bg-gray-400 text-white font-bold rounded">如果解码出来的是json格式，可以<span
                    class="ml-1 mr-1 text-orange-500 cursor-pointer" @click="handleGotoJson">点击这里</span>进行格式化哦！</p>
        </div>
        <div class="flex h-full mt-4 lg:flex-row md:flex-col xs:flex-col">
            <div class="flex-1 lg:w-1/2 md:w-full xs:w-full">
                <a-textarea placeholder="帅哥！美女！这里是输入的地方哈" class="h-full" v-model="jsonText" />
            </div>
            <div class="flex-1  border bg-gray-100 lg:w-1/2 lg:ml-10 lg:mt-0 md:w-full xs:mt-4 xs:w-full">
                <a-textarea placeholder="这里是编码/解码结果，完事了后，你也可以修改，解码结果是json的话，点上面，直接看json格式化结果！" class="h-full"
                    v-model="resultText" />
            </div>
        </div>
    </div>
    <MessageDom />
</template>

<script lang="js" setup>
import { ref } from 'vue';
import { Message } from '../../utils/message';
import { useClipboard } from '@vueuse/core';
import { setSessStorage } from '../../utils/storage';
import { StoreKey } from '../../enmu';
import MessageDom from '../../component/message/index.vue';

const jsonText = ref('')

const resultText = ref('111')

const { copy } = useClipboard({ source: resultText.value })

// 编码
const handleEncode = () => {
    try {
        resultText.value = encodeURIComponent(jsonText.value)
    } catch (error) {
        throw new Error(error)
    }
}

// 解码
const handleDecode = () => {
    try {
        resultText.value = decodeURIComponent(jsonText.value)
    } catch (error) {
        throw new Error(error)
    }
}

// 清空
const handleReset = () => {
    jsonText.value = ''
    jsonResult.value = ''
}

// 复制
const handleCopy = async () => {
    await copy(JSON.stringify(resultText.value))
    Message.success('已复制到剪贴板！')
}

// 点击这里区格式化
const handleGotoJson = () => {
    if (resultText.value) {
        setSessStorage(StoreKey.CODE, resultText.value)
        window.open(`${window.location.origin}/toJson`)
    } else {
        Message.info('帅哥美女！请先解码哦~')
    }
}

</script>

<style lang="scss" scoped></style>
