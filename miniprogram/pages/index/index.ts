// page.js
const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    screenHeight: app.globalData.screenHeight,
    list: [
      {
        name: "去水印",
        img: "https://orangecj.cn/assets/removewater-DQ1oSmLn.png",
        url: "https://orangecj.cn/removeWatermark",
      },
      {
        name: "短剧",
        img: "https://orangecj.cn/assets/video-kdNWm3p3.png",
        url: "https://orangecj.cn/duanju",
      },
      {
        name: "短链接",
        img: "https://orangecj.cn/assets/dlj-_TKsz5Y2.png",
        url: "https://orangecj.cn/shortUrl",
      },
      {
        name: "房贷计算器",
        img: "https://orangecj.cn/assets/fangdai-Dle1eQFb.webp",
        url: "https://orangecj.cn/loan",
      },
      {
        name: "常用AI",
        img: "https://orangecj.cn/assets/ai-BfYYdybL.png",
        url: "https://orangecj.cn/aitools",
      },
    ],
  },

  onLoad() {
    // this.handleGetMenu();
  },

  // 获取菜单
  handleGetMenu() {
    wx.request({
      url: "https://orangecj.cn/menu.txt",
      method: "GET",
      success: (res: any) => {
        console.log("原始数据:", res.data);
        if (res.statusCode === 200) {
          try {
            // 先尝试直接使用数据（可能是已经解析好的JSON）
            let data = res.data;
            // 如果是字符串，尝试解析
            if (typeof data === "string") {
              data = JSON.parse(data);
            }
            // 确保最终是数组格式
            this.setData({
              list: Array.isArray(data) ? data : [data],
            });
          } catch (error) {
            console.error("数据处理错误:", error);
            wx.showToast({
              title: "数据格式错误",
              icon: "none",
            });
          }
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
