Page({
  /**
   * 页面的初始数据
   */
  data: {
    navList: [],
    list: [],
    title: '',
    levelId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  onPageScroll: function (e) {
    if ((e = 40 && e.scrollTop != this.data.showBgWhite)) {
      this.setData({ showBgWhite: e });
    }
  },
  swiperChange: function (e) { },
  gotoSettingRules: function (e) { },
  getData(navList, title, list,levelId) {
    console.log('levelId',levelId);
    this.setData({
      navList,
      title,
      list,
      levelId
    }
    )
  
  },
  seeDetails: function (e) {
    console.log(e.currentTarget.dataset.url, 'e.currentTarget.dataset.url');
    debugger
    wx.navigateTo({
      url: "/pages/webView/index",
      success: (res) => {
        // 跳转成功后，触发事件'delivery', 并可携带数据（即第一个参数是事件名，第二个参数是数据包）
        console.log('this.data.levelId',this.data.levelId);
        res.eventChannel.emit("webViewData", {
          url: e.currentTarget.dataset.url,
          levelId:this.data.levelId,
        });
      },
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },
});
