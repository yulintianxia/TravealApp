// pages/pointsApplication/index.js
import { RequestApi } from "../../services/api.js";
import { BASE_URL } from "../../config/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    const eventChannel = this.getOpenerEventChannel();
    // 监听'delivery'事件，并获取数据包
    if (eventChannel && Object.keys(eventChannel).length > 0) {
      console.log("eventChannel", eventChannel);

      eventChannel.on("pointData", (data) => {
        let orderPhotoList = [];
        let {
          isRead,
          actualPayment,
          orderPhoto,
          paymentMoney,
          phone,
          purchasePlatform,
          remark,
          wxName,
          wxNumber,
          keyId,
        } = data.pointsData;

        this.getplatforms(purchasePlatform);
        orderPhoto.split(",").forEach((item, index) => {
          orderPhotoList.push({
            name: item,
            type: "image",
            url: item,
          });
        });
        console.log("actualPayment", actualPayment, wxNumber, wxName);
        setTimeout(() => {
          this.setData({
            isRead,
            actualPayment,
            paymentMoney,
            purchasePlatform,
            remark,
            wxName,
            wxNumber,
            phone,
            orderPhotoList,
            keyId,
          });
        }, 100);
      });
    } else {
      this.getplatforms();
    }
  },

  handleAdd: function (e) {
    const { files } = e.detail;
    let fileOrderPhoto = [];
    this.onUpload(files, fileOrderPhoto);
  },
  onUpload: function (file, fileOrderPhoto) {
    const task = wx.uploadFile({
      url: BASE_URL + "/common/uploadImage", // 仅为示例，非真实的接口地址
      filePath: file[0].url,
      name: "file",
      formData: { file: file[0] },
      header: {
        "Content-type": "multipart/form-data",
        authorization: wx.getStorageSync("token")
          ? `Bearer ${wx.getStorageSync("token")}`
          : "",
      },
      success: (res) => {
        let resData = JSON.parse(res.data);
        fileOrderPhoto.push({
          name: resData.fileName,
          type: "image",
          url: BASE_URL + resData.url,
        });
        this.setData({
          orderPhotoList: this.data.orderPhotoList.concat(fileOrderPhoto),
        });
      },
      fail: (data) => {
        console.log("data", data);
      },
      complete: (data) => {
        console.log("data", data);
      },
    });
  },
  handleRemove(e) {
    const { index } = e.detail;
    const { orderPhotoList } = this.data;

    orderPhotoList.splice(index, 1);
    this.setData({
      orderPhotoList,
    });
  },

  onPlatformPicker: function () {
    if (this.data.isRead) {
      return;
    }
    this.setData({
      visible: true,
    });
  },
  onPickerCancel(e) {
    this.setData({
      visible: false,
    });
  },
  onPickerChange(e) {
    const { value, label } = e.detail;
    this.setData({
      visible: false,
      purchasePlatform: value[0],
      platformText: label[0],
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getplatforms: async function (value) {
    let res = await RequestApi.getPlatformList();
    if (res && res.data) {
      this.setData(
        {
          platforms: res.data,
        },
        () => {
          if (value) {
            let { platforms } = this.data;
            platforms.forEach((item) => {
              if (item.dictValue == value) {
                this.setData({
                  platformText: item.dictLabel,
                });
              }
            });
          }
        }
      );
    }
  },
  bindName: function (e) {
    this.setData({
      wxName: e.detail.value,
    });
  },
  bindNumber: function (e) {
    this.setData({
      wxNumber: e.detail.value,
    });
  },
  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value,
    });
  },
  bindOrder: function (e) {
    this.setData({
      actualPayment: e.detail.value,
    });
  },
  bindMoney: function (e) {
    this.setData({
      paymentMoney: e.detail.value,
    });
  },
  bindText: function (e) {
    this.setData({
      remark: e.detail.value,
    });
  },
  errorToast: function (title) {
    wx.showToast({
      title,
      icon: "warn",
      duration: 1000,
    });
  },
  submit: async function () {
    if (this.data.isRead) {
      return;
    }

    let {
      wxName,
      wxNumber,
      phone,
      purchasePlatform,
      actualPayment,
      paymentMoney,
      orderPhotoList,
      remark,
      platformText,
      keyId,
    } = this.data;
    console.log("this.data", this.data);
    let orderPhotoArray = [];
    orderPhotoList.forEach((item, index) => {
      orderPhotoArray.push(item.url);
    });

    if (!wxName) {
      let title = "请填写微信昵称";
      this.errorToast(title);
      return;
    } else if (!wxNumber) {
      let title = "请填写微信号";
      this.errorToast(title);
      return;
    } else if (!phone) {
      let title = "请填写手机号";
      this.errorToast(title);
      return;
    } else if (!platformText) {
      let title = "请选择平台";
      this.errorToast(title);
      return;
    } else if (!actualPayment) {
      let title = "请填写订单号";
      this.errorToast(title);
      return;
    } else if (!paymentMoney) {
      let title = "请填写实付金额";
      this.errorToast(title);
      return;
    } else if (!orderPhotoArray.length) {
      let title = "请上传图片";
      this.errorToast(title);
      return;
    }
    let params = {
      wxName,
      wxNumber,
      phone,
      purchasePlatform,
      actualPayment,
      paymentMoney,
      orderPhoto: orderPhotoArray.join(","),
      remark,
    };
    let res;
    if (keyId) {
      params = {
        ...params,
        keyId,
      };
      res = await RequestApi.applyUpdate(params);
    } else {
      res = await RequestApi.addApply(params);
    }
    if (res && res.code == "200") {
      wx.showToast({
        title: "成功",
        icon: "success",
        duration: 1000,
      });
      wx.navigateTo({ url: "/pages/pointsApplicationList/index" });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
