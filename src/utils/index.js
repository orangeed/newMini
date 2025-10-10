/**
 * 获取静态资源
 */
import { ref } from 'vue'

export function getAssetsFile(url) {
  return new URL(`/src/assets/${url}`, import.meta.url).href
}

/**
 * 将文本生成图片
 * @param {*} text
 * @returns
 */
export function getImageByText(text) {
  const canvas = document.getElementById('imgCanvas')
  const ctx = canvas.getContext('2d')

  // // 设置阴影效果
  // ctx.shadowColor = "rgba(0, 0, 0, 0.1)";  // 阴影颜色
  // ctx.shadowOffsetX = 2; // 阴影水平偏移
  // ctx.shadowOffsetY = 2; // 阴影垂直偏移
  // ctx.shadowBlur = 2; // 阴影模糊度

  // 设置圆角背景
  const cornerRadius = 20 // 圆角半径
  ctx.fillStyle = '#FDFDFD' // 背景颜色
  ctx.beginPath()

  // 从左上角开始绘制
  ctx.moveTo(cornerRadius, 0)
  // 绘制上边
  ctx.lineTo(canvas.width - cornerRadius, 0)
  // 右上角圆弧
  ctx.arcTo(canvas.width, 0, canvas.width, canvas.height, cornerRadius)
  // 绘制右边
  ctx.lineTo(canvas.width, canvas.height - cornerRadius)
  // 右下角圆弧
  ctx.arcTo(canvas.width, canvas.height, 0, canvas.height, cornerRadius)
  // 绘制下边
  ctx.lineTo(0, canvas.height)
  // 左下角圆弧
  ctx.arcTo(0, canvas.height, 0, 0, cornerRadius)
  // 绘制左边
  ctx.lineTo(0, cornerRadius)
  // 左上角圆弧
  ctx.arcTo(0, 0, canvas.width, 0, cornerRadius)

  ctx.closePath()
  ctx.fill() // 填充背景

  // 设置文本样式
  ctx.font = '20px Arial'
  ctx.fillStyle = 'orange' // 文字颜色
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 计算文本的起始位置（使其居中）
  const x = canvas.width / 2
  const y = canvas.height / 2

  // 在canvas上绘制文本
  ctx.fillText(text, x, y) // 绘制文字

  // 转换为图片
  const imgData = canvas.toDataURL('image/png')
  return imgData
}

export function useClipboard() {
  const text = ref('')
  const isSupported = typeof navigator !== 'undefined' && !!navigator.clipboard
  const error = ref(null)

  // 拷贝文本
  async function copy(value) {
    error.value = null
    text.value = value

    try {
      // #ifdef H5
      if (isSupported) {
        await navigator.clipboard.writeText(value)
      }
      else {
        // 兼容旧浏览器
        const textarea = document.createElement('textarea')
        textarea.value = value
        textarea.style.position = 'fixed'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      // #endif

      // #ifndef H5
      await new Promise((resolve, reject) => {
        uni.setClipboardData({
          data: value,
          success: () => resolve(),
          fail: (err) => {
            error.value = '复制失败'
            reject(err)
          },
        })
      })
      // #endif

      return true
    }
    catch (err) {
      error.value = err.message
      return false
    }
  }

  // 粘贴文本
  async function paste() {
    error.value = null

    try {
      // #ifdef H5
      if (isSupported) {
        const result = await navigator.clipboard.readText()
        text.value = result
        return result
      }
      else {
        throw new Error('浏览器不支持 clipboard')
      }
      // #endif

      // #ifndef H5
      const result
        = (await new Promise())
          < string
          > ((resolve, reject) => {
            uni.getClipboardData({
              success: (res) => {
                text.value = res.data
                resolve(res.data)
              },
              fail: (err) => {
                error.value = '粘贴失败'
                reject(err)
              },
            })
          })
      return result
      // #endif
    }
    catch (err) {
      error.value = err.message
      return ''
    }
  }

  return {
    text,
    error,
    copy,
    paste,
  }
}

/**
 * 下载并保存单个文件（图片或视频）
 * @param {string} url - 文件 URL
 * @returns {Promise<void>}
 */
export function downloadAndSaveFile(url) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`下载失败: ${url}`))
        }

        const isVideo = /\.(mp4|mov|m4v)$/i.test(url)
        const saveFunc = isVideo ? wx.saveVideoToPhotosAlbum : wx.saveImageToPhotosAlbum

        saveFunc({
          filePath: res.tempFilePath,
          success: () => resolve(),
          fail: (err) => {
            if (err.errMsg.includes('auth deny')) {
              uni.showModal({
                title: '提示',
                content: '需要授权保存到相册',
                success: () => uni.openSetting(),
              })
            }
            reject(err)
          },
        })
      },
      fail: reject,
    })
  })
}

/**
 * 批量下载并保存文件
 * @param {string|string[]} urls - 文件 URL 或 URL 数组
 * @param {Function} onProgress - 每完成一个文件的回调，参数 {index, total}
 */
export async function downloadAndSaveFiles(urls, onProgress) {
  if (!Array.isArray(urls)) { urls = [urls] }
  const total = urls.length

  for (let i = 0; i < total; i++) {
    try {
      await downloadAndSaveFile(urls[i])
      onProgress && onProgress({ index: i + 1, total, url: urls[i] })
    }
    catch (err) {
      console.error(`第 ${i + 1} 个文件处理失败`, err)
      // 失败也继续下一张
    }
  }

  wx.showToast({ title: '全部保存完成', icon: 'success' })
}
