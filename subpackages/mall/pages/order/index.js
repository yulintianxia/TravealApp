// pages/order/index.js
import { RequestApi } from "../../../../services/api.js";
import { BASE_URL } from "../../../../config/index";
Page({
  data: {
    Paymentlist: [],
    pageSize: 10,
    pageNum: 1,
    goodList: [],
    defaultValue: "all",
    value: "all",
    BASE_URL,
    total: 0,
    showConfirmPopup: false,
    confirmOrderId: null,
    confirmOrderGoodsId: null,
  },

  onLoad(options) {
    this.setData({
      defaultValue: options.state || "all",
      value: options.state || "all",
    });
    this.getOrderList();
  },

  viewCopyTextClick: function (e) {
    let text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success(res) {
        wx.getClipboardData({ success(res) {} });
      },
    });
  },

  handleCopy(e) {
    let number = e.currentTarget.dataset.number;
    wx.setClipboardData({
      data: number,
      success: () => {
        wx.showToast({
          title: "复制成功",
          icon: "none",
        });
      },
      fail: () => {
        wx.showToast({
          title: "复制失败",
          icon: "none",
        });
      },
    });
  },
  goToComment(e) {
    let goodsId = e.currentTarget.dataset.good;
    let keyId = e.currentTarget.dataset.id;
    console.log("goodsId", goodsId, keyId);
    wx.navigateTo({
      url:
        "/subpackages/mall/pages/reviewCreate/index?goodsId=" +
        goodsId +
        "&orderId=" +
        keyId,
    });
  },
  goDetail(e) {
    let keyId = e.currentTarget.dataset.id;
    let img = e.currentTarget.dataset.img;
    let filterstr = e.currentTarget.dataset.filterstr;
    let description = e.currentTarget.dataset.description;
    let goodsId = e.currentTarget.dataset.goods;
    if (!keyId || !goodsId) return;
    wx.navigateTo({
      url: `/subpackages/mall/pages/orderDetail/index?keyId=${(keyId)}&img=${(img || "")}&filterstr=${(filterstr || "")}&description=${(description || "")}&goodsId=${(goodsId)}`,
    });
  },

  goToReview(e) {
    let keyId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/subpackages/mall/pages/review/index?keyId=${keyId}`,
    });
  },
  async getOrderList() {
    let params = {
      pageSize: this.data.pageSize,
      pageNum: this.data.pageNum,
      status: this.data.value == "all" ? "" : this.data.value,
    };
    let res = await RequestApi.getOrder(params);
    if (res && res?.rows.length) {
      let orderList = res.rows
        .map((item) => {
          return (item = {
            status: item.status,
            courierNumber: item.courierNumber,
            courierCompanyName: item.courierCompanyName,
            deliveryTime: item.deliveryTime,
            orderNumber: item.orderNumber,
            keyId: item.keyId,
            reviewed: item.reviewed,
            createTime:item.createTime,
            //  specsArray: JSON.parse(JSON.parse(item.items)?.[0]?.specs) || [],
            filterStr: this.filterData(item),
            ...item
          });
        })
        .flat();
      let goodList = [];
      if (this.data.pageNum > 1) {
        goodList = [...this.data.goodList, ...orderList];
      } else {
        goodList = orderList;
      }

      console.log("goodList", goodList);
      this.setData({
        goodList: goodList,
        total: res.total,
      });
    } else {
      this.setData({
        goodList: [],
        total: 0,
      });
    }
  },

  filterData(str) {
    console.log('strstr',str);
    if (!str) {
      return [];
    }
    let dataArray = str?.specs || [];
    console.log("dataArray111");
    let filterStr = "";
    Array.from(dataArray).forEach((item) => {
      console.log("item", item);
      if (item.showInOrder) {
        console.log("item", item.value);
        filterStr += item.value + ",";
      }
    });
    return filterStr.slice(0, -1);
  },

  /* 自定义 Tab 点击 */
  onTabClick(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({ value, pageNum: 1, goodList: [] }, () => {
      this.getOrderList();
    });
  },

  async orderChcek(e) {
    const orderId = e.currentTarget.dataset.id;
    const goodsId = e.currentTarget.dataset.goods;
    if (!orderId) return;
    this.setData({
      showConfirmPopup: true,
      confirmOrderId: orderId,
      confirmOrderGoodsId: goodsId,
    });
  },

  closeConfirmPopup() {
    this.setData({
      showConfirmPopup: false,
      confirmOrderId: null,
      confirmOrderGoodsId: null,
    });
  },

  async confirmReceipt() {
    const { confirmOrderId, confirmOrderGoodsId } = this.data;
    if (!confirmOrderId) return;

    this.setData({
      showConfirmPopup: false,
      confirmOrderId: null,
      confirmOrderGoodsId: null,
    });
    const result = await RequestApi.receiveOrder({
      orderId: confirmOrderId,
      goodsId: confirmOrderGoodsId,
    });
    if (result && result.code == 200) {
      wx.showToast({ title: "成功", icon: "success", duration: 2000 });
      this.getOrderList();
    }
  },

  onReady() {},

  onShow() {
    this.setData({
      scrollHeight:
        wx.getSystemInfoSync().windowHeight -
        (wx.getSystemInfoSync().windowWidth / 750) * 100 +
        40,
    });
    this.getOrderList();
  },

  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},

  onReachBottom(e) {
    if (this.data.total <= this.data.pageSize * this.data.pageNum) {
      return;
    } else {
      this.setData({ pageNum: Number(this.data.pageNum) + 1 });
      this.getOrderList();
    }
  },

  onShareAppMessage() {},
});
