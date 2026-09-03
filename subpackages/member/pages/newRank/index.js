// pages/newRank/index.js
import { RequestApi } from "../../../../services/api.js";
import { BASE_URL } from '../../../../config/index';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 其他排名数据
    otherRanks: [
      {
        name: "大力的飚哥",
        score: 2760,
        avatar: "/images/home/3.png"
      },
      {
        name: "神秘的阿峰",
        score: 2680,
        avatar: "/images/home/1.png"
      },
      {
        name: "乐阳堂主",
        score: 2590,
        avatar: "/images/home/2.png"
      },
      {
        name: "潇潇雨歇",
        score: 2430,
        avatar: "/images/home/3.png"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getRankData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getRankData();
  },

  /**
   * 获取排行榜数据
   */
  async getRankData() {
    try {
      let params = {
        top: 10,
      }
      let res = await RequestApi.getPointsTop(params);
      console.log('排行榜数据:', res.data);
      if (res && res.data && res.data.length > 0) {
        // 处理数据，更新页面
        const otherRanks = res.data.slice(3).map(item => ({
          name: item.nickName,
          score: item.pointsBalance,
          avatar: item.avatar ? BASE_URL + item.avatar : "/images/home/default.png"
        }));
        this.setData({
          otherRanks
        });
      }
    } catch (error) {
      console.error('获取排行榜数据失败:', error);
      // 使用默认数据
    }
  },

  /**
   * 跳转到首页
   */
  goToHome() {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },

  /**
   * 跳转到我的页面
   */
  goToMine() {
    wx.switchTab({
      url: "/pages/myHome/index"
    });
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getRankData();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '正莲积分榜',
      path: '/subpackages/member/pages/newRank/index',
      imageUrl: '/images/home/1.png'
    };
  },
});// pages/newRank/index.js

