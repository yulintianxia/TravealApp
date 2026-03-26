import { RequestApi } from "../../services/api.js";
import { BASE_URL } from "../../config/index";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    pointsBalance: 0,
    pointsTotal: 0,
    levelInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时获取数据
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getUserInfo();
    this.getGrade();
  },

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    // try {
    //   let res = await RequestApi.getInfo();
    //   if (res && res.user) {
    //     wx.setStorageSync("user", res.user);
    //     this.setData({
    //       user: res.user,
    //     });
    //   }
    // } catch (error) {
    //   console.error('获取用户信息失败:', error);
    // }
  },

  /**
   * 获取用户等级和积分信息
   */
  async getGrade() {
    // try {
    //   let res = await RequestApi.getGrade();
    //   if (res && res.code == "200") {
    //     this.setData({
    //       pointsTotal: res.data.pointsTotal || 0,
    //       pointsBalance: res.data.pointsBalance || 0,
    //       levelInfo: res.data.levelInfo || {},
    //     });
    //   }
    // } catch (error) {
    //   console.error('获取等级信息失败:', error);
    // }
  },

  /**
   * 跳转到订单列表
   */
  goToOrderList() {
    wx.navigateTo({
      url: "/pages/order/index",
    });
  },

  /**
   * 跳转到指定状态的订单
   */
  goToOrder(state) {
    wx.navigateTo({
      url: `/pages/order/index?state=${state}`,
    });
  },

  /**
   * 跳转到会员中心
   */
  goToVipCenter() {
    wx.navigateTo({
      url: "/pages/vipMemer/index",
    });
  },

  /**
   * 跳转到积分明细
   */
  goToPoints() {
    wx.navigateTo({
      url: "/pages/pointUse/index",
    });
  },

  /**
   * 跳转到积分排行
   */
  goToRank() {
    wx.navigateTo({
      url: "/pages/pointrank/index",
    });
  },

  /**
   * 跳转到我的勋章
   */
  goToMedal() {
    wx.navigateTo({
      url: "/pages/myBadgeView/index",
    });
  },

  /**
   * 跳转到收货地址
   */
  goToAddress() {
    wx.navigateTo({
      url: "/pages/addressList/index",
    });
  },

  /**
   * 跳转到设置页面
   */
  goToSettings() {
    wx.navigateTo({
      url: "/pages/setting/index",
    });
  },

  /**
   * 跳转到意见反馈
   */
  goToFeedback() {
    wx.showToast({
      title: "敬请期待",
      duration: 1000,
    });
  },

  /**
   * 跳转到关于我们
   */
  goToAbout() {
    wx.showToast({
      title: "敬请期待",
      duration: 1000,
    });
  },

  /**
   * 退出登录
   */
  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage();
          wx.navigateTo({
            url: "/pages/login/login",
          });
        }
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 刷新页面数据
    this.getUserInfo();
    this.getGrade();
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});