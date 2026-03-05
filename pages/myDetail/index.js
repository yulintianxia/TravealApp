Page({
  data: {
    htmlTempalte: "",
    show: false
  },

  // 回到上一页
  turnGo() {
    wx.navigateBack({
      delta: 1
    });
  },

  onLoad(options) {
    // 监听自定义事件（替代 mittBus，小程序推荐使用全局事件/页面通信）
    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.on('templateDataView', (data) => {
        console.log("data.isBuyOrder", data.isBuyOrder);
        this.setData({
          htmlTempalte: data.tempalte
        });
      });
    }
  },

  onUnload() {
    // 移除事件监听（避免内存泄漏）
    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.off('templateDataView');
    }
  }
});