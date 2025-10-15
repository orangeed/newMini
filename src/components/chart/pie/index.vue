<script>
export default {
  props: {
    // 饼图尺寸（正方形）
    size: {
      type: Number,
      default: 300,
    },
    // 数据格式：[{ name: '名称', value: 数值, color: '颜色' }]
    data: {
      type: Array,
      default: () => [
        { name: 'A', value: 30, color: '#3e86f5' },
        { name: 'B', value: 20, color: '#10b981' },
        { name: 'C', value: 15, color: '#f59e0b' },
        { name: 'D', value: 35, color: '#ef4444' },
      ],
    },
  },
  data() {
    return {
      ctx: null, // Canvas 上下文
      total: 0, // 数据总和
      sectors: [], // 存储每个扇形的角度信息（用于交互）
      showTooltip: false,
      tooltipX: 0,
      tooltipY: 0,
      currentItem: {},
    }
  },
  mounted() {
    this.initCanvas()
  },
  methods: {
    // 初始化 Canvas
    initCanvas() {
      // 获取 2d 上下文（微信小程序需要通过 createCanvasContext 兼容）
      // #ifdef MP-WEIXIN
      this.ctx = wx.createCanvasContext('pieChart', this)
      // #else
      const query = uni.createSelectorQuery().in(this)
      query.select('#pieChart')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          this.ctx = canvas.getContext('2d')
          // 设置 Canvas 实际尺寸（解决模糊问题）
          canvas.width = res[0].width
          canvas.height = res[0].height
          this.drawPie()
        })
      // #endif

      // 计算数据总和
      this.total = this.data.reduce((sum, item) => sum + item.value, 0)
      // 非微信小程序在获取上下文后绘制，微信小程序直接绘制
      // #ifdef MP-WEIXIN
      this.drawPie()
      // #endif
    },

    // 绘制饼图
    drawPie() {
      const centerX = this.size / 2 // 圆心X
      const centerY = this.size / 2 // 圆心Y
      const radius = (this.size / 2) * 0.8 // 半径（留边距）
      let startAngle = -Math.PI / 2 // 起始角度（从顶部开始）

      this.sectors = [] // 清空扇形信息

      this.data.forEach((item) => {
        // 计算扇形角度（弧度制）
        const percentage = item.value / this.total
        const endAngle = startAngle + percentage * 2 * Math.PI

        // 记录扇形信息（用于交互判断）
        this.sectors.push({
          start: startAngle,
          end: endAngle,
          item,
        })

        // 绘制扇形
        this.ctx.beginPath()
        this.ctx.moveTo(centerX, centerY) // 从圆心出发
        // 绘制圆弧（微信小程序的 arc 参数顺序不同，需兼容）
        // #ifdef MP-WEIXIN
        this.ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        // #else
        this.ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        // #endif
        this.ctx.closePath() // 闭合路径（回到圆心）

        // 填充颜色
        this.ctx.setFillStyle(item.color) // 微信小程序用 setFillStyle
        // #ifndef MP-WEIXIN
        this.ctx.fillStyle = item.color
        // #endif
        this.ctx.fill()

        // 更新起始角度
        startAngle = endAngle
      })

      // 微信小程序需要手动绘制
      // #ifdef MP-WEIXIN
      this.ctx.draw()
      // #endif
    },

    // 处理触摸事件（显示提示框）
    handleTouch(e) {
      const centerX = this.size / 2
      const centerY = this.size / 2
      const radius = (this.size / 2) * 0.8

      // 获取触摸点在 Canvas 中的坐标
      const touch = e.touches[0]
      const rect = e.currentTarget.getBoundingClientRect() // 获取元素位置
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      // 计算触摸点与圆心的距离
      const dx = x - centerX
      const dy = y - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // 判断是否在饼图内
      if (distance <= radius) {
        // 计算触摸点角度（弧度制）
        let angle = Math.atan2(dy, dx) // 范围：-π 到 π
        if (angle < -Math.PI / 2) {
          angle += 2 * Math.PI // 转换为从顶部开始的角度（0 到 2π）
        }

        // 匹配对应的扇形
        for (const sector of this.sectors) {
          if (angle >= sector.start && angle <= sector.end) {
            this.showTooltip = true
            this.currentItem = {
              ...sector.item,
              percent: Math.round((sector.item.value / this.total) * 100),
            }
            // 定位提示框（避免超出容器）
            this.tooltipX = touch.clientX - rect.left + 10
            this.tooltipY = touch.clientY - rect.top + 10
            return
          }
        }
      }

      // 不在饼图内则隐藏提示框
      this.showTooltip = false
    },

    // 结束触摸时隐藏提示框
    hideTooltip() {
      this.showTooltip = false
    },
  },
}
</script>

<template>
  <view class="pie-container" :style="{ width: `${size}px`, height: `${size}px` }">
    <!-- 适配微信小程序的 2d 上下文（H5/App 无需 type） -->
    <canvas
      type="2d" canvas-id="pieChart" :style="{ width: `${size}px`, height: `${size}px` }"
      @touchstart="handleTouch" @touchmove="handleTouch" @touchend="hideTooltip"
    />
    <!-- 提示框（适配触摸事件） -->
    <view v-if="showTooltip" class="tooltip" :style="{ left: `${tooltipX}px`, top: `${tooltipY}px` }">
      <view>{{ currentItem.name }}</view>
      <view>{{ currentItem.value }} ({{ currentItem.percent }}%)</view>
    </view>
  </view>
</template>

<style scoped>
.pie-container {
  position: relative;
  margin: 20px auto;
}

.tooltip {
  position: absolute;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  z-index: 99;
}
</style>
