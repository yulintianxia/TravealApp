import { RequestApi } from "../../services/api.js";
import { BASE_URL, H5Url } from "../../config/index";

Page({
  data: {
    BASE_URL,
    H5Url,
    defaultPerson: "../../images/home/default.png",
    topFirstCrown: "https://zhenglian.vip/dotm/zl_images/rank1.png",
    topSecondCrown: "https://zhenglian.vip/dotm/zl_images/rank2.png",
    topThirdCrown: "https://zhenglian.vip/dotm/zl_images/rank3.png",
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
      const user = wx.getStorageSync("user") || {};
      const currentUserId = user.userId;
      const dataList = list.slice(3).map((item) => ({
        ...item,
        isCurrentUser: !!currentUserId && String(item.userId) === String(currentUserId),
      }));
      this.setData({
        topFirst: list[0] || {},
        topSecond: list[1] || {},
        topThird: list[2] || {},
        dataList,
      });
    } catch (err) {
      console.error("getPointsTop error:", err);
    }
  },
});
