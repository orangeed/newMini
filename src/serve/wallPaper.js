import request from '../utils/request'

// 创建一个壁纸
export const createWallPaper = data => request({ url: '/wallpaper', method: 'POST', data })

// 获取壁纸列表
export const getWallPaperList = params => request({ url: '/wallpaper', method: 'GET', params })

// 获取一个壁纸详情
export const getWallPaperDetail = id => request({ url: `/wallpaper/${id}`, method: 'GET' })
