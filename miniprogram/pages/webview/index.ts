Page({
  data: {
    url: "",
    title: "",
  },

  onLoad(options) {
    if (options.url) {
      const url = decodeURIComponent(options.url);
      wx.setNavigationBarTitle({
        title: "橘子工具箱",
      });
      this.setData({ url });
    }
  },
});
