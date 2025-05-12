// page.js
const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    screenHeight: app.globalData.screenHeight,
    list: [],
  },

  onLoad() {
    this.handleGetMenu();
  },

  // 获取菜单
  handleGetMenu() {
    wx.request({
      url: "https://api.orangecj.cn/login/menu",
      // url: "http://127.0.0.1:3000/login/menu",
      method: "GET",
      success: (res: any) => {
        if (res.data.code === 200) {
          this.setData({
            list: res.data.data
          });
        }
      },
    });
  },

  navigateToUrl(e: any) {
    const url = e.currentTarget.dataset.url;
    const title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: `/pages/webview/index?url=${encodeURIComponent(url)}&title=${title}`,
    });
  },
});
