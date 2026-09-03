import { RequestApi } from "../../../../services/api.js";

Page({
  data: {
    cartList: [],
    selectedIds: [],
    selectedAll: false,
    showItemSelectors: false,
    totalPoints: 0,
  },

  onLoad() {
    this.loadCartList();
  },

  async loadCartList() {
      const res = await RequestApi.cartList({});
      const cartList = ((res && res.data) || []).map((item) => ({
        ...item,
        isSelected: false,
      }));
      this.setData({ cartList, selectedIds: [], selectedAll: false, totalPoints: 0 }, () => {
        this.updateSummary();
      });
  },

  toggleSelect(e) {
    const itemIndex = Number(e.currentTarget.dataset.index);
    const item = this.data.cartList[itemIndex];
    if (!item) return;

    const selectedIds = [...this.data.selectedIds];
    const itemId = item.goodsId;
    const selectedIndex = selectedIds.indexOf(itemId);
    if (selectedIndex > -1) {
      selectedIds.splice(selectedIndex, 1);
    } else {
      selectedIds.push(itemId);
    }

    const cartList = this.data.cartList.slice();
    cartList[itemIndex] = { ...item, isSelected: !item.isSelected };


    this.setData({ selectedIds, cartList }, () => {
      this.updateSummary();
    });
  },

  toggleSelectAll() {
    const selectedAll = !this.data.selectedAll;
    const selectedIds = selectedAll ? this.data.cartList.map((item) => item.goodsId) : [];
    const cartList = this.data.cartList.map((item) => ({ ...item, isSelected: selectedAll }));

    this.setData({ selectedAll, selectedIds, cartList }, () => {
      this.updateSummary();
    });
  },

  updateSummary() {
    const selectedIds = this.data.selectedIds || [];
    const cartList = this.data.cartList || [];
    const total = cartList
      .filter((item) => selectedIds.indexOf(item.goodsId) !== -1)
      .reduce((sum, item) => sum + Number(item.pointsPrice || 0) * Number(item.quantity), 0);

    this.setData({
      totalPoints: total,
      selectedAll: cartList.length > 0 && selectedIds.length === cartList.length,
    });
  },

  changeCount(e) {
    const { index, type,id } = e.currentTarget.dataset;
    const itemIndex = Number(index);
    const item = this.data.cartList[itemIndex];
    if (!item) return;

    const currentQuantity = Number(item.quantity || 1);
    const nextQuantity = type === "minus"
      ? Math.max(1, currentQuantity - 1)
      : currentQuantity + 1;
    const cartList = this.data.cartList.slice();
    cartList[itemIndex] = { ...item, quantity: nextQuantity };


    this.setData({ cartList }, () => {
      this.updateSummary();
      this.cartUpdate(nextQuantity,id);
    });
  },
  //更新购物车数量
  async cartUpdate(nextQuantity,id) {
      let res = await RequestApi.cartUpdate({
        keyId: id,
        quantity: nextQuantity
      });
    if(res && res.code === 200){
      // wx.showToast({ title: "更新成功", icon: "success" });
       console.log('更新成功',res);
    }

  },

  deleteItem(e) {
    const { id } = e.currentTarget.dataset;
    if (!id) return;

    wx.showModal({
      title: "提示",
      content: "确定删除该商品吗？",
      success: async (res) => {
        if (!res.confirm) return;

        const result = await RequestApi.cartDelete({ keyIds: [id] });
        if (result && result.code === 200) {
          wx.showToast({ title: "删除成功", icon: "success" });
          this.loadCartList();
        }
      },
    });
  },

  openCustomerService() {
    this.setData({ showQrCode: true });
  },

  closeQrPopup() {
    this.setData({ showQrCode: false });
  },

  checkout() {
    if (!this.data.selectedIds.length) {
      wx.showToast({ title: "请选择商品", icon: "none" });
      return;
    }

    wx.navigateTo({
      url: `/subpackages/mall/pages/orderConfirm/index?ids=${this.data.selectedIds.join(",")}`,
    });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },
});
