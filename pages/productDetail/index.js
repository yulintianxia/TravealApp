import { RequestApi } from "../../services/api.js";

Page({
  data: {
    keyId: "",
    activeTab: "商品",
    tabs: ["商品", "评价", "详情"],
    showCustomerDialog: false,
    qrGrid: [],
    chatImg: "../../images/new/wechat.png",
    shipping: "承诺48小时内发货",
    delivery: "免运费：四川成都 发货",
    product: {},
    specs: [],
    reviewList: [],
    totalReviews: 0,
  },

  onLoad(options) {
    const keyId = options.keyId || "";
    this.setData({ keyId });

    if (keyId) {
      this.loadDetail(keyId);
      this.getreviewList(keyId);
    }
  },

  async getreviewList(goodsId) {
    let res = await RequestApi.reviewList({ goodsId });
    if (res && res.code === 200) {
      this.setData({
        reviewList: res.data || [],
      });
    }
  },
  async loadDetail(keyId) {
    let res = await RequestApi.goodsDetail({ keyId });

    if (res && res.code === 200) {
      let detail = res.data;
      let specs = JSON.parse(detail.specs || "[]");
      const specsArray = Object.entries(specs).map(([label, value]) => ({
        label,
        value,
      }));

      this.setData({
        product: detail,
        specs: specsArray,
      });
    }
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ activeTab: tab });
  },

  openCustomerService() {
    this.setData({ showCustomerDialog: true });
  },

  closeCustomerService() {
    this.setData({ showCustomerDialog: false });
  },

  goAddressList() {
    wx.navigateTo({ url: "/pages/addressList/index" });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  async addToCart() {
    if (!this.data.keyId) {
      wx.showToast({ title: "缺少商品信息", icon: "none" });
      return;
    }

    try {
      await RequestApi.cartAdd({
        goodsId: this.data.keyId,
        goodsCount: 1,
      });
      wx.showToast({ title: "已加入购物车", icon: "success", duration: 1000 });
    } catch (error) {
      console.error("addToCart error:", error);
      wx.showToast({ title: "加入失败", icon: "none" });
    }
  },

  goCart() {
    wx.switchTab({ url: "/pages/cart/index" });
  },
});
