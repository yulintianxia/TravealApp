// pages/order/order.js
import { RequestApi } from "../../services/api.js";
import { BASE_URL } from "../../config/index";

Page({
  data: {
    BASE_URL,
    statusBarHeight: 0,
    navBarHeight: 0,
    orderList: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    noMore: false,
    pointsBalance: 0, // 先写死占位，后续接口替换
  },

  onLoad() {
    // this.setNavBarHeight();
    this.getPointsInfo();
    this.loadData(true);
  },

  setNavBarHeight() {
    const sysInfo = wx.getSystemInfoSync();
    const menuBtn = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = sysInfo.statusBarHeight || 0;
    const navBarHeight = (menuBtn.top - statusBarHeight) * 2 + menuBtn.height;
    this.setData({ statusBarHeight, navBarHeight });
  },

  async getPointsInfo() {
    try {
      const res = await RequestApi.getGrade();
      if (res && res.code == "200") {
        this.setData({ pointsBalance: res.data.pointsBalance || 0 });
      }
    } catch (e) {
      console.error("getPointsInfo error:", e);
    }
  },

  getTypeLabel(item) {
    if (item.type == 1) return "系统调整";
    if (item.type == 2) return "兑换产品";
    if (item.type == 3) return "积分申请";
    if (item.type == 4) return "每日签到";
    if (item.type == 5) return "完成订单";
    return "积分变动";
  },

  async loadData(reset) {
    if (this.data.loading) return;
    const page = reset ? 1 : this.data.pageNum;
    this.setData({ loading: true });

    try {
      const res = await RequestApi.getPointsUse({
        pageNum: page,
        pageSize: this.data.pageSize,
      });

      const rows = ((res && res.rows) || []).map((item) => ({
        ...item,
        label: this.getTypeLabel(item),
        displayNum: (Number(item.pointsNum) >= 0 ? "+" : "") + item.pointsNum,
        isAdd: Number(item.pointsNum) >= 0,
      }));

      const total = (res && res.total) || 0;
      const prev = reset ? [] : this.data.orderList;
      const merged = prev.concat(rows);

      this.setData({
        orderList: merged,
        total,
        pageNum: page,
        noMore: merged.length >= total || rows.length < this.data.pageSize,
      });
    } catch (e) {
      console.error("loadData error:", e);
      if (reset) this.setData({ orderList: [], total: 0, noMore: true });
    } finally {
      this.setData({ loading: false });
    }
  },

  bindscrolltolower() {
    if (this.data.noMore || this.data.loading) return;
    this.setData({ pageNum: this.data.pageNum + 1 });
    this.loadData(false);
  },

  onShareAppMessage() {},
});
