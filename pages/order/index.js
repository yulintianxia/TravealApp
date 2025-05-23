// pages/order/index.js
import { RequestApi } from "../../services/api.js";
import { BASE_URL } from "../../config/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    stickyProps: {
      zIndex: 2,
    },
    Paymentlist: [],
    pageSize: 10,
    pageNum: 1,
    goodList: [],
    defaultValue: "all",
    BASE_URL,
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      defaultValue: options.state,
      value: options.state,
    });
    this.getOrderList();
  },
  /* 复制粘贴 */
  viewCopyTextClick: function (e) {
   console.log('e',e);
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

  async getOrderList() {
    let params = {
      pageSize: this.data.pageSize,
      pageNum: this.data.pageNum,
      status: this.data.value == "all" ? "" : this.data.value,
    };

    let res = await RequestApi.getOrder(params);
    if (res && res.rows.length) {
      this.setData({
        goodList: res.rows,
        total: res.total,
      });
    } else {
      this.setData({
        goodList: [],
        total: 0,
      });
    }
  },
  onTabsChange(e) {
    this.setData({
      value: e.detail.value,
    });
    this.getOrderList();
  },
  onTabsClick(event) {
    console.log(`Click tab, tab-panel value is ${event.detail.value}.`);
  },
  /* 确认收货 */
  async orderChcek(e) {
    let that = this;
    wx.showModal({
      title: "提示",
      content: "您确定要签收该快递？",
      async success(res) {
        if (res.confirm) {
          let orderId = e.currentTarget.dataset.id;
          let params = {
            orderId,
          };
          let res = await RequestApi.checkOrder(params);
          console.log("res", res);
          if (res && res.code == 200) {
            wx.showToast({
              title: "成功",
              icon: "success",
              duration: 2000,
            });
            that.getOrderList();
          }
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },
  onStickyScroll(event) {
    // console.log(event.detail);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      scrollHeight:
        wx.getSystemInfoSync().windowHeight -
        (wx.getSystemInfoSync().windowWidth / 750) * 100,
    });
  },

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
  onReachBottom(e) {
    if (this.data.total <= this.data.pageSize * this.data.pageNum) {
      return;
    } else {
      this.setData({
        pageNum: Number(this.data.pageNum) + 1,
      });
      this.getOrderList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
