import request from '../utils/request'

// 创建一个软件
export function createSoft(data) {
  return request({ url: '/soft', method: 'POST', data })
}

// 获取软件列表

export function getSoftList(params) {
  return request({ url: '/soft', method: 'GET', params })
}
