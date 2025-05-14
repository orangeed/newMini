<!-- 去水印 -->
<template>
    <div id="remove-water-mark">
        <OSpin :loading="loading" tip="解析中...">
            <OCard title="去水印（支持主流平台）" class="card" :bordered="false">
                <div class="space">
                    <OTextarea style="width: 100%;" placeholder="这里是输入你在平台上复制的分享链接哈..." allow-clear
                        :auto-size="{ minRows: 2, maxRows: 6 }" v-model="text" />
                    <OButton type="primary" class="btn" @click="handleOk">确定</OButton>
                </div>
                <div class="tips">
                    <p>1.你需要在想要去水印的图片或者视频中，选择分享，复制分享链接，将复制的内容粘贴在这里，点击确定即可。</p>
                    <p>2.支持各大主流平台，比如小红书、抖音等等</p>
                    <p>3.如果你是电脑浏览器使用，解析的图片直接鼠标在图片的地方右击，下载图片即可，视频操作也是类似的。</p>
                    <p>4.如果你是手机浏览器使用，长按图片也可以选择保存图片到手机！视频可以寄选择右下角有一个下载按钮！</p>
                    <p>5.图片点击可以放大，然后进行缩放以及旋转的操作！</p>
                </div>
                <div v-if="Object.keys(result).length > 0">
                    <div class="title">
                        <div class="dot"></div><span>{{ result.title }}</span>
                    </div>
                    <div class="img" v-if="result.images">
                        <Oimage v-for="(item, index) in result.images" :key="index" :src="item"></Oimage>
                    </div>
                    <div v-if="result.url" class="video">
                        <video controls>
                            <source :src="result.url" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </OCard>
        </OSpin>
    </div>
</template>

<script lang="js" setup>
import { ref } from 'vue';
import { removeWaterMark } from '../../serve/removeWaterMark';
import OSpin from '../../component/spin/index.vue';
import OCard from '../../component/card/index.vue';
import OTextarea from '../../component/textarea/index.vue';
import OButton from '../../component/button/index.vue';
import Oimage from '../../component/image/index.vue';

const text = ref('')

const result = ref({ images: ['https://img.88tph.com/87/c9/h8m8dbbfEeyEcQAWPgWqLw-1.jpg!/watermark/url/L3BhdGgvbG9nby5wbmc/align/center/fw/640/quality/70'] })

const loading = ref(false)
const handleOk = () => {
    loading.value = true
    removeWaterMark({ link: text.value }).then(res => {
        result.value = res
    }).finally(() => {
        loading.value = false
    })
}

</script>

<style lang="scss" scoped>
#remove-water-mark {
    background-color: #f2f3f5;
    height: 100%;
    min-height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;

    .card {
        width: 90%;
        max-width: 1200px;
        margin: 40px 0px;

        .space {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .btn {
                margin-top: 8px;
                width: 40%;
                background-color: orange;
            }
        }

        .tips {
            letter-spacing: 1px;
            margin-top: 20px;
        }

        .title {
            display: flex;
            margin-top: 20px;

            .dot {
                height: 20px;
                width: 10px;
                background-color: orange;
                margin-right: 10px;

            }

            span {
                letter-spacing: 1px
            }
        }

        .img {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 20px;
        }

        .video {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
    }

    :deep(.arco-image) {
        width: 30%;
        margin: 10px;
    }

    :deep(.arco-image img) {
        width: 100%;
    }

    :deep(.arco-spin) {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
