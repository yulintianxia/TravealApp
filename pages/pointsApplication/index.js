// pages/pointsApplication/index.js
import { RequestApi } from "../../services/api.js";
import { BASE_URL } from "../../config/index";
Page({
  data: {
    statusBarHeight: 0,
    visible: false,
    platformText: "微信",
    purchasePlatform: "1",
    platforms: [],
    orderPhotoList: [],
    wxName: "",
    wxNumber: "",
    phone: "",
    actualPayment: "",
    paymentMoney: "",
    remark: "",
    isRead: false,
    keys: {
      label: "dictLabel",
      value: "dictValue",
    },
    keyId: "",
  },

  onLoad: function (options) {
    const { statusBarHeight } = wx.getSystemInfoSync();
    this.setData({ statusBarHeight });

    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel && Object.keys(eventChannel).length > 0) {
      eventChannel.on("pointData", (data) => {
        let orderPhotoList = [];
        let {
          isRead, actualPayment, orderPhoto, paymentMoney,
          phone, purchasePlatform, remark, wxName, wxNumber, keyId,
        } = data.pointsData;

        this.getplatforms(purchasePlatform);
        orderPhoto.split(",").forEach((item) => {
          orderPhotoList.push({ name: item, type: "image", url: item });
        });
        setTimeout(() => {
          this.setData({
            isRead, actualPayment, paymentMoney, purchasePlatform,
            remark, wxName, wxNumber, phone, orderPhotoList, keyId,
          });
        }, 100);
      });
    }
    this.getplatforms();
  },

  handleAdd: function (e) {
    const { files } = e.detail;
    let fileOrderPhoto = [];
    this.onUpload(files, fileOrderPhoto);
  },

  onUpload: function (file, fileOrderPhoto) {
    wx.uploadFile({
      url: BASE_URL + "/common/uploadImage",
      filePath: file[0].url,
      name: "file",
      formData: { file: file[0] },
      header: {
        "Content-type": "multipart/form-data",
        authorization: wx.getStorageSync("token")
          ? `Bearer ${wx.getStorageSync("token")}` : "",
      },
      success: (res) => {
        let resData = JSON.parse(res.data);
        fileOrderPhoto.push({
          name: resData.fileName, type: "image", url: BASE_URL + resData.url,
        });
        this.setData({
          orderPhotoList: this.data.orderPhotoList.concat(fileOrderPhoto),
        });
      },
    });
  },

  handleRemove(e) {
    const { index } = e.detail;
    const { orderPhotoList } = this.data;
    orderPhotoList.splice(index, 1);
    this.setData({ orderPhotoList });
  },

  onPlatformPicker: function () {
    if (this.data.isRead) return;
    this.setData({ visible: true });
  },

  onPickerCancel() {
    this.setData({ visible: false });
  },

  onPickerChange(e) {
    const { value, label } = e.detail;
    this.setData({
      visible: false,
      purchasePlatform: value[0],
      platformText: label[0],
    });
  },

  getplatforms: async function (value) {
    let res = await RequestApi.getPlatformList();
    if (res && res.data) {
      this.setData({ platforms: res.data }, () => {
        if (value) {
          this.data.platforms.forEach((item) => {
            if (item.dictValue == value) {
              this.setData({ platformText: item.dictLabel });
            }
          });
        }
      });
    }
  },

  bindName(e) { this.setData({ wxName: e.detail.value }); },
  bindNumber(e) { this.setData({ wxNumber: e.detail.value }); },
  bindPhone(e) { this.setData({ phone: e.detail.value }); },
  bindOrder(e) { this.setData({ actualPayment: e.detail.value }); },
  bindMoney(e) { this.setData({ paymentMoney: e.detail.value }); },
  bindText(e) { this.setData({ remark: e.detail.value }); },

  errorToast(title) {
    wx.showToast({ title, icon: "warn", duration: 1000 });
  },

  submit: async function () {
    if (this.data.isRead) return;
    let {
      wxName, wxNumber, phone, purchasePlatform,
      actualPayment, paymentMoney, orderPhotoList,
      remark, platformText, keyId,
    } = this.data;

    let orderPhotoArray = orderPhotoList.map(item => item.url);

    if (!wxName) { this.errorToast("请填写微信昵称"); return; }
    if (!wxNumber) { this.errorToast("请填写微信号"); return; }
    if (!phone) { this.errorToast("请填写手机号"); return; }
    if (!platformText) { this.errorToast("请选择平台"); return; }
    if (!actualPayment) { this.errorToast("请填写订单号"); return; }
    if (!paymentMoney) { this.errorToast("请填写实付金额"); return; }
    if (!orderPhotoArray.length) { this.errorToast("请上传图片"); return; }

    let params = {
      wxName, wxNumber, phone, purchasePlatform,
      actualPayment, paymentMoney,
      orderPhoto: orderPhotoArray.join(","), remark,
    };
    let res;
    if (keyId) {
      params = { ...params, keyId };
      res = await RequestApi.applyUpdate(params);
    } else {
      res = await RequestApi.addApply(params);
    }
    if (res && res.code == "200") {
      wx.showToast({ title: "成功", icon: "success", duration: 1000 });
      wx.navigateTo({ url: "/pages/pointsApplicationList/index" });
    }
  },

  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
});
