import { imagesModule } from "../../common/imageUrlConfs.js";
import { userConfig } from "../../common/entryConfs.js";
import { RequestApi } from "../../services/api.js";
import { BASE_URL } from "../../config/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    BASE_URL,
    loginHeadIconStyle: "head-icon",
    isLogin: true,
    isShowUserVerify: !0,
    img_setting_black:'https://zhenglian.vip:8420/photo/setting.png',
    headIconTop: 0,
    headContentTop: "",
    headHeight: "",
    isShowActivityCenter: true,
    activityCenterTitleData: "每日派对",
    toolsData: userConfig.tools,
    orderList: [
      {
        iconUrl: "../../images/home/meber.png",
        title: "全部",
        state: "all",
      },
      {
        iconUrl: "../../images/home/meber.png",
        title: "待发货",
        state: "1",
      },
      {
        iconUrl: "../../images/home/meber.png",
        title: "待收货",
        state: "2",
      },
      {
        iconUrl: "../../images/home/meber.png",
        title: "已收货",
        state: "3",
        // description: "这是测试",
      },
    ],
    topList: [
      {
        iconUrl: "../../images/home/1.png",
        title: "排行榜",
        url: "/pages/pointrank/index",
      },
      {
        iconUrl: "../../images/home/points.png",
        title: "积分明细",
        url: "/pages/pointUse/index",
      },
      {
        iconUrl: "../../images/home/apply.png",
        title: "积分申请",
        url: "/pages/pointsApplicationList/index",
      },
      {
        iconUrl: "../../images/home/vergrade.png",
        title: "我的勋章",
        url: "/myBadge",
      },
     
    ],
    medalCount: 0,
    activityCenterMoreData: {
      id: 1,
      title: "更多",
    },
    activityCenterData: [
      {
        iconUrl: "../../images/home/meber.png",
        title: "会员福利",
        // description: "这是测试",
      },
      {
        iconUrl: "../../images/home/youhui.png",
        title: "老优惠",
        // description: "这是测试",
      },
      {
        iconUrl: "../../images/home/texiang.png",
        title: "今日特享",
        // description: "这是测试",
      },
      {
        iconUrl: "../../images/home/xinpin.png",
        title: "新品上市",
        // description: "这是测试",
      },
    ],
    userName: "",
    toVerifyData: userConfig.toVerify,
    vipLevelData: userConfig.vipLevel,
    favoriteData: userConfig.favorite,
    pointData: userConfig.point,
    pointsTotal: "",
    pointsBalance: "",
    user: {},
    defaultPerson: "../../images/home/default.png",
    levelInfo: {},
    levelId: "",
    configbackgroundImg: "../../images/home/v1-bg-new.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setHeaderIconTop();
  },
  handleJumpUrl(e) {
    let url = e.currentTarget.dataset.url;
    console.log('url',url);
    if(url =='/myBadge') {
       this.turnMyBadge();
    } else {
      wx.navigateTo({
        url,
      });
    }
    
  },

  async getGrade() {
    let res = await RequestApi.getGrade();
    if (res && res.code == "200") {
      console.log("res", res.data.levelInfo);
      this.setData({
        pointsTotal: res.data.pointsTotal,
        pointsBalance: res.data.pointsBalance,
        levelInfo: res.data.levelInfo,
        levelId: res.data.levelId ? res.data.levelId : 0,
        medalCount: res.data.medalCount,
      });
    }
  },
  turnWebView: function (url) {
    wx.navigateTo({
      url: "/pages/webView/index",
      success: (res) => {
        // 跳转成功后，触发事件'delivery', 并可携带数据（即第一个参数是事件名，第二个参数是数据包）
        res.eventChannel.emit("webViewData", {
          url,
          levelId: this.data.levelId,
        });
      },
    });
  },
  turnMyBadge: function () {
    if (this.data.medalCount) {
      this.turnWebView("/myBadge");
    } else {
      wx.showToast({
        title: "暂无勋章",
        duration: 1000,
      });
    }
  },
  handleTool:function() {
    wx.showToast({
        title: "敬请期待新功能",
        duration: 1000,
      });
  },
  turnTop() {
    wx.navigateTo({
      url: "/pages/pointrank/index",
    });
  },
  turnLevel() {
    wx.navigateTo({
      url: "/pages/vipMemer/index",
    });
  },
  turnPoint() {
    wx.navigateTo({
      url: "/pages/pointUse/index",
    });
  },
  turnGrade() {
    this.goWebView("/badge");
  },
  turnGift() {
    this.goWebView("/gift");
  },
  goHome(vipData) {
    wx.navigateTo({
      url: "/pages/vip/index",
      success: (res) => {
        // 跳转成功后，触发事件'delivery', 并可携带数据（即第一个参数是事件名，第二个参数是数据包）
        res.eventChannel.emit("vipData", {
          vipData,
        });
      },
    });
  },

  handleEntryJump(e) {
    let data = e.currentTarget.dataset;
    console.log("item", data.item.state);
    wx.navigateTo({
      url: `/pages/order/index?state=${data.item.state}`,
    });
  },
  turnVip(e) {
    let config = {};

    let datasetData = e.currentTarget.dataset;
    config = {
      imgurl: datasetData.imgurl,
      mypoint: datasetData.mypoint,
      remark: datasetData.remark,
      levelId: this.data.levelId,
      levelname: datasetData.levelname,
      username: datasetData.username,
    };
    this.goHome(config);
  },
  goWebView(url) {
    wx.navigateTo({
      url: "/pages/webView/index",
      success: (res) => {
        // 跳转成功后，触发事件'delivery', 并可携带数据（即第一个参数是事件名，第二个参数是数据包）
        res.eventChannel.emit("webViewData", {
          url,
          levelId: this.data.levelId,
        });
      },
    });
  },

  /* 获取用户信息 */
  async getUserInfo() {
    let res = await RequestApi.getInfo();
    if (res && res.user) {
      wx.setStorageSync("user", res.user);
      this.setData({
        user: res.user,
      });
    }
  },
  loginHandler: function () {
    this.setData({
      isLogin: true,
    });
  },
  logoutHandler() {
    wx.clearStorage();
    wx.navigateTo({
      url: "/pages/login/login",
    });
  },
  setHeaderIconTop: function () {
    const t = wx.getMenuButtonBoundingClientRect(),
      e = t.height,
      r = void 0 === e ? 0 : e,
      a = t.top,
      i = void 0 === a ? 0 : a,
      n = wx.getSystemInfoSync().statusBarHeight;
    this.setData({
      headIconTop: "".concat(r / 2 + i + n, "rpx"),
      headContentTop: "".concat(r + i + n + 44, "rpx"),
      headHeight: "".concat(r + i + n + 380 + 24, "rpx"),
    });
  },
  /* 跳转到设置页面 */
  handleSetting: function () {
    wx.navigateTo({
      url: "/pages/setting/index",
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getUserInfo();
    this.getGrade();
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
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
