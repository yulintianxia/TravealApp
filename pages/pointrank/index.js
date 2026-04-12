import { RequestApi } from "../../services/api.js";
import { BASE_URL } from "../../config/index";

Page({
  data: {
    BASE_URL,
    defaultPerson: "../../images/home/default.png",
    statusBarHeight: 0,
    navBarHeight: 0,
    dataList: [],
    topFirst: {},
    topSecond: {},
    topThird: {},
  },

  onLoad() {
    // this.setNavBarHeight();
    this.getList();
  },

  onPullDownRefresh() {
    this.getList().finally(() => wx.stopPullDownRefresh());
  },

  // setNavBarHeight() {
  //   const sysInfo = wx.getSystemInfoSync();
  //   const menuBtn = wx.getMenuButtonBoundingClientRect();
  //   const statusBarHeight = sysInfo.statusBarHeight || 0;
  //   const navBarHeight = (menuBtn.top - statusBarHeight) * 2 + menuBtn.height;
  //   this.setData({ statusBarHeight, navBarHeight });
  // },

  async getList() {
    try {
      const res = await RequestApi.getPointsTop({ top: 10 });
      const list = (res && res.data) || [];
      this.setData({
        topFirst: list[0] || {},
        topSecond: list[1] || {},
        topThird: list[2] || {},
        dataList: list.slice(3),
      });
    } catch (err) {
      console.error("getPointsTop error:", err);
    }
  },
});