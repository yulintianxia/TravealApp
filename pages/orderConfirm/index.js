import { RequestApi } from "../../services/api.js";

Page({
  data: {
    selectedIds: [],
    goodsList: [],
    address: {},
    totalPoints: 0,
    remainingPoints: 0,
    submitting: false,
  },

  onLoad(options) {
    const selectedIds = (options.ids || "")
      .split(",")
      .filter(Boolean)
      .map((id) => Number(id));
    this.setData({ selectedIds });
    this.loadConfirmData();
  },

  async loadConfirmData() {
    try {
      const [cartRes, addressRes, gradeRes] = await Promise.all([
        RequestApi.cartList({}),
        RequestApi.addressList({ pageNum: 1, pageSize: 10 }),
        RequestApi.getGrade(),
      ]);
      const selected = this.data.selectedIds.map((id) => String(id));
      const allGoods = cartRes?.data || [];
      const goodsList = allGoods.filter(
        (item) => selected.indexOf(String(item.goodsId)) !== -1,
      );
      const addressList = addressRes?.data || [];
      const address =
        addressList.find((item) => Number(item.isDefault) === 1) ||
        addressList[0] ||
        {};
      const remainingPoints = Number(gradeRes?.data?.pointsBalance || 0);
      const totalPoints = goodsList.reduce(
        (sum, item) =>
          sum + Number(item.pointsPrice || 0) * Number(item.quantity || 1),
        0,
      );

      this.setData({
        goodsList,
        address,
        totalPoints,
        remainingPoints,
      });
    } catch (error) {
      console.error("loadConfirmData error:", error);
    }
  },

  chooseAddress() {
    wx.navigateTo({ url: "/pages/addressList/index" });
  },

  editAddress(e) {
    const address = e.currentTarget.dataset.address;
    if (!address || !address.keyId) {
      this.chooseAddress();
      return;
    }

    wx.navigateTo({
      url: "/pages/address/index",
      success: (res) => {
        res.eventChannel.emit("delivery", { editData: address });
      },
    });
  },

  createAddress() {
    wx.navigateTo({
      url: "/pages/address/index",
      success: (res) => {},
    });
  },

  async confirmOrder() {
    if (this.data.submitting || !this.data.selectedIds.length) return;
    if (!this.data.address.keyId) {
      wx.showToast({ title: "请选择收货地址", icon: "none" });
      return;
    }

    wx.showModal({
      title: "提示",
      content: "积分一旦兑换将无法取消",
      // showCancel: false,
      confirmText: "确定",
      success: (res) => {
        if (res.confirm) {
          this.realSumbit();
        }
      },
    });
  },
  async realSumbit() {
    this.setData({ submitting: true });
    try {
      let cartItems = this.data.goodsList.map((item) => ({
        goodsId: item.goodsId,
        quantity: item.quantity,
        cartId: item.cartId,
      }));

      let params = {
        addressDetail: this.data.address.detailedAddress,
        addressName: this.data.address.consigneeName,
        addressPhone: this.data.address.consigneePhone,
        cartItems,
      };

      let res = await RequestApi.createOrder(params);
      if (res && res.code == 200) {
        wx.showToast({ title: "兑换成功", icon: "success", duration: 1000 });
        setTimeout(() => wx.navigateTo({ url: "/pages/order/index" }), 1000);
      } else {
        wx.showToast({ title: res.msg || "兑换失败", icon: "none" });
      }
    } catch (error) {
      console.error("confirmOrder error:", error);
    } finally {
      this.setData({ submitting: false });
    }
  },
});
