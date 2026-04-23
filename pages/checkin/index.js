import { RequestApi } from "../../services/api.js";
import { BASE_URL } from "../../config/index";

Page({
  data: {
    BASE_URL,
    defaultPerson: "../../images/home/default.png",
    statusBarHeight: 0,
    navBarHeight: 0,
    user: {},
    levelInfo: {},
    pointsBalance: 0,
    consecutiveDays: 0,
    checkinDays: [],    // 当月已签到的日期数组 [16,17,18,19,20]
    checkinList: [],     // 签到记录列表
    // 日历数据
    year: 2026,
    month: 4,
    weekDays: ["一", "二", "三", "四", "五", "六", "日"],
    calendarDays: [],
    today: 0,
    todayChecked: false,
  },

  onLoad() {
    // this.setNavBarHeight();
    const now = new Date();
    this.setData({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      today: now.getDate(),
    });
    this.buildCalendar();
    this.getUserInfo();
    this.getGradeInfo();
    this.loadCheckinData();
  },

  onShow() {
    this.loadCheckinData();
  },

  setNavBarHeight() {
    const sysInfo = wx.getSystemInfoSync();
    const menuBtn = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = sysInfo.statusBarHeight || 0;
    const navBarHeight = (menuBtn.top - statusBarHeight) * 2 + menuBtn.height;
    this.setData({ statusBarHeight, navBarHeight });
  },

  async getUserInfo() {
    try {
      const res = await RequestApi.getInfo();
      if (res && res.user) {
        wx.setStorageSync("user", res.user);
        this.setData({ user: res.user });
      }
    } catch (e) { console.error(e); }
  },

  async getGradeInfo() {
    try {
      const res = await RequestApi.getGrade();
      if (res && res.code == "200") {
        this.setData({
          pointsBalance: res.data.pointsBalance || 0,
          levelInfo: res.data.levelInfo || {},
        });
      }
    } catch (e) { console.error(e); }
  },

  async loadCheckinData() {
    try {
      const { year, month } = this.data;
      // 获取当月签到日期
      const yearMonth = `${year}-${month.toString().padStart(2, "0")}-01`;
      const daysRes = await RequestApi.checkinList({ yearMonth });
      const checkinDays = (daysRes && daysRes.data) || [];
      console.log("checkinDays:", checkinDays);

      // const checkinDays =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        //  const checkinDays =[];
      // // 获取签到记录
      // const listRes = await RequestApi.getCheckinList({ year, month });
      // const checkinList = (listRes && listRes.data) || [];
      const checkinList = [];


      const today = this.data.today;
      const todayChecked = checkinDays.includes(today);

      this.setData({
        checkinDays,
        checkinList,
        consecutiveDays: checkinList.length,
        todayChecked,
      });
      this.buildCalendar();
    } catch (e) {
      console.error("loadCheckinData error:", e);
    }
  },

  buildCalendar() {
    const { year, month, checkinDays, today } = this.data;
    // 本月第一天是周几 (0=周日, 需转成周一=0)
    let firstDay = new Date(year, month - 1, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
    // 本月总天数
    const totalDays = new Date(year, month, 0).getDate();
    // 上月天数
    const prevTotal = new Date(year, month - 1, 0).getDate();

    const days = [];

    // 上月补位
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevTotal - i, current: false, checked: false });
    }
    // 本月
    for (let d = 1; d <= totalDays; d++) {
      days.push({
        day: d,
        current: true,
        checked: checkinDays.includes(d),
        isToday: d === today,
      });
    }
    // 下月补位到42格
    const remain = 42 - days.length;
    for (let i = 1; i <= remain; i++) {
      days.push({ day: i, current: false, checked: false });
    }

    this.setData({ calendarDays: days });
  },

  async doCheckin() {
    if (this.data.todayChecked) {
      wx.showToast({ title: "今日已签到", icon: "none" });
      return;
    }
    try {
      const res = await RequestApi.doCheckin();
      if (res && res.code == "200") {
        wx.showToast({ title: "签到成功", icon: "success" });
        this.loadCheckinData();
        this.getGradeInfo();
      } else {
        wx.showToast({ title: (res && res.msg) || "签到失败", icon: "none" });
      }
    } catch (e) {
      wx.showToast({ title: "签到失败", icon: "none" });
    }
  },

  goBack() {
    wx.navigateBack();
  },
});