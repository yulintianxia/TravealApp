// pages/order/order.js
import { RequestApi } from "../../services/api.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getData();
  },
  getData: async function () {
    let params = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
    };
    let res = await RequestApi.getPointsUse(params);
    if (res && res.rows) {
      this.setData({
        orderList: res.rows,
        total: res.total,
      });
    } else {
      this.setData({
        orderList: [],
        total: 0,
      });
    }
  },
  /* 复制粘贴 */
  viewCopyTextClick: function (e) {
    console.log("e", e);
    let text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success(res) {
        wx.getClipboardData({
          success(res) {
            // console.log(res.data); // 输出复制的内容
          },
        });
      },
    });
  },
  bindscrolltolower(data) {
    if (this.data.pageNum * this.data.pageSize >= this.data.total) {
      return;
    } else {
      this.setData({
        pageNum: Number(this.data.pageNum) + 1,
      });
      this.getData();
    }
  },
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
