import { BASE_URL } from "../../config/index";

Page({
  data: {
    image: "../../images/home/default.png",
    visible: false,
    cur: {},
    fileList: [],
    statusBarHeight: 0,
    navBarHeight: 0,
    BASE_URL,
  },

  onLoad(options) {
    // this.setNavBarHeight();
    const user = wx.getStorageSync("user");
    let image = user.avatar || "";
    if (image) {
      this.setData({ image: BASE_URL + image });
    }
  },

  setNavBarHeight() {
    const sysInfo = wx.getSystemInfoSync();
    const menuBtn = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = sysInfo.statusBarHeight || 0;
    const navBarHeight = (menuBtn.top - statusBarHeight) * 2 + menuBtn.height;
    this.setData({ statusBarHeight, navBarHeight });
  },

  onClose() {
    this.setData({ visible: false, fileList: [] });
  },

  handleAdd(e) {
    const { fileList } = this.data;
    const { files } = e.detail;
    this.setData({ fileList: [...fileList, ...files] });
    this.onUpload(files);
  },

  onUpload(file) {
    wx.uploadFile({
      url: BASE_URL + "/system/user/profile/avatar",
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
        this.setData({ fileList: [...file] });
        let resData = JSON.parse(res.data);
        this.setData({ image: BASE_URL + resData.imgUrl });
        this.loadPrePage();
      },
    });
  },

  loadPrePage() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.getUserInfo) {
      prevPage.getUserInfo();
    }
  },

  handleRemove(e) {
    const { index } = e.detail;
    const { fileList } = this.data;
    fileList.splice(index, 1);
    this.setData({ fileList });
  },

  handlePopup() {
    this.setData({ visible: true });
  },

  onVisibleChange(e) {
    this.setData({ visible: e.detail.visible });
  },

  logoutHandler() {
    wx.showModal({
      title: "提示",
      content: "您确定要退出登录!",
      success(res) {
        if (res.confirm) {
          wx.clearStorage();
          wx.navigateTo({ url: "/pages/login/login" });
        }
      },
    });
  },

  onShow() {},
  onShareAppMessage() {},
});