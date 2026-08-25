// pages/order/index.js
import { RequestApi } from "../../services/api.js";
import { BASE_URL } from "../../config/index";
Page({
  data: {
    Paymentlist: [],
    pageSize: 10,
    pageNum: 1,
    goodList: [],
    defaultValue: "all",
    value: "all",
    BASE_URL,
    total: 0,
  },

  onLoad(options) {
    this.setData({
      defaultValue: options.state || "all",
      value: options.state || "all",
    });
    this.getOrderList();
  },

  viewCopyTextClick: function (e) {
    let text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success(res) {
        wx.getClipboardData({ success(res) {} });
      },
    });
  },

  async getOrderList() {
    let params = {
      pageSize: this.data.pageSize,
      pageNum: this.data.pageNum,
      status: this.data.value == "all" ? "" : this.data.value,
    };
    let res = await RequestApi.getOrder(params);
    if (res && res?.rows.length) {
      this.setData({
        goodList:res.row,
        total: res.total,
      });
      
    } else {
      this.setData({
        goodList: [],
        total: 0,
      });
    }
  },

  /* 自定义 Tab 点击 */
  onTabClick(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({ value });
    this.getOrderList();
  },

  async orderChcek(e) {
    let that = this;
    wx.showModal({
      title: "提示",
      content: "您确定要签收该快递？",
      async success(res) {
        if (res.confirm) {
          let orderId = e.currentTarget.dataset.id;
          let params = { orderId };
          let res = await RequestApi.checkOrder(params);
          if (res && res.code == 200) {
            wx.showToast({ title: "成功", icon: "success", duration: 2000 });
            that.getOrderList();
          }
        }
      },
    });
  },

  onReady() {},

  onShow() {
    this.setData({
      scrollHeight:
        wx.getSystemInfoSync().windowHeight -
        (wx.getSystemInfoSync().windowWidth / 750) * 100,
    });
  },

  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},

  onReachBottom(e) {
    if (this.data.total <= this.data.pageSize * this.data.pageNum) {
      return;
    } else {
      this.setData({ pageNum: Number(this.data.pageNum) + 1 });
      this.getOrderList();
    }
  },

  onShareAppMessage() {},
});