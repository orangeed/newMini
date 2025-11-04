// composables/useShare.js
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';

export default function useShare(customConfig = {}) {
  // 全局开启转发入口（默认支持“发送给朋友”和“分享到朋友圈”）
  onLoad(() => {
    uni.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline'], // 微信小程序支持的菜单
      withShareTicket: true
    });
  });

  // 自定义“发送给朋友”的分享内容
  onShareAppMessage(() => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const defaultConfig = {
      title: '默认分享标题',
      path: `/${currentPage.route}`, // 当前页面路径
      imageUrl: '/static/share-icon.png' // 可选：分享图片
    };
    // 合并默认配置和页面自定义配置
    return { ...defaultConfig, ...customConfig.shareAppMessage };
  });

  // 自定义“分享到朋友圈”的内容（微信小程序支持）
  onShareTimeline(() => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const defaultConfig = {
      title: '默认朋友圈标题',
      path: `/${currentPage.route}`,
      imageUrl: '/static/share-icon.png'
    };
    return { ...defaultConfig, ...customConfig.shareTimeline };
  });
}