<!--  -->
<script lang="js" setup name=''>
import { useNavBarContext } from '../../utils/useNavBarHeight.ts'

const { navBarHeight } = useNavBarContext()
</script>

<template>
  <div id="wangpan">
    <!-- #ifndef H5 -->
    <CostomNavBar title="网盘会员" showBack background="#02489D" />
    <!-- #endif -->
    <div class="wangpan bg-white" :style="{ paddingTop: `${navBarHeight}px`, height: 'fit-content' }">
      你先下载这个图片的app哈，就是这个。
      <image
        src="https://cdn.nlark.com/yuque/0/2025/webp/21684071/1758767135093-20658de7-2030-4a2d-89de-570f14ec493b.webp"
        alt="" mode="widthFix"
      />
      建议你扫码下载。
      <image
        src="https://cdn.nlark.com/yuque/0/2025/webp/21684071/1758767155951-743fcbc2-f800-4e2a-901a-b46afa092705.webp"
        alt="" mode="widthFix"
      />
      或者你点击这个链接下载，https://dt.bd.cn/#/pages/login/register?invite_code=464676

      很好，下载完了后，你就正常注册即可，注册完了登录，看首页，有一个网盘拉新！
      <image
        src="https://cdn.nlark.com/yuque/0/2025/webp/21684071/1758767170681-1582dfbb-4dbd-4aa0-99a3-54a227963a62.webp"
        alt="" mode="widthFix"
      />
      然后你点进去，可以看到好些个网盘，也就是都可以有会员以及容量！
      <image
        src="https://cdn.nlark.com/yuque/0/2025/webp/21684071/1758767179952-fba00563-b593-4d74-bade-d55d7c081e31.webp"
        alt="" mode="widthFix"
      />
      随便选择一个，比如选择迅雷！
      <image
        src="https://cdn.nlark.com/yuque/0/2025/webp/21684071/1758767199612-86703785-b152-4fc7-8ed2-10b7a7a795cc.webp"
        alt="" mode="widthFix"
      />
      然后进去后按照要求一个个填写，最后提交等待审批过就行了！
      <image
        src="https://cdn.nlark.com/yuque/0/2025/webp/21684071/1758767209206-b021572e-d77d-44ea-8344-3d0c2fc61f60.webp"
        alt="" mode="widthFix"
      />
      审批过了，就会收到短信了！
      <image
        src="https://cdn.nlark.com/yuque/0/2025/webp/21684071/1758767224458-2970713e-e308-4824-891e-7d4ee55ebb14.webp"
        alt="" mode="widthFix"
      />
      到这里，你就成功开通了会员以及扩容，每个月会给你续费，但是你最好不停的存东西，比如今天一个电影，明天一个电视剧啥的，然后有事没事分享给别人，这样你也有收益，虽然确实也不多！

      <span class="font-bold text-orange-500">
        但是这个会员哈，我仔细看了规则，只要规定的转存数量才行，所以你可能需要满足这个指标，其实也很简答，两个号刷一刷就行了！
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wangpan {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 10px 40px 10px;
  padding-bottom: 40px;
  line-height: 2.5;

  image {
    width: 100%;
    height: 400px;
  }
}
</style>
