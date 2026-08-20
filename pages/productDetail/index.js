import { RequestApi } from "../../services/api.js";
import { officialAccountUsername, webChatUrl } from "../../config/index";

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
    reviewListOne:{},
    totalReviews: 0,
    tags:[],
    cartCount:0,
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
        reviewList: res.rows || [],
        reviewListOne:res?.rows?.[0] || {},
        totalReviews: res.total || 0,
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
        tags: detail.tags || [],
      });
    }
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ activeTab: tab });

    const map = {
      商品: "product",
      评价: "review",
      详情: "detail",
    };

    const anchor = map[tab];
    if (anchor) {
      this.scrollToAnchor(anchor);
    }
  },

  scrollToAnchor(anchorName) {
    const selector = `#anchor-${anchorName}`;
    wx.createSelectorQuery()
      .select(selector)
      .boundingClientRect()
      .selectViewport()
      .scrollOffset()
      .exec((res) => {
        if (!res || !res[0]) return;
        const rect = res[0];
        const scrollTop = (res[1] && res[1].scrollTop) || 0;
        wx.pageScrollTo({
          scrollTop: scrollTop + rect.top - 20,
          duration: 200,
        });
      });
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

  goReviewPage() {
    const keyId = this.data.keyId;
    if (!keyId) return;
    wx.navigateTo({
      url: `/pages/review/index?keyId=${keyId}`,
    });
  },

  goMarket() {
    wx.switchTab({ url: "/pages/market/index" });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  openMicroStore() {
    wx.navigateToMiniProgram({
      appId: "wxfae9e8b96aea0726",
      path: "pages/index/index", // 可选:指定目标小程序的页面路径
      envVersion: "release", // 指定版本: develop(开发版), trial(体验版), release(正式版)
      success: () => {},
      fail: (err) => {
        wx.showToast({
          title: "跳转失败,请稍后重试",
          icon: "none",
        });
        // 跳转失败后返回首页
        setTimeout(() => {
          wx.switchTab({
            url: "/pages/index/index",
          });
        }, 1500);
      },
    });
  },
  openMicroStoreWeb() {
    wx.navigateTo({
      url: "/pages/webView/index",
      success: (res) => {
        res.eventChannel.emit("webViewData", {
          url: webChatUrl,
          wechatCode: true,
        });
      },
    });
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

  async exchange() {
    if (!this.data.keyId) {
      wx.showToast({ title: "缺少商品信息", icon: "none" });
      return;
    }

    try {
      const res = await RequestApi.cartList({});
      const cartItem = (res?.data || []).find(
        (item) => String(item.goodsId) === String(this.data.keyId),
      );

      if (Number(cartItem?.quantity || 0) > 1) {
        wx.navigateTo({
          url: `/pages/orderConfirm/index?ids=${cartItem.goodsId}`,
        });
        return;
      }

      wx.showToast({ title: "商品数量需大于1才能兑换", icon: "none" });
    } catch (error) {
      console.error("exchange error:", error);
      wx.showToast({ title: "获取购物车失败", icon: "none" });
    }
  },

  goCart() {
    wx.navigateTo({ url: "/pages/cart/index" });
  },
});
