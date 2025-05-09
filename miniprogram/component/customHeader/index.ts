// components/custom-navbar/custom-navbar.js
Component({
  properties: {
    title: String,
    showBack: {
      type: Boolean,
      value: false
    }
  },

  data: {
    statusBarHeight: 0,
    navBarHeight: 44
  },

  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync()
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight,
        navBarHeight: systemInfo.platform === 'android' ? 48 : 44
      })
    }
  },

  methods: {
    goBack() {
      wx.navigateBack()
    }
  }
})