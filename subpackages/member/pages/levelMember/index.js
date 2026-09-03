// pages/levelMember/index.js
import { BASE_URL, baseImageUrl } from "../../../../config/index";
import { RequestApi } from "../../../../services/api";

Page({
  data: {
    levelList: [],
    levelIconList: [
      "/images/icons/icon7.png",
      "/images/icons/icon5.png",
      "/images/icons/icon1.png",
      "/images/icons/icon2.png",
      "/images/icons/icon3.png",
      "/images/icons/icon6.png",
      "/images/icons/icon9.png",
    ],
    rankIcon: "/images/icons/icon8.png",
    rightsBadgeIcon: "/images/icons/icon10.png",
    rightsGiftIcon: "/images/icons/icon4.png",
    showPopup: false,
    currentLevel: null,
    currentLevelIndex: 0,
    pointsTotal: 0,
    pointsBalance: 0,
    levelId: 0,
    top: 0,
    medalCount: 0,
    backGroundImg: "",
    BASE_URL,
    noLogin: false,
    baseImageUrl,
    progressPercent: 0,
  },

  turnModal: function (url) {
    wx.showModal({
      title: "提示",
      content: "当前账号未登录, 请先登录！",
      success(res) {
        if (res.confirm) {
          wx.navigateTo({ url });
        }
      },
    });
  },

  turnTop: function () {
    if (!this.data.noLogin) {
      wx.navigateTo({ url: "/subpackages/member/pages/pointrank/index" });
    } else {
      this.turnModal("/subpackages/account/pages/newLogin/index");
    }
  },

  turnUpgrade: function () {
    if (!this.data.noLogin) {
      wx.navigateTo({ url: "/subpackages/member/pages/vipMemer/index" });
    } else {
      this.turnModal("/subpackages/account/pages/newLogin/index");
    }
  },

  showRightsPopup: function () {
    this.setData({ showPopup: true });
  },

  hideRightsPopup: function () {
    this.setData({ showPopup: false });
  },

  turnWebView: function (url) {
    wx.navigateTo({
      url: "/subpackages/account/pages/webView/index",
      success: (res) => {
        res.eventChannel.emit("webViewData", {
          url,
          levelId: this.data.levelId,
        });
      },
    });
  },

  turnBadgePage: function () {
    if (!this.data.noLogin) {
      this.turnWebView("/badge");
    } else {
      this.turnModal("/subpackages/account/pages/newLogin/index");
    }
  },

  turnGiftPage: function () {
    if (!this.data.noLogin) {
      this.turnWebView("/gift");
    } else {
      this.turnModal("/subpackages/account/pages/newLogin/index");
    }
  },

  getSwiperList: async function () {
    let res = await RequestApi.getAllLevel();
    if (res && res.code == "200" && res.data.length) {
      const levelList = res.data;
      let currentLevelIndex = 0;
      const levelId = this.data.levelId;

      if (levelId) {
        levelList.forEach((item, index) => {
          if (item.keyId == levelId) {
            currentLevelIndex = index;
          }
        });
      }

      const currentLevel = levelList[currentLevelIndex];
      const progressPercent = this.calcProgress(levelList, this.data.pointsTotal);

      this.setData({
        levelList,
        currentLevel,
        currentLevelIndex,
        backGroundImg: BASE_URL + currentLevel.background,
        progressPercent,
      });
    }
  },

  calcProgress: function (levelList, points) {
    if (!levelList.length) return 0;
    const maxPoints = levelList[levelList.length - 1].pointsStart;
    const minPoints = levelList[0].pointsStart;
    if (points <= minPoints) return 0;
    if (points >= maxPoints) return 100;
    return ((points - minPoints) / (maxPoints - minPoints)) * 100;
  },

  onLoad(options) {
    this.getGrade();
  },

  async getGrade() {
    let config = { isNoTurn: true };
    try {
      let res = await RequestApi.getGrade({}, config);
      if (res && res.code == "200") {
        this.setData(
          {
            pointsTotal: res.data.pointsTotal,
            pointsBalance: res.data.pointsBalance,
            levelInfo: res.data.levelInfo,
            levelId: res.data.levelId ? res.data.levelId : 0,
            top: res.data.top,
            medalCount: res.data.medalCount,
            noLogin: false,
          },
          () => {
            this.getSwiperList();
          }
        );
      } else {
        wx.showToast({
          title: "获取信息失败",
          duration: 2000,
          icon: "none",
          mask: false,
        });
      }
    } catch (error) {
      if (error == 401) {
        this.setData({ noLogin: true });
        this.getSwiperList();
      }
    }
  },

  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
});
