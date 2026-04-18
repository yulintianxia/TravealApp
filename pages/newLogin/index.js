// pages/newLogin/index.js
import { RequestApi } from "../../services/api.js";
import { BASE_URL } from "../../config/index.js";

Page({
  data: {
    agreed: false,
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },

  onLoginBeforeAgree() {
    wx.showModal({
      title: "提示",
      content: "请先阅读并勾选平台协议和隐私政策",
      showCancel: false,
      confirmText: "我知道了",
    });
  },

  async oneClicklogin(e) {
    const { encryptedData, iv, errMsg } = e.detail;
    if (errMsg !== "getPhoneNumber:ok") {
      wx.showToast({ title: "授权失败，请重新操作", icon: "none" });
      return;
    }

    try {
      wx.showLoading({ title: "登录中...", mask: true });

      const loginRes = await wx.login({ timeout: 5000 });
      if (loginRes.code) {
          console.log('loginRes',loginRes);

        let res = await RequestApi.loginByWeiXinCode({ code: loginRes.code });
        if (res.statusCode === 200 && res.data.code === 0) {
          wx.setStorageSync("token", res.token);
          wx.setStorageSync("isSetAvatar", res.isSetAvatar);
          wx.switchTab({ url: "/pages/myHome/index" });
        } else {
          wx.showToast({ title: res.data.msg || "登录失败", icon: "none" });
        }
      } else {
        throw new Error("获取code失败：" + loginRes.errMsg);
      }
    } catch (error) {
      console.error("登录异常：", error);
      wx.showToast({ title: "登录出错，请重试", icon: "none" });
    } finally {
      wx.hideLoading();
    }
  },

  goPhoneLogin() {
    if (!this.data.agreed) {
      wx.showModal({
        title: "提示",
        content: "请先阅读并勾选平台协议和隐私政策",
        showCancel: false,
        confirmText: "我知道了",
      });
      return;
    }
    wx.navigateTo({ url: "/pages/login/login" });
  },

  openServiceAgreement() {
    wx.navigateTo({
      url: "/pages/webView/index",
      success: (res) => {
        res.eventChannel.emit("webViewData", {
          url: "/common/terms-of-agreement?agreementType=MEMBERSHIP_CHARTER",
        });
      },
    });
  },

  openPrivacyPolicy() {
    wx.navigateTo({
      url: "/pages/webView/index",
      success: (res) => {
        res.eventChannel.emit("webViewData", {
          url: "/common/terms-of-agreement?agreementType=PRIVACY_POLICY",
        });
      },
    });
  },

  onLoad(options) {},
  onReady() {},
  onShow() {},
});
