// pages/order/order.js
import { RequestApi } from "../../../../services/api.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    applicationList: [],
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
  /* 跳转到积分申请页面 */
  turnUrl(url) {
    wx.navigateTo({ url });
  },
  addUrl() {
    this.turnUrl("/subpackages/member/pages/pointsApplication/index");
  },
  getData: async function () {
    let params = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
    };
    let res = await RequestApi.getApplyList(params);
    console.log("res", res);
    if (res && res.rows) {
      this.setData({
        applicationList: res.rows,
        total: res.total,
      });
    } else {
      this.setData({
        applicationList: [],
        total: 0,
      });
    }
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
  turnDone(pointsData, isRead) {
    wx.navigateTo({
      url: "/subpackages/member/pages/pointsApplication/index",
      success: (res) => {
        // 跳转成功后，触发事件'delivery', 并可携带数据（即第一个参数是事件名，第二个参数是数据包）
        res.eventChannel.emit("pointData", {
          pointsData:{
            ...pointsData,
            isRead
          }
        });
      },
    });
  },
  see: function (e) {
    let pointsData = e.currentTarget.dataset.item;
    this.turnDone(pointsData, true);
  },
  edit: function (e) {
    let pointsData = e.currentTarget.dataset.item;
    this.turnDone(pointsData, false);
  },
  reset: async function (e) {
    let keyId = e.currentTarget.dataset.id;
    let that=this;
    wx.showModal({
      title: "提示",
      content: "您确定要撤销这条数据!",
      async success(res) {
        if (res.confirm) {
          let res = await RequestApi.cancelApply(keyId);
          if (res && res.code == 200) {
            that.getData();
          }
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
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
