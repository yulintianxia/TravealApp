import { RequestApi } from "../../../../services/api.js";

Page({
  data: {
    cartList: [],
    selectedIds: [],
    selectedAll: false,
    showItemSelectors: false,
    totalPoints: 0,
    showDeletePopup: false,
    deleteId: null,
  },

  onLoad() {
    this.loadCartList();
  },

  async loadCartList() {
      const res = await RequestApi.cartList({});
      const cartList = ((res && res.data) || []).map((item) => ({
        ...item,
        filterStr: this.filterData(item.specs),
        isSelected: false,
      }));
      this.setData({ cartList, selectedIds: [], selectedAll: false, totalPoints: 0 }, () => {
        if(!res.data.length){
            wx.showToast({ title: "暂无数据", icon: "none" });
        }
        this.updateSummary();
      });
  },

  filterData(str) {
    if (!str) return "";

    try {
      const dataArray = Array.isArray(str) ? str : JSON.parse(str);
      return dataArray
        .filter((item) => item.showInOrder)
        .map((item) => item.value)
        .filter(Boolean)
        .join(",");
    } catch (error) {
      return "";
    }
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
    if (type === "minus" && currentQuantity <= 1) {
      wx.showToast({ title: "当前商品购买最小为1", icon: "none" });
      return;
    }
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

    this.setData({ showDeletePopup: true, deleteId: id });
  },

  closeDeletePopup() {
    this.setData({ showDeletePopup: false, deleteId: null });
  },

  async confirmDelete() {
    const { deleteId } = this.data;
    if (!deleteId) return;

    this.setData({ showDeletePopup: false, deleteId: null });
    const result = await RequestApi.cartDelete({ keyIds: [deleteId] });
    if (result && result.code === 200) {
      wx.showToast({ title: "删除成功", icon: "success" });
      this.loadCartList();
    }
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
