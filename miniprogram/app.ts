// app.js
App({
  globalData: {
    statusBarHeight: 0,
    navBarHeight: 0,
    systemInfo: null,
    screenWidth: 0, 
    screenHeight: 0, 
  },

  onLaunch() {
    this.initSystemInfo();
  },

  initSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const isIOS = systemInfo.system.toLowerCase().includes("ios");
      const isAndroid = systemInfo.system.toLowerCase().includes("android");

      this.globalData = {
        systemInfo: this.globalData.systemInfo,
        statusBarHeight: systemInfo.statusBarHeight,
        navBarHeight: isIOS ? 44 : isAndroid ? 48 : 44,
        screenWidth: systemInfo.screenWidth,
        screenHeight: systemInfo.screenHeight,
      };
    } catch (e) {
      console.error("获取系统信息失败", e);
    }
  },
});
