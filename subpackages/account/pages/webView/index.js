// pages/webView/index.js
import { H5Url } from "../../../../config/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: "",
  },
  onLoad: function (options) {
    this.setData({
      url: "",
    });
    const eventChannel = this.getOpenerEventChannel();
    // 监听'delivery'事件，并获取数据包
    if (eventChannel) {
      eventChannel.on("webViewData", (data) => {
        if (data?.wechatCode) {
          console.log("公众号链接", data.url);
          this.setData({
            url: `${data.url}`,
          });
        } else {
          if (data?.httpUrl) {
            this.setData({
              url: data.url,
            });
          } else {
            this.setData({
              url: `${H5Url}${data.url}?levelId=${data.levelId}&token=${wx.getStorageSync("token")}`,
            });
          }
        }
      });
    }
  },

  getUrl() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
