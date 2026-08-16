import { RequestApi } from "../../services/api.js";

Page({
  data: {
    keyId: "",
    activeTab: "商品",
    tabs: ["商品", "评价", "详情"],
    showCustomerDialog: false,
    qrGrid: [],
    product: {
      title: "",
      price: 0,
      hasRedeemed: 0,
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
      ],
      shipping: "发货：承诺48小时内发货",
      delivery: "免运费：四川成都 发货",
      review: {
        author: "孔孟之道",
        text: "",
      },
      specs: [],
    },
    reviewList: [],
  },

  onLoad(options) {
    const keyId = options.keyId || "";
    this.setData({ keyId });
    this.generateQrGrid();
    if (keyId) {
      this.loadDetail(keyId);
    }
  },

  generateQrGrid() {
    const matrix = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    this.setData({ qrGrid: matrix });
  },

  async loadDetail(keyId) {
    const mockProduct = {
      title: "鹿皮手套文玩手套凤眼善提手套文玩盘玩手套",
      price: 4800,
      hasRedeemed: 36,
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
      ],
      shipping: "发货：承诺48小时内发货",
      delivery: "免运费：四川成都 发货",
      review: {
        author: "孔孟之道",
        text: "东西很好，质感很好，一次非常不错的购物体验！",
      },
      specs: [
        ["品牌", "正莲"],
        ["主要材质", "羊毛"],
        ["尺码", "均码"],
        ["风格", "百搭风"],
        ["使用对象", "老少皆宜"],
      ],
    };

    try {
      const detailRes = await RequestApi.goodsDetail({ keyId });
      const detail = detailRes && (detailRes.data || detailRes.goods || detailRes.rows?.[0] || {});
      const reviewRes = await RequestApi.reviewList({ goodsId: keyId, pageNum: 1, pageSize: 3 });
      const reviewList = reviewRes && (reviewRes.rows || reviewRes.data?.rows || []);

      const goods = {
        title: detail.goodsName || detail.name || mockProduct.title,
        price: Number(detail.pointsPrice || detail.price || mockProduct.price),
        hasRedeemed: Number(detail.sellCount || detail.sales || mockProduct.hasRedeemed),
        images: detail.mainPicture || detail.picture || detail.image
          ? [detail.mainPicture || detail.picture || detail.image]
          : mockProduct.images,
        shipping: detail.shipping || mockProduct.shipping,
        delivery: detail.delivery || mockProduct.delivery,
        review: reviewList[0]
          ? {
              author: reviewList[0].createBy || mockProduct.review.author,
              text: reviewList[0].content || mockProduct.review.text,
            }
          : mockProduct.review,
        specs: [
          ["品牌", detail.brand || mockProduct.specs[0][1]],
          ["主要材质", detail.material || mockProduct.specs[1][1]],
          ["尺码", detail.size || mockProduct.specs[2][1]],
          ["风格", detail.style || mockProduct.specs[3][1]],
          ["使用对象", detail.userTarget || mockProduct.specs[4][1]],
        ],
      };

      this.setData({
        product: goods,
        reviewList,
      });
    } catch (error) {
      console.error("loadDetail error:", error);
      this.setData({
        product: mockProduct,
        reviewList: [
          { author: "孔孟之道", text: "东西很好，质感很好，一次非常不错的购物体验！" },
        ],
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
