// 小程序页面逻辑
const app = getApp();
// 替换原 API 导入，适配小程序请求
import { getMybadgeList, getPointsInfo } from '../../services/url'; 

Page({
  data: {
    modules: [], // 小程序 swiper 无需模块配置
    checkIndex: 0,
    ImgLists: [],
    bgImg: '',
    checkActive: 'badge',
    reallevelId: '',
    levelId: '',
    yearList: [],
    year: '',
    BASE_URL: app.globalData.BASE_URL || 'https://xxx.com/', // 替换为实际基础地址
  },

  onLoad(options) {
    // 小程序生命周期替代 Vue 的 onMounted
    this.setData({
      levelId: options.levelId || ''
    });

    // 处理 token
    if (options.token) {
      wx.setStorageSync('token', options.token);
      this.getUserInfo();
      this.getData();
    }
  },

  // 原 getData 方法适配
  async getData() {
    const { levelId } = this.data;
    const params = { levelId };
    try {
      const res = await getMybadgeList(params);
      this.setData({
        ImgLists: res.data || [],
        checkActive: 'badge'
      });
      
      // 延迟设置背景图
      wx.nextTick(() => {
        if (res.data && res.data.length) {
          this.setData({
            bgImg: this.data.BASE_URL + res.data[0].backgroundPicture
          });
        }
      });
    } catch (err) {
      console.error('获取勋章列表失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 原 getUserInfo 方法适配
  async getUserInfo() {
    try {
      const res = await getPointsInfo();
      this.setData({
        reallevelId: res.data.levelId || ''
      });
    } catch (err) {
      console.error('获取用户信息失败:', err);
    }
  },

  // 跳转详情页
  turnDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/my-detail/my-detail?levelId=${this.data.levelId}&itemId=${item.id}`, // 传递必要参数
      success: () => {
        // 原 mitt 事件替换为小程序全局事件/本地存储
        wx.setStorageSync('templateDataView', {
          tempalte: this.data.ImgLists[this.data.checkIndex].detail
        });
      }
    });
  },

  // swiper 切换事件
  onSlideChange(e) {
    const index = e.detail.current;
    this.setData({
      checkIndex: index,
      bgImg: this.data.BASE_URL + this.data.ImgLists[index].backgroundPicture
    });
  },

  // 原 onSwiper 调试方法
  onSwiper(swiper) {
    console.log(swiper);
  },

  // 小程序路由离开监听（需在 onUnload 处理）
  onUnload() {
    // 如需监听路由离开，可在此处理
  }
});