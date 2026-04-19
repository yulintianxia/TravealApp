// pages/memberGrade/index.js
import { BASE_URL, baseImageUrl } from "../../config/index";
import { RequestApi } from "../../services/api";

Page({
  data: {
    current: 0,
    levelList: [],
    rightsBadgeIcon: "../../images/icons/icon10.png",
    rightsGiftIcon: "../../images/icons/icon4.png",
    rankIcon: "../../images/icons/icon8.png",
    pointsTotal: 0,
    pointsBalance: 0,
    pointsStart: 0,
    levelId: 0,
    top: 0,
    medalCount: 0,
    backGroundImg: "",
    BASE_URL,
    noLogin: false,
    baseImageUrl,
    hasLevel: false,
    progressPercent: 0,
    myLevelIndex: 0,
    nextLevelBg: "",
    hasNextLevel: false,
    showBeastPopup: false,
    showBeastPopupAnim: false,
    popupLevel: null,
    popupIndex: 0,
    popupTime: "",
    currentLevel: null,
    currentLevelIndex: 0,
    noLevelProgressPercent: 0,
    showPopup: false,
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
      wx.navigateTo({ url: "/pages/pointrank/index" });
    } else {
      this.turnModal("/pages/newLogin/index");
    }
  },

  turnPoint: function () {
    if (!this.data.noLogin) {
      wx.navigateTo({ url: "/pages/pointUse/index" });
    } else {
      this.turnModal("/pages/newLogin/index");
    }
  },

  turnBadge: function () {
    if (!this.data.noLogin) {
      if (this.data.medalCount) {
        this.turnWebView("/myBadge");
      }
    } else {
      this.turnModal("/pages/newLogin/index");
    }
  },

  catchtouchmove: function () {
    return false;
  },

  swiperChange(e) {
    const idx = e.detail.current;
    const levelList = this.data.levelList;
    const level = levelList[idx];
    const hasNext = idx + 1 < levelList.length;
    const percent = this.getProgressPercent(levelList, idx);
    this.setData({
      current: idx,
      backGroundImg: BASE_URL + level.background,
      pointsStart: level.pointsStart,
      levelId: level.keyId,
      progressPercent: percent,
      hasNextLevel: hasNext,
      nextLevelBg: hasNext ? BASE_URL + levelList[idx + 1].background : "",
    });
  },

  onBeastIconTap(e) {
    const idx = e.currentTarget.dataset.index;
    const levelList = this.data.levelList;
    const level = levelList[idx];
    const hasNext = idx + 1 < levelList.length;
    const percent = this.getProgressPercent(levelList, idx);
    this.setData({
      current: idx,
      backGroundImg: BASE_URL + level.background,
      pointsStart: level.pointsStart,
      levelId: level.keyId,
      progressPercent: percent,
      hasNextLevel: hasNext,
      nextLevelBg: hasNext ? BASE_URL + levelList[idx + 1].background : "",
      showBeastPopup: true,
      showBeastPopupAnim: false,
      popupLevel: level,
      popupIndex: idx,
      popupTime: this.getPopupTime(level),
    });
    setTimeout(() => {
      if (this.data.showBeastPopup) {
        this.setData({ showBeastPopupAnim: true });
      }
    }, 30);
  },

  closeBeastPopup() {
    if (!this.data.showBeastPopup) return;
    this.setData({ showBeastPopupAnim: false });
    setTimeout(() => {
      this.setData({ showBeastPopup: false });
    }, 260);
  },

  getPopupTime(level) {
    if (!level) return "";
    return level.obtainTime || level.time || level.getTime || "";
  },

  getProgressPercent(levelList, idx) {
    if (!levelList.length) return 0;
    if (idx === 0) return (1 / levelList.length) * 100 * 0.5;
    if (idx === levelList.length - 1) return 100;
    return ((idx + 0.5) / levelList.length) * 100;
  },

  calcProgress: function (levelList, currentIndex) {
    if (!levelList.length) return 0;
    return (currentIndex / (levelList.length - 1)) * 100;
  },

  turnWebView: function (url) {
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

  turnUpgrade: function () {
    if (!this.data.noLogin) {
      wx.navigateTo({ url: "/pages/vipMemer/index" });
    } else {
      this.turnModal("/pages/newLogin/index");
    }
  },

  showRightsPopup: function () {
    this.setData({ showPopup: true });
  },

  hideRightsPopup: function () {
    this.setData({ showPopup: false });
  },

  calcProgressByPoints: function (levelList, points) {
    if (!levelList.length) return 0;
    const maxPoints = levelList[levelList.length - 1].pointsStart;
    const minPoints = levelList[0].pointsStart;
    if (points <= minPoints) return 0;
    if (points >= maxPoints) return 100;
    return ((points - minPoints) / (maxPoints - minPoints)) * 100;
  },

  turnBadgePage: function () {
    if (!this.data.noLogin) {
      this.turnWebView("/badge");
    } else {
      this.turnModal("/pages/newLogin/index");
    }
  },

  turnGiftPage: function () {
    if (!this.data.noLogin) {
      this.turnWebView("/gift");
    } else {
      this.turnModal("/pages/newLogin/index");
    }
  },

  getSwiperList: async function () {
    let res = await RequestApi.getAllLevel();
    if (res && res.code == "200" && res.data.length) {
      const levelList = res.data;
      let currentIndex = 0;
      let myLevelIndex = 0;
      const levelId = this.data.levelId;

      if (levelId) {
        levelList.forEach((item, index) => {
          if (item.keyId == levelId) {
            currentIndex = index;
            myLevelIndex = index;
          }
        });
      }

      const currentLevel = levelList[currentIndex];
      const hasNext = currentIndex + 1 < levelList.length;
      this.setData({
        levelList,
        current: currentIndex,
        myLevelIndex,
        currentLevel,
        currentLevelIndex: currentIndex,
        backGroundImg: BASE_URL + currentLevel.background,
        pointsStart: currentLevel.pointsStart,
        progressPercent: this.getProgressPercent(levelList, currentIndex),
        noLevelProgressPercent: this.calcProgressByPoints(levelList, this.data.pointsTotal),
        hasNextLevel: hasNext,
        nextLevelBg: hasNext ? BASE_URL + levelList[currentIndex + 1].background : "",
      });
    }
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
            hasLevel: !!res.data.levelId,
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
