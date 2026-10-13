import { RequestApi } from "../../../../services/api.js";

Page({
  data: {
    selectedIds: [],
    goodsList: [],
    address: {},
    totalPoints: 0,
    remainingPoints: 0,
    submitting: false,
    showConfirmPopup: false,
    showErrorPopup: false,
    errorMessage: "",
    directExchange: false,
  },

  onLoad(options) {
    const directExchange = options.mode === "direct";
    const selectedIds = (options.ids || "")
      .split(",")
      .filter(Boolean)
      .map((id) => Number(id));
    this.setData({ selectedIds, directExchange });
    this.hasShown = false;
    if (directExchange) {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on("directExchangeData", ({ product, quantity = 1 }) => {
        this.setDirectExchangeProduct(product, quantity);
        this.loadConfirmData();
      });
      return;
    }
    this.loadConfirmData();
  },

  onShow() {
    if (this.hasShown) {
      this.loadAddress();
    }
    this.hasShown = true;
  },

  async loadAddress() {
    try {
      const res = await RequestApi.addressList({ pageNum: 1, pageSize: 10 });
      const addressList = res?.data || [];
      const address =
        addressList.find((item) => Number(item.isDefault) === 1) ||
        addressList[0] ||
        {};
      this.setData({ address });
    } catch (error) {
      console.error("loadAddress error:", error);
    }
  },

  setDirectExchangeProduct(product, quantity = 1) {
    if (!product) return;
    const goodsList = [{
      ...product,
      goodsId: product.goodsId || product.keyId,
      goodsName: product.goodsName || product.name,
      goodsCoverImage: product.goodsCoverImage || product.coverImage || product.mainPicture,
      quantity: Math.max(1, Number(quantity) || 1),
      filterStr: this.filterData(product.specs || ""),
    }];
    this.setData({ goodsList }, () => this.updateTotalPoints());
  },

  updateTotalPoints() {
    const totalPoints = (this.data.goodsList || []).reduce(
      (sum, item) => sum + Number(item.pointsPrice || 0) * Number(item.quantity || 1),
      0,
    );
    this.setData({ totalPoints });
  },

  async loadConfirmData() {
    try {
      const [cartRes, addressRes, gradeRes] = await Promise.all([
        this.data.directExchange ? Promise.resolve({ data: [] }) : RequestApi.cartList({}),
        RequestApi.addressList({ pageNum: 1, pageSize: 10 }),
        RequestApi.getGrade(),
      ]);
      const selected = this.data.selectedIds.map((id) => String(id));
      const allGoods = cartRes?.data || [];
      const goodsListData = this.data.directExchange
        ? this.data.goodsList
        : allGoods.filter((item) => selected.indexOf(String(item.goodsId)) !== -1);
      const addressList = addressRes?.data || [];
      const address =
        addressList.find((item) => Number(item.isDefault) === 1) ||
        addressList[0] ||
        {};
      const remainingPoints = Number(gradeRes?.data?.pointsBalance || 0);
      const totalPoints = goodsListData.reduce(
        (sum, item) =>
          sum + Number(item.pointsPrice || 0) * Number(item.quantity || 1),
        0,
      );
     
      const goodsList = goodsListData.map((item) => ({
        ...item,
        filterStr: this.filterData(item?.specs || ""),
      }));
     
      console.log("goodsList", goodsList);
        
    
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

    filterData(str) {
    console.log("str", str);
    if (!str) {
      return [];
    }
    let dataArray = JSON.parse(str) || [];
    console.log("dataArray111", );
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

  changeQuantity(e) {
    const index = Number(e.currentTarget.dataset.index);
    const type = e.currentTarget.dataset.type;
    const item = this.data.goodsList[index];
    if (!item) return;

    const currentQuantity = Number(item.quantity || 1);
    if (type === "minus" && currentQuantity <= 1) return;
    const quantity = type === "minus"
      ? currentQuantity - 1
      : currentQuantity + 1;
    const goodsList = this.data.goodsList.slice();
    goodsList[index] = { ...item, quantity };
    this.setData({ goodsList }, () => {
      this.updateTotalPoints();
      const cartId = item.cartId || item.keyId;
      if (!this.data.directExchange && cartId) {
        RequestApi.cartUpdate({ keyId: cartId, quantity });
      }
    });
  },

  chooseAddress() {
    wx.navigateTo({ url: "/subpackages/mall/pages/addressList/index" });
  },

  editAddress(e) {
    const address = e.currentTarget.dataset.address;
    if (!address || !address.keyId) {
      this.chooseAddress();
      return;
    }

    wx.navigateTo({
      url: "/subpackages/mall/pages/address/index",
      success: (res) => {
        res.eventChannel.emit("delivery", { editData: address });
      },
    });
  },

  createAddress() {
    wx.navigateTo({
      url: "/subpackages/mall/pages/address/index",
      success: (res) => {},
    });
  },

  async confirmOrder() {
    if (this.data.submitting || !this.data.selectedIds.length) return;
    if (!this.data.address.keyId) {
      wx.showToast({ title: "请选择收货地址", icon: "none" });
      return;
    }

    this.setData({ showConfirmPopup: true });
  },

  closeConfirmPopup() {
    if (!this.data.submitting) {
      this.setData({ showConfirmPopup: false });
    }
  },

  closeErrorPopup() {
    this.setData({ showErrorPopup: false, errorMessage: "" });
  },

  confirmPopupSubmit() {
    if (this.data.submitting) return;
    this.setData({ showConfirmPopup: false }, () => {
      this.realSumbit();
    });
  },
  async realSumbit() {
    this.setData({ submitting: true });
    try {
      const cartItems = this.data.goodsList.map((item) => {
        if (this.data.directExchange) {
          return {
            goodsId: item.goodsId,
            quantity: item.quantity,
          };
        }
        return {
          cartId: item.keyId,
          goodsId: item.goodsId,
        };
      });

      let params = {
        goodsId: this.data.goodsList[0]?.goodsId,
        addressDetail: this.data.address.detailedAddress,
        addressName: this.data.address.consigneeName,
        addressPhone: this.data.address.consigneePhone,
        cartItems,
      };

      let res = await RequestApi.createOrder(params, { showErrorToast: false });
      if (res && res.code == 200) {
        wx.showToast({ title: "兑换成功", icon: "success", duration: 1000 });
        setTimeout(() => wx.navigateTo({ url: "/subpackages/mall/pages/order/index" }), 1000);
      } else {
        console.log("res", res?.msg);
        this.setData({
          showErrorPopup: true,
          errorMessage: res?.msg || "兑换失败",
        });
      }
    } catch (error) {
      console.error("confirmOrder error:", error);
      this.setData({
        showErrorPopup: true,
        errorMessage:
          error?.data?.msg || error?.data?.message || error?.msg || "兑换失败，请稍后重试",
      });
    } finally {
      this.setData({ submitting: false });
    }
  },
});
