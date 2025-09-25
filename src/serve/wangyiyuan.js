import request from '../utils/request'

// 获取最新网易云的会员信息
export const getWangyiyun = () => request({ url: '/wangyiyun', method: 'GET' })
