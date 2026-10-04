Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
  },

  onLoad() {
    this.setData(this.getNavMetrics());
  },

  goMarket() {
    wx.navigateTo({
      url: "/pages/market/index",
    });
  },

  getNavMetrics() {
    const menuRect = wx.getMenuButtonBoundingClientRect();
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const statusBarHeight = windowInfo.statusBarHeight || 20;
    const navBarHeight = menuRect
      ? (menuRect.top - statusBarHeight) * 2 + menuRect.height
      : 44;

    return {
      statusBarHeight,
      navBarHeight,
    };
  },

  onShareAppMessage() {
    return {
      title: "积分商城",
      path: "/pages/index/index",
    };
  },

  onShareTimeline() {
    return {
      title: "积分商城",
    };
  },
});