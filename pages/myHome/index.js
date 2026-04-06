import { imagesModule } from "../../common/imageUrlConfs.js";
import { userConfig } from "../../common/entryConfs.js";
import { RequestApi } from "../../services/api.js";
import { BASE_URL, baseImageUrl } from "../../config/index";

Page({
  data: {
    BASE_URL,
    statusBarHeight: 0,
    navBarHeight: 0,
    isLogin: true,
    user: {},
    defaultPerson: "../../images/new/16.png",
    levelInfo: {},
    levelId: "",
    pointsTotal: "",
    pointsBalance: "",
    medalCount: 0,
    configbackgroundImg: "../../images/home/v1-bg-new.png",
    orderList: [
      { iconUrl: "../../images/new/4.png", title: "全部", state: "all" },
      { iconUrl: "../../images/new/3.png", title: "待发货", state: "1" },
      { iconUrl: "../../images/new/9.png", title: "待收货", state: "2" },
      { iconUrl: "../../images/new/12.png", title: "已收货", state: "3" },
    ],
    topList: [
      { iconUrl: "../../images/new/1.png", title: "排行榜", url: "/pages/pointrank/index" },
      { iconUrl: "../../images/new/14.png", title: "积分明细", url: "/pages/pointUse/index" },
      { iconUrl: "../../images/new/1.png", title: "积分申请", url: "/pages/pointsApplicationList/index" },
      { iconUrl: "../../images/new/15.png", title: "我的勋章", url: "/myBadge" },
    ],
    toolsData: [
      { iconUrl: "../../images/new/6.png", title: "我的钱包" },
      { iconUrl: "../../images/new/5.png", title: "公众号" },
      { iconUrl: "../../images/new/13.png", title: "咨询客服" },
      { iconUrl: "../../images/new/7.png", title: "设置" },
    ],
  },

  onLoad(options) {
    this.setNavBarHeight();
  },

  onShow() {
    this.getUserInfo();
    this.getGrade();
  },

  setNavBarHeight() {
    const sysInfo = wx.getSystemInfoSync();
    const menuBtn = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = sysInfo.statusBarHeight;
    const navBarHeight = (menuBtn.top - statusBarHeight) * 2 + menuBtn.height;
    this.setData({ statusBarHeight, navBarHeight });
  },

  async getGrade() {
    let res = await RequestApi.getGrade();
    if (res && res.code == "200") {
      this.setData({
        pointsTotal: res.data.pointsTotal,
        pointsBalance: res.data.pointsBalance,
        levelInfo: res.data.levelInfo,
        levelId: res.data.levelId ? res.data.levelId : 0,
        medalCount: res.data.medalCount,
      });
    }
  },

  async getUserInfo() {
    let res = await RequestApi.getInfo();
    if (res && res.user) {
      wx.setStorageSync("user", res.user);
      this.setData({ user: res.user });
    }
  },

  handleEntryJump(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/index?state=${data.item.state}`,
    });
  },

  handleJumpUrl(e) {
    let url = e.currentTarget.dataset.url;
    if (url == "/myBadge") {
      this.turnMyBadge();
    } else {
      wx.navigateTo({ url });
    }
  },

  turnMyBadge() {
    if (this.data.medalCount) {
      this.turnWebView("/myBadge");
    } else {
      wx.showToast({ title: "暂无勋章", duration: 1000 });
    }
  },

  turnWebView(url) {
    wx.navigateTo({
      url: "/pages/webView/index",
      success: (res) => {
        res.eventChannel.emit("webViewData", {
          url,
          levelId: this.data.levelId,
        });
      },
    });
  },

  turnLevel() {
    wx.navigateTo({ url: "/pages/vipMemer/index" });
  },

  handleMoreInfo() {
    wx.navigateTo({ url: "/pages/myDetail/index" });
  },

  handleTool(e) {
    const item = e.currentTarget.dataset.item;
    if (item.title === "设置") {
      wx.navigateTo({ url: "/pages/setting/index" });
    } else {
      wx.showToast({ title: "敬请期待新功能", duration: 1000 });
    }
  },

  onShareAppMessage() {},
});