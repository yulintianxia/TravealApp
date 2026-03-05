// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  
  globalData: {
    userInfo: null,

  },
   eventBus: {
    on(event, fn) {
      this[event] = this[event] || [];
      this[event].push(fn);
    },
    off(event, fn) {
      if (!this[event]) return;
      this[event] = this[event].filter(f => f !== fn);
    },
    emit(event, data) {
      if (!this[event]) return;
      this[event].forEach(fn => fn(data));
    }
  },
})
