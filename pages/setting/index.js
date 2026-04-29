import { BASE_URL } from "../../config/index";
import { RequestApi } from "../../services/api";

Page({
  data: {
    image: "../../images/home/default.png",
    previewAvatar: "../../images/home/default.png",
    visible: false,
    nicknameVisible: false,
    selectedAvatar: "",
    nickName: "",
    nickNameInput: "",
    nicknameInputFocus: false,
    uploading: false,
    nicknameSubmitting: false,
    statusBarHeight: 0,
    navBarHeight: 0,
    BASE_URL,
  },

  onLoad(options) {
    // this.setNavBarHeight();
    const user = wx.getStorageSync("user") || {};
    let image = user.avatar || "";
    const nickName = user.nickName || "";
    if (image) {
      this.setData({ image: BASE_URL + image, previewAvatar: BASE_URL + image });
    }
    this.setData({ nickName, nickNameInput: nickName });
  },

  setNavBarHeight() {
    const sysInfo = wx.getSystemInfoSync();
    const menuBtn = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = sysInfo.statusBarHeight || 0;
    const navBarHeight = (menuBtn.top - statusBarHeight) * 2 + menuBtn.height;
    this.setData({ statusBarHeight, navBarHeight });
  },

  onClose() {
    this.setData({ visible: false, selectedAvatar: "", previewAvatar: this.data.image });
  },

  ensureLogin() {
    const token = wx.getStorageSync("token") || "";
    if (token) {
      return true;
    }
    wx.showToast({
      title: "请先登录后再操作",
      icon: "none",
      duration: 1000,
    });
    setTimeout(() => {
      wx.navigateTo({ url: "/pages/newLogin/index" });
    }, 900);
    return false;
  },

  handleChooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album"],
      success: (res) => {
        const filePath =
          res.tempFilePaths && res.tempFilePaths[0] ? res.tempFilePaths[0] : "";
        if (filePath) {
          this.setData({ selectedAvatar: filePath, previewAvatar: filePath });
        }
      },
    });
  },

  handleChooseWechatAvatar(e) {
    const avatarUrl = (e.detail && e.detail.avatarUrl) || "";
    if (!avatarUrl) {
      wx.showToast({ title: "未获取到微信头像", icon: "none" });
      return;
    }

    if (!/^https?:\/\//i.test(avatarUrl)) {
      this.setData({
        selectedAvatar: avatarUrl,
        previewAvatar: avatarUrl,
      });
      return;
    }

    wx.showLoading({ title: "加载中", mask: true });
    wx.downloadFile({
      url: avatarUrl,
      success: (res) => {
        if (res.statusCode === 200 && res.tempFilePath) {
          this.setData({
            selectedAvatar: res.tempFilePath,
            previewAvatar: avatarUrl,
          });
          return;
        }
        wx.showToast({ title: "头像获取失败", icon: "none" });
      },
      fail: () => {
        wx.showToast({ title: "头像获取失败，请检查下载域名", icon: "none" });
      },
      complete: () => {
        wx.hideLoading();
      },
    });
  },

  onUpload(filePath) {
    if (!filePath) {
      wx.showToast({ title: "请先选择头像", icon: "none" });
      return;
    }
    if (this.data.uploading) {
      return;
    }
    this.setData({ uploading: true });
    wx.uploadFile({
      url: BASE_URL + "/system/user/profile/avatar",
      filePath,
      name: "file",
      formData: {},
      header: {
        "Content-type": "multipart/form-data",
        authorization: wx.getStorageSync("token")
          ? `Bearer ${wx.getStorageSync("token")}`
          : "",
      },
      success: (res) => {
        let resData = {};
        try {
          resData = JSON.parse(res.data || "{}");
        } catch (error) {
          resData = {};
        }

        const code = `${resData.code || ""}`;
        if (code && code !== "200" && code !== "0") {
          wx.showToast({ title: resData.msg || "上传失败，请重试", icon: "none" });
          return;
        }

        const imgUrl =
          resData.imgUrl ||
          (resData.data && resData.data.imgUrl) ||
          (resData.data && resData.data.url) ||
          resData.url ||
          (typeof resData.data === "string" ? resData.data : "");

        if (imgUrl) {
          const latestAvatar = /^https?:\/\//i.test(imgUrl)
            ? imgUrl
            : BASE_URL + imgUrl;
          this.setData({ image: latestAvatar, previewAvatar: latestAvatar, visible: false, selectedAvatar: "" });
          wx.showToast({ title: "头像已更新", icon: "success" });
          this.loadPrePage();
          return;
        }

        wx.showToast({ title: resData.msg || "上传失败，请重试", icon: "none" });
      },
      fail: (err) => {
        wx.showToast({ title: err.errMsg || "上传失败，请重试", icon: "none" });
      },
      complete: () => {
        this.setData({ uploading: false });
      },
    });
  },

  handleConfirmUpload() {
    this.onUpload(this.data.selectedAvatar);
  },

  handleMaskTap() {
    this.onClose();
  },

  stopPropagation() {},

  handleImageError() {
    this.setData({
      image: "../../images/home/default.png",
      previewAvatar: "../../images/home/default.png",
    });
  },

  loadPrePage() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.getUserInfo) {
      prevPage.getUserInfo();
    }
  },

  handlePopup() {
    if (!this.ensureLogin()) {
      return;
    }
    this.setData({
      visible: true,
      nicknameVisible: false,
      selectedAvatar: "",
      previewAvatar: this.data.image,
    });
  },

  handleNicknamePopup() {
    if (!this.ensureLogin()) {
      return;
    }
    this.setData({
      nicknameVisible: true,
      visible: false,
      nickNameInput: this.data.nickName,
      nicknameInputFocus: false,
    });
  },

  handleAddressManage() {
    if (!this.ensureLogin()) {
      return;
    }
    wx.navigateTo({ url: "/pages/addressList/index" });
  },

  onNicknameClose() {
    this.setData({
      nicknameVisible: false,
      nickNameInput: this.data.nickName,
      nicknameInputFocus: false,
    });
  },

  handleNicknameInput(e) {
    this.setData({ nickNameInput: e.detail.value });
  },

  handleNicknameKeyboardConfirm() {
    this.setData({ nicknameInputFocus: false });
  },

  handleGetWechatNickname() {
    this.setData({ nicknameInputFocus: false }, () => {
      this.setData({ nicknameInputFocus: true });
      wx.showToast({
        title: "请点键盘上方的微信昵称",
        icon: "none",
      });
    });
  },

  async handleNicknameConfirm(e) {
    const triggerSource = (e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.source) || "";
    if (triggerSource !== "button") {
      return;
    }

    const value = (this.data.nickNameInput || "").trim();
    if (!value) {
      wx.showToast({ title: "请输入昵称", icon: "none" });
      return;
    }
    if (this.data.nicknameSubmitting) {
      return;
    }
    this.setData({ nicknameSubmitting: true });
    try {
      await RequestApi.profile({ nickName: value });
      const user = wx.getStorageSync("user") || {};
      wx.setStorageSync("user", {
        ...user,
        nickName: value,
      });
      this.setData({
        nickName: value,
        nickNameInput: value,
        nicknameVisible: false,
        nicknameInputFocus: false,
      });
      wx.showToast({ title: "昵称已更新", icon: "success" });
      this.loadPrePage();
    } catch (error) {
      wx.showToast({ title: "昵称更新失败", icon: "none" });
    } finally {
      this.setData({ nicknameSubmitting: false });
    }
  },

  logoutHandler() {
    wx.showModal({
      title: "提示",
      content: "您确定要退出登录!",
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.switchTab({ url: "/pages/myHome/index" });
          // wx.navigateTo({ url: "/pages/newLogin/index" });
        }
      },
    });
  },

  onShow() {},
  onShareAppMessage() {},
});