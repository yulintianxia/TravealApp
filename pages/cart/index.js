import { RequestApi } from "../../services/api.js";

Page({
  data: {
    cartList: [],
    selectedIds: [],
    selectedAll: false,
    showItemSelectors: false,
    totalPoints: 0,
    showQrCode: false,
    chatImg: "../../images/new/wechat.png",
  },

  onLoad() {
    this.loadCartList();
  },

  getMockCartList() {
    return [
      {
        id: 1,
        name: "鹿皮透气盘玩手套",
        size: "尺码：均码",
        material: "材质：羊毛",
        price: 4800,
        count: 1,
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: 2,
        name: "定制级文玩线绳",
        size: "尺码：均码",
        material: "材质：化纤",
        price: 1800,
        count: 1,
        image:
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
      },
    ];
  },

  async loadCartList() {
    try {
      const res = await RequestApi.cartList({
        pageNum: 1,
        pageSize: 20,
      });

      const list = (res && (res.rows || res.data?.rows || [])) || [];
      const cartList = list.length
        ? list.map((item) => ({
            id: item.keyId || item.id || item.goodsId,
            name: item.goodsName || item.name || "商品",
            size: item.spec || "尺码：均码",
            material: item.material || "材质：羊毛",
            price: Number(item.pointsPrice || item.price || item.totalPoints || 0),
            count: Number(item.goodsCount || item.count || 1),
            image:
              item.mainPicture ||
              item.picture ||
              item.image ||
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
          }))
        : this.getMockCartList();

      this.setData({ cartList }, () => {
        this.updateSummary();
      });
    } catch (error) {
      console.error("loadCartList error:", error);
      this.setData({ cartList: this.getMockCartList() }, () => {
        this.updateSummary();
      });
    }
  },

  toggleSelect(e) {
    const rawId = (e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.id) ?? e.detail?.value ?? e.detail?.id;
    const id = Number(rawId);
    const selectedIds = [...this.data.selectedIds];
    const index = selectedIds.indexOf(id);

    if (index > -1) {
      selectedIds.splice(index, 1);
    } else {
      selectedIds.push(id);
    }

    this.setData({ selectedIds, showItemSelectors: true }, () => {
      this.updateSummary();
    });
  },

  toggleSelectAll() {
    const selectedAll = !this.data.selectedAll;
    const selectedIds = selectedAll ? this.data.cartList.map((item) => item.id) : [];

    this.setData({ selectedAll, selectedIds, showItemSelectors: true }, () => {
      this.updateSummary();
    });
  },

  updateSummary() {
    const selectedIds = this.data.selectedIds || [];
    const cartList = this.data.cartList || [];
    const total = cartList
      .filter((item) => selectedIds.indexOf(item.id) !== -1)
      .reduce((sum, item) => sum + Number(item.price || 0) * Number(item.count || 1), 0);

    this.setData({
      totalPoints: total,
      selectedAll: cartList.length > 0 && selectedIds.length === cartList.length,
    });
  },

  changeCount(e) {
    const { id, type } = e.currentTarget.dataset;
    const cartList = this.data.cartList.map((item) => {
      if (item.id !== Number(id)) return item;
      const nextCount = type === "minus" ? Math.max(1, Number(item.count || 1) - 1) : Number(item.count || 1) + 1;
      return { ...item, count: nextCount };
    });

    this.setData({ cartList }, () => {
      this.updateSummary();
    });
  },

  openCustomerService() {
    this.setData({ showQrCode: true });
  },

  closeQrPopup() {
    this.setData({ showQrCode: false });
  },

  async checkout() {
    if (!this.data.selectedIds.length) {
      wx.showToast({ title: "请选择商品", icon: "none" });
      return;
    }

    try {
      await RequestApi.createOrder({
        goodsIds: this.data.selectedIds,
      });
      wx.showToast({ title: "下单成功", icon: "success", duration: 1000 });
    } catch (error) {
      console.error("checkout error:", error);
      wx.showToast({ title: "下单失败", icon: "none" });
    }
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },
});
