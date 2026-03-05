// 引入小程序请求封装（需自行实现，或使用wx.request）
import { getInfoByLevel, getPointsInfo, giftByLevel } from '@/services/url';
// 配置BASE_URL
const BASE_URL = getApp().globalData.BASE_URL;

Page({
  data: {
    modules: [],
    checkIndex: 0,
    ImgLists: [],
    bgImg: '',
    checkActive: 'badge',
    reallevelId: '',
    levelId: '0',
    yearList: [],
    year: '',
    checkImgList: [],
    pointsBalance: 0,
    isBuyOrder: false,
    BASE_URL: BASE_URL
  },

  onLoad(options) {
    // 接收路由参数
    this.setData({
      levelId: options.levelId || '0'
    });
    // 存储token
    if (options.token) {
      wx.setStorageSync('token', options.token);
      this.getUserInfo();
    }
    // 初始化数据
    this.getData();
  },

  // 监听页面卸载（替代Vue的onBeforeRouteLeave）
  onUnload() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage.route.includes('detail')) {
      setTimeout(() => {
        // 小程序通过页面通信传递数据（或使用全局变量）
        getApp().globalData.templateData = {
          isBuy: Number(this.data.reallevelId) >= Number(this.data.levelId),
          tempalte: this.data.checkImgList[this.data.checkIndex].detail,
          pointsBalance: this.data.pointsBalance,
          isBuyOrder: this.data.isBuyOrder
        };
      }, 500);
    }
  },

  // 切换tab
  onClickTab(e) {
    const { name } = e.detail;
    const { levelId, token } = this.data;
    if (name === 'gift') {
      wx.navigateTo({
        url: `/pages/gift/gift?levelId=${levelId}&token=${token}`
      });
      this.getData('gift');
    } else {
      wx.navigateTo({
        url: `/pages/badge/badge?levelId=${levelId}&token=${token}`
      });
      this.getData('badge');
    }
  },

  // 获取数据
  async getData(type) {
    const { levelId } = this.data;
    const params = { levelId };
    let res;

    try {
      if (type) {
        res = type === 'gift' ? await giftByLevel(params) : await getInfoByLevel(params);
      } else {
        // 判断当前页面路径（小程序通过getCurrentPages获取）
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (currentPage.route.includes('badge')) {
          this.setData({ checkActive: 'badge' });
          res = await getInfoByLevel(params);
        } else {
          this.setData({ checkActive: 'gift' });
          res = await giftByLevel(params);
        }
      }

      this.setData({
        ImgLists: res.data,
        yearList: res.yearList
      });

      if (res.yearList && res.yearList.length) {
        this.setData({ year: res.yearList[0] });
      }

      this.getCheckImgList();

      // 异步更新背景图
      wx.nextTick(() => {
        if (this.data.checkImgList.length) {
          this.setData({
            bgImg: `${BASE_URL}${this.data.checkImgList[0].backgroundPicture}`,
            isBuyOrder: Number(this.data.checkImgList[0].purchasedQuantity) > 0
          });
        }
      });
    } catch (err) {
      console.error('请求失败:', err);
    }
  },

  // 选择年份
  checkYear(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({ year: item });
    this.getCheckImgList();
  },

  // 筛选对应年份的图片列表
  getCheckImgList() {
    const { ImgLists, year } = this.data;
    const checkImgList = ImgLists.filter(item => item.year === year);
    
    this.setData({
      checkImgList,
      isBuyOrder: checkImgList.length ? Number(checkImgList[0].purchasedQuantity) > 0 : false
    });
  },

  // 获取用户信息
  async getUserInfo() {
    try {
      const res = await getPointsInfo();
      this.setData({
        reallevelId: res.data.levelId,
        pointsBalance: res.data.pointsBalance
      });
    } catch (err) {
      console.error('获取用户信息失败:', err);
    }
  },

  // 跳转详情页
  turnDetail(e) {
    const { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?medalId=${item.keyId}&pointsPrice=${item.pointsPrice}&mainPicture=${item.mainPicture}&name=${item.name}`
    });
  },

  // swiper切换事件
  onSlideChange(e) {
    const index = e.detail.current;
    const { checkImgList } = this.data;
    
    this.setData({
      checkIndex: index,
      bgImg: `${BASE_URL}${checkImgList[index].backgroundPicture}`,
      isBuyOrder: Number(checkImgList[index].purchasedQuantity) > 0
    });
  }
});