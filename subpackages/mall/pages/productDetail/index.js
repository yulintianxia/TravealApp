import { RequestApi } from "../../../../services/api.js";
import { officialAccountUsername, webChatUrl } from "../../../../config/index";
import { BASE_URL } from "../../../../config/index";
Page({
  data: {
    baseUrl: BASE_URL,
    keyId: "",
    activeTab: "商品",
    tabs: ["商品", "评价", "详情"],
    showCustomerDialog: false,
    showProductTop: false,
    qrGrid: [],
    chatImg: "/images/new/wechat.png",
    // shipping: "承诺"+detail.deliveryHours+"小时内发货",
    delivery: "免运费：四川成都 发货",
    product: {},
    mediaList: [],
    currentMediaIndex: 0,
    specs: [],
    reviewList: [],
    reviewListOne: {},
    totalReviews: 0,
    tags: [],
    cartCount: 0,
    deliveryTime: "",
    showStroe: false,
  },

  onLoad(options) {
    const keyId = options.keyId || "";
    this.setData({ keyId });

    if (keyId) {
      this.loadDetail(keyId);
      this.getreviewList(keyId);
    }
    this.updateCartCount();
  },

  onPageScroll(e) {
    const windowHeight = wx.getSystemInfoSync().windowHeight;
    const showProductTop = e.scrollTop >= 400;
    console.log("showProductTop", e.scrollTop);
    if (showProductTop !== this.data.showProductTop) {
      this.setData({ showProductTop });
    }
  },

  async getreviewList(goodsId) {
    let res = await RequestApi.reviewList({ goodsId });
    if (res && res.code === 200) {
      this.setData({
        reviewList: res.rows || [],
        reviewListOne: res?.rows?.[0] || {},
        totalReviews: res.total || 0,
        deliveryTime: res?.rows?.[0]?.deliveryTime.slice(0, 10) || "",
      });
    }
  },
  async loadDetail(keyId) {
    let res = await RequestApi.goodsDetail({ keyId });

    if (res && res.code === 200) {
      let detail = res.data;
      let specsArray = JSON.parse(detail.specs || "[]");

      console.log(specsArray);
      let mediaList = detail?.mainPicture?.split("," || "").map((item) => {
        return (item = {
          url: item,
          type: "image",
        });
      });
      // console.log(mediaList);
      if (detail.video) {
        mediaList.push({
          url: detail.video,
          type: "video",
        });
      }

      this.setData({
        product: detail,
        // mediaList: this.normalizeMediaList(detail),
        mediaList,
        specs: specsArray,
        tags: detail.tags || [],
      });
    }
  },

  normalizeMediaList(detail) {
    const mediaSources =
      detail.mediaList ||
      detail.media ||
      detail.mediaFiles ||
      detail.carouselImages ||
      detail.images ||
      detail.pictures ||
      [];
    const mediaItems = Array.isArray(mediaSources)
      ? mediaSources
      : [mediaSources];
    const mediaList = mediaItems
      .map((item) => {
        if (typeof item === "string") {
          return { type: this.isVideoUrl(item) ? "video" : "image", url: item };
        }

        const url =
          item?.url ||
          item?.imageUrl ||
          item?.src ||
          item?.path ||
          item?.fileUrl ||
          "";
        const type =
          item?.type || item?.mediaType || (item?.isVideo ? "video" : "");
        return {
          type: type === "video" || this.isVideoUrl(url) ? "video" : "image",
          url,
        };
      })
      .filter((item) => item.url);

    const videoUrl = detail.videoUrl || detail.video || detail.videoPath;
    if (videoUrl && !mediaList.some((item) => item.url === videoUrl)) {
      mediaList.unshift({ type: "video", url: videoUrl });
    }

    if (!mediaList.length && detail.mainPicture) {
      mediaList.push({ type: "image", url: detail.mainPicture });
    }
    return mediaList;
  },

  isVideoUrl(url) {
    return /\.(mp4|mov|m3u8|webm)(\?.*)?$/i.test(url || "");
  },

  onMediaChange(e) {
    const currentMediaIndex = e.detail.current;
    const previousMedia = this.data.mediaList[this.data.currentMediaIndex];
    if (previousMedia?.type === "video") {
      wx.createVideoContext(
        `product-video-${this.data.currentMediaIndex}`,
        this,
      ).stop();
    }
    this.setData({ currentMediaIndex });
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

  onTabChangeProduct(e) {
    this.scrollToAnchor("product");
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
    wx.navigateTo({ url: "/subpackages/mall/pages/addressList/index" });
  },

  goReviewPage() {
    if (this.data.totalReviews == 0) {
      return wx.showToast({ title: "暂无评价", icon: "none" });
    }
    const keyId = this.data.keyId;
    if (!keyId) return;
    wx.navigateTo({
      url: `/subpackages/mall/pages/review/index?keyId=${keyId}`,
    });
  },

  goMarket() {
    wx.switchTab({ url: "/pages/market/index" });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  openMicroStore() {
    // wx.navigateToMiniProgram({
    //   appId: "wxb74828a7b042024b",
    //   // path: "/pages/index/index", // 可选:指定目标小程序的页面路径
    //   // envVersion: "release", // 指定版本: develop(开发版), trial(体验版), release(正式版)
    //   envVersion:'release',
    //   success: () => {},
    //   fail: (err) => {
    //     console.error("跳转失败:err", err);
    //     wx.showToast({
    //       title: "跳转失败,请稍后重试",
    //       icon: "none",
    //     });
    //   },
    // });
    // this.setData({ showStroe: true });
    wx.navigateTo({ url: "/pages/weStore/index" });
  },
  openMicroStoreWeb() {
    wx.navigateTo({
      url: "/subpackages/account/pages/webView/index",
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
    let params = {
      goodsId: this.data.keyId,
      quantity: 1,
    };

    let res = await RequestApi.cartAdd(params);
    if (res && res.code === 200) {
      wx.showToast({ title: "已加入购物车", icon: "success", duration: 1000 });
      this.updateCartCount();
    } else {
      wx.showToast({ title: "加入失败", icon: "none" });
    }
  },

  async updateCartCount() {
    let res = await RequestApi.cartCount({});
    if (res && res.code === 200) {
      this.setData({
        cartCount: res.data || 0,
      });
    }
  },

  async exchange() {
    if (!this.data.keyId) {
      wx.showToast({ title: "缺少商品信息", icon: "none" });
      return;
    }

    try {
      const res = await RequestApi.cartList({});

      console.log("res", res);

      if (res && res.code == 200) {
        const cartItem = (res?.data || []).find(
          (item) => item.goodsId == this.data.keyId,
        );
      
        console.log("cartItem", cartItem);
        if (Number(cartItem?.quantity || 0) >=1) {
          wx.navigateTo({
            url: `/subpackages/mall/pages/orderConfirm/index?ids=${cartItem.goodsId}`,
          });
          return;
        } else{

        }
        // wx.showToast({ title: "商品数量需大于等于1才能兑换", icon: "none" });
      }
    } catch (error) {
      console.error("exchange error:", error);
      wx.showToast({ title: "获取购物车失败", icon: "none" });
    }
  },

  goCart() {
    wx.navigateTo({ url: "/subpackages/mall/pages/cart/index" });
  },
});
