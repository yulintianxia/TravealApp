// pages/setting/setting.js
import { BASE_URL } from "../../config/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    image: "../../images/home/default.png",
    visible: false,
    cur: {},
    fileList: [],
  },
  onClose: function () {
    this.setData({
      visible: false,
      fileList: [],
    });
  },
  handleAdd: function (e) {
    const { fileList } = this.data;
    const { files } = e.detail;
    // 方法1：选择完所有图片之后，统一上传，因此选择完就直接展示
    this.setData({
      fileList: [...fileList, ...files], // 此时设置了 fileList 之后才会展示选择的图片
    });
    this.onUpload(files);
  },
  onUpload: function (file) {
    const { fileList } = this.data;
    const task = wx.uploadFile({
      url: BASE_URL + "/system/user/profile/avatar", // 仅为示例，非真实的接口地址
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
        this.setData({
          fileList: [...file],
        });
        console.log("data", res);
        let resData = JSON.parse(res.data);
        this.setData({
          image: BASE_URL + resData.imgUrl,
        });
        this.loadPrePage();
      },
      fail: (data) => {
        console.log("data", data);
      },
      complete: (data) => {
        console.log("data", data);
      },
    });
  },
  loadPrePage() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; //获取A页面
    prevPage.getUserInfo();
  },
  handleRemove: function (e) {
    const { index } = e.detail;
    const { fileList } = this.data;
    fileList.splice(index, 1);
    this.setData({
      fileList,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const user = wx.getStorageSync("user");
    let image = user.avatar || "";
    if (image) {
      this.setData({
        image: BASE_URL + image,
      });
    } else {
    }
  },
  handlePopup(e) {
    this.setData({ visible: true });
  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },
  logoutHandler() {
    wx.showModal({
      title: "提示",
      content: "您确定要退出登录!",
      success(res) {
        if (res.confirm) {
          wx.clearStorage();
          wx.navigateTo({
            url: "/pages/login/login",
          });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
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
