import { showToast, showSuccessToast, showConfirmDialog, showDialog } from '@vant/weapp';
import { getAddressList, payOrder } from "@/services/url";

Page({
  data: {
    htmlTempalte: "",
    originValue: 0,
    show: false,
    showDialogData: false,
    addrsssList: [],
    addressId: "",
    isBuy: false,
    pointsBalance: 0,
    isShoped: false,
    isBuyOrder: false
  },

  onLoad(options) {
    // 获取路由参数
    this.setData({
      originValue: Number(options.pointsPrice || 0)
    });
    
    // 监听事件（替代mittBus）
    this.eventListener = (data) => {
      this.setData({
        htmlTempalte: data.tempalte,
        isBuy: data.isBuy,
        pointsBalance: data.pointsBalance,
        isBuyOrder: data.isBuyOrder
      });
    };
    // 小程序事件总线（需全局注册）
    getApp().eventBus.on('templateData', this.eventListener);
  },

  onUnload() {
    // 移除事件监听
    getApp().eventBus.off('templateData', this.eventListener);
  },

  // 返回上一页
  turnGo() {
    wx.navigateBack();
  },

  // 支付兑换
  async payGood() {
    const { addressId, originValue } = this.data;
    if (!addressId) {
      showToast({ title: "请选择地址!" });
      return;
    }

    try {
      await showConfirmDialog({
        title: "提示",
        message: `<div>您确认要使用<span style="color:#f6d6a2;font-size:20px;"> ${originValue} </span>积分兑换此商品吗？</div>`,
        allowHtml: true,
      });

      const params = {
        medalId: this.options.medalId,
        addressId,
        amount: 1,
      };
      const res = await payOrder(params);
      if (res && res.code == 200) {
        showSuccessToast({ title: "购买成功!" });
        this.setData({
          showDialogData: false,
          isBuyOrder: true
        });
      } else {
        this.setData({ showDialogData: false });
      }
    } catch (err) {
      // 取消操作
    }
  },

  // 关闭弹窗
  cancel() {
    this.setData({ showDialogData: false });
  },

  // 获取地址列表
  async getAddressData() {
    try {
      const res = await getAddressList({});
      const addrList = [];
      if (res.data && res.data.length) {
        this.setData({ showDialogData: true });
        res.data.forEach((item) => {
          if (item.isDefault == "1") {
            this.setData({ addressId: item.keyId });
          }
          addrList.push({
            id: item.keyId,
            name: item.consigneeName,
            isDefault: item.isDefault == "1",
            address: item.detailedAddress,
            tel: item.consigneePhone,
          });
        });
        this.setData({ addrsssList: addrList });
      } else {
        await showDialog({
          message: "暂无默认地址,收货地址请进入个人中心-左上角设置-收货地址设施进行添加！",
        });
      }
    } catch (err) {
      showToast({ title: "获取地址失败" });
    }
  },

  // 选择地址
  selectAddress(e) {
    const { item } = e.detail;
    this.setData({ addressId: item.id });
  },

  // 兑换按钮点击
  orderBuys() {
    this.getAddressData();
  },

  // 废弃方法（保留兼容）
  orderBuy() {
    this.setData({ show: true });
  },

  onClickCloseIcon() {
    this.setData({ show: false });
  }
});