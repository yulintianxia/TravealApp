// pages/pointrank/index.js
import { RequestApi } from "../../services/api.js";
import { BASE_URL } from '../../config/index';
Page({
  data: {
    dataList: [],
    BASE_URL,
    user: {
      avatar:'', 
    },
    dataTopList:[],
    defaultPerson: "../../images/home/default.png",
  },

  onLoad: function () {
    this.getList();
    this.getPeopleData();
  },
  onShow: function () {

  },
  onPullDownRefresh: function () { //下拉刷新
    wx.stopPullDownRefresh();
    // this.getList();
  },
  async getPeopleData() {
    let user = wx.getStorageSync("user");
    let res = await RequestApi.getGrade();
    if (res && res.code == "200") {
      this.setData({
        user: {
          userName: user.userName,
          avatar: user.avatar ? BASE_URL + user.avatar: this.data.defaultPerson,
          pointsBalance: res.data.pointsBalance,
          top: res.data.top,
          nickName: user.nickName
        }
      })
    }
  },
  getGrade: async function () {

  },
  getList: async function () {
    let params = {
      top: 10,
    }
    let res = await RequestApi.getPointsTop(params);
    console.log('res', res.data);
    this.setData({
      dataList: res.data.slice(3),
      dataTopList:res.data.slice(0,3)
    })
    // console.log('dataTopList', this.data.dataTopList);
  },
  /* 获取用户信息 */
  async getUserInfo() {
    let res = await RequestApi.getInfo();
    console.log("res", res);
    if (res && res.user) {
      wx.setStorageSync("user", res.user);
      this.setData({
        user: res.user,
      });
    }
  },

})



