/*
 * @Author: chenjie
 * @Date: 2025-01-16 09:17:18
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-05-15 09:43:42
 * @FilePath: \project3\src\utils\request.js
 * @Description:
 */
const baseURL = 'https://api.orangecj.cn'
const timeout = 300000

/**
 * 拦截请求，可注入 token
 */
function requestInterceptor(config) {
  // 示例：添加 Authorization 头部
  // config.header = {
  //   ...config.header,
  //   Authorization: `Bearer ${handleGetToken()}`
  // };
  return config
}

/**
 * 响应拦截器，统一处理成功和错误
 */
function responseInterceptor(response) {
  const res = response.data

  if (res.code === 200) {
    return res.data
  }
  else {
    return Promise.reject(res.message || '请求失败')
  }
}

/**
 * 通用请求方法
 */
function request(options) {
  const config = {
    url: baseURL + options.url,
    method: options.method || 'GET',
    data: options.data ? options.data : options.params || {},
    header: {
      'Content-Type': 'application/json',
      ...(options.header || {}),
    },
    timeout,
  }

  const finalConfig = requestInterceptor(config)

  return new Promise((resolve, reject) => {
    uni.request({
      ...finalConfig,
      success: (res) => {
        try {
          const data = responseInterceptor(res)
          resolve(data)
        }
        catch (err) {
          reject(err)
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

export default request
