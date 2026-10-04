import { RequestApi } from "../../../../services/api.js";
import { BASE_URL } from "../../../../config/index";

Page({
  data: {
    keyId: "",
    order: null,
    loading: true,
    BASE_URL,
    coverImg: "",
    description: "",
    filterstr: "",
    showConfirmPopup: false,
  },

  onLoad(options) {
    console.log('options',options);
    const keyId = options.keyId || "";
    const img = options.img || "";
    this.setData({
      keyId,
      coverImg: img,
      description: options.description || "",
      filterstr: options.filterstr || "",
    });
    if (!keyId) {
      this.setData({ loading: false });
      return;
    }
    this.loadOrderDetail(keyId);
  },

  async loadOrderDetail(keyId) {
    try {
      const res = await RequestApi.getOrderDetail({ keyId });
      if (res && res.code == "200") {
        const order = this.normalizeOrder(res.data || res);

        console.log("order", order);

        this.setData({ order });
      }
    } catch (error) {
      console.error("loadOrderDetail error:", error);
    } finally {
      this.setData({ loading: false });
    }
  },

  normalizeOrder(order) {
    let item = {};
    try {
      item = JSON.parse(order.items || "[]")?.[0] || {};
    } catch (error) {
      console.error("parse order items error:", error);
    }

    return {
      ...order,
      ...item,

      filterStr: this.filterData(item.specs),
      quantity: Number(item.quantity || order.quantity || 1),
    };
  },

  filterData(specs) {
    if (!specs) return "";
    try {
      const values = JSON.parse(specs)
        .filter((item) => item.showInOrder)
        .map((item) => item.value)
        .filter(Boolean);
      return values.join(",");
    } catch (error) {
      return "";
    }
  },

  getStatus(status) {
    const statusMap = {
      0: "已创建",
      1: "待发货",
      2: "待收货",
      3: "已收货",
      10: "已取消",
    };
    return statusMap[status] || "未知状态";
  },

  copyText(e) {
    const text = e.currentTarget.dataset.text;
    if (!text) return;
    wx.setClipboardData({
      data: String(text),
      success: () => wx.showToast({ title: "复制成功", icon: "none" }),
    });
  },

  goToProductDetail() {
    const { order } = this.data;
    const goodsId = order && order.goodsId;
    if (!goodsId) return;

    wx.navigateTo({
      url: `/subpackages/mall/pages/productDetail/index?keyId=${goodsId}`,
    });
  },

  confirmReceipt() {
    const { keyId, order } = this.data;
    if (!keyId || !order || Number(order.status) !== 2) return;
    this.setData({ showConfirmPopup: true });
  },

  closeConfirmPopup() {
    this.setData({ showConfirmPopup: false });
  },

  async confirmReceiptSubmit() {
    const { keyId, order } = this.data;
    if (!keyId || !order || Number(order.status) !== 2) return;

    this.setData({ showConfirmPopup: false });
    const result = await RequestApi.receiveOrder({ orderId: keyId });
    if (result && result.code == 200) {
      wx.showToast({ title: "成功", icon: "success" });
      this.loadOrderDetail(keyId);
    }
  },

  goToComment() {
    const { order } = this.data;
    if (!order) return;
    wx.navigateTo({
      url: `/subpackages/mall/pages/reviewCreate/index?goodsId=${order.goodsId}&orderId=${order.keyId}`,
    });
  },

  goToReview() {
    const { order } = this.data;
    if (!order) return;
    wx.navigateTo({
      url: `/subpackages/mall/pages/review/index?keyId=${order.goodsId}`,
    });
  },

  onShareAppMessage() {
    const { order, keyId, coverImg } = this.data;
    return {
      title: order?.goodsName || order?.name || "订单详情",
      path: `/subpackages/mall/pages/orderDetail/index?keyId=${keyId}`,
      imageUrl: coverImg || "",
    };
  },

  onShareTimeline() {
    const { order, keyId, coverImg } = this.data;
    return {
      title: order?.goodsName || order?.name || "订单详情",
      query: `keyId=${keyId}`,
      imageUrl: coverImg || "",
    };
  },

  onShow() {
    if (this.data.keyId) {
      this.loadOrderDetail(this.data.keyId);
    }
  },
});
