<!--
 * @Author: chenjie
 * @Date: 2025-10-10 14:22:57
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-10-17 11:42:25
 * @FilePath: \newMini\src\pages\colorPersonalityTest\components\result.vue
 * @Description: 测试结果
-->
<script lang="js" setup name=''>
const props = defineProps({
  result: {
    type: Object,
    required: true,
  },
})

const chartsData = ref({
  series: [
    {
      data: [{ name: '红色', value: props.result.raw.R, labelText: `红色：${props.result.raw.R}分` }, { name: '蓝色', value: props.result.raw.B, labelText: `蓝色：${props.result.raw.B}分` }, { name: '黄色', value: props.result.raw.Y, labelText: `黄色：${props.result.raw.Y}分` }, { name: '绿色', value: props.result.raw.G, labelText: `绿色：${props.result.raw.G}分` }],
    },
  ],
})
const opts = {
  color: ['#EE6666', '#1890FF', '#FAC858', '#91CB74'],
  padding: [5, 5, 5, 5],
  enableScroll: false,
  extra: {
    pie: {
      activeOpacity: 0.5,
      activeRadius: 10,
      offsetAngle: 0,
      labelWidth: 15,
      border: true,
      borderWidth: 3,
      borderColor: '#FFFFFF',
    },
  },
}

const colorTextObj = {
  R: '红色',
  B: '蓝色',
  Y: '黄色',
  G: '绿色',
}

const colorText = ref('')

function handleGetTextColor() {
  return props.result.primary === 'R' ? 'text-red-600' : props.result.primary === 'B' ? 'text-blue-600' : props.result.primary === 'Y' ? 'text-yellow-600' : 'text-green-600'
}

onMounted(() => {
  colorText.value = colorTextObj[props.result.primary]
})
</script>

<template>
  <div class="result-page px-5 pb-5 ">
    <div class="rounded bg-white p-6 shadow-md" style="width: 90vw;">
      <qiun-data-charts type="pie" :opts="opts" :chartData="chartsData" />
      <div>
        <p class="mb-4 text-xs text-red-600">
          注：该测试为性格倾向参考，非诊断性工具。更多的测试详情，可以截图问问AI工具，比如豆包、kimi、deepseek等。
        </p>
        <p class="mb-4">
          您的主要性格为：<span class="font-bold" :class="[handleGetTextColor()]">{{ colorText }}</span>
        </p>
        <div class="mb-4" style="font-size: 14px;">
          <p class="text-red-600">
            🔴 红色性格（Red）
          </p>
          红色性格的人通常非常目标导向、果断、充满行动力。他们喜欢掌控局面、接受挑战，不怕冒险，也能冷静地面对压力。做决定快，做事直接，不喜欢拖泥带水或犹豫不决。在团队里，他们往往成为天然的“推动者”（Driver），带动节奏、推动任务落地。不过，红色的盲点是：有时过于急促，忽略过程中的细节；可能给他人带来压力；在情感表达或协调他人需求上不够敏感。适合在变革、开创性任务、高强度目标导向的角色中表现突出。
        </div>
        <div class="mb-4 " style="font-size: 14px;">
          <p class="text-yellow-600">
            🟡 黄色性格（Yellow）
          </p>
          黄色性格的人通常外向、热情、善于社交，喜欢自由、创新与变化。他们思路活跃、爱表达、善于激励别人，也常常能在团队里带来乐观与创意。交流能力强，能够在群体中制造氛围，让他人感到自在。不过黄色也有容易分散注意力、不太喜欢被约束、可能执行力稍弱、在细节与持续性上不够稳定的问题。他们最适合在需要创意、沟通、推动大家情绪或想法、促销／公关／品牌等角色中发挥。
        </div>
        <div class="mb-4" style="font-size: 14px;">
          <p class="text-green-600">
            🟢 绿色性格（Green）
          </p>
          绿色性格的人温和、稳定、重视关系与和谐。他们善于倾听、关怀他人，是团队里的“润滑剂”与“支持者”。在冲突中常常扮演调解者的角色。绿色人喜欢稳步推进，不喜欢突变或太快的变动，也比较怕冲突或激烈对抗。他们有时候显得被动、不好拒绝别人、决策速度慢。在需要维护团队关系、处理客户服务、人力支持或那些需要耐心与细节照顾人的角色中，他们是非常宝贵的存在。
        </div>
        <div class="mb-4" style="font-size: 14px;">
          <p class="text-blue-600">
            🔵 蓝色性格（Blue）
          </p>
          蓝色性格的人讲求理性、精确与结构性。他们喜爱细节、有条理、喜欢深度思考和分析。喜欢在做决定前收集资料、比较选项，不轻易冲动。他们对质量、标准、规则非常在意，有责任感，也喜欢保持一定的独立空间。但蓝色也可能过于挑剔或苛求自己／他人，难以快速应对变化，对人际表达可能比较保守，有时被认为冷淡或不够灵活。他们最适合那些要求专业性、精准性、制度化或研究型的任务，比如策划、分析、技术、财务等。
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result-page {
  .result-charts {
    width: calc((750rpx - 40rpx - 48rpx) * 0.9);
    height: 500rpx;
  }
}
</style>
