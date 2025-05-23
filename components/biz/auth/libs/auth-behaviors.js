Object.defineProperty(exports, "__esModule", { value: !0 });
var e = require("tslib"),
  t = e.__importDefault(require("../../../../common/session/index")),
  n = require("@miniprogram-i18n/core/index.js"),
  s = require("../../../../common/mall-tracking/index"),
  o = require("../../../../common/mall-tracking/types"),
  r = require("../../../../interface/authBehavior"),
  i = e.__importDefault(require("../../../../core/base/helpers/toast")),
  a = n.getI18nInstance(),
  u = Behavior({
    data: { hasUser: !1, hasPhone: !1, phonePopupShow: !1 },
    ready: function () {
      this.updateAuthState();
    },
    methods: {
      updateUser: function (n) {
        return e.__awaiter(this, void 0, void 0, function () {
          var r, a, u;
          return e.__generator(this, function (h) {
            switch (h.label) {
              case 0:
                return [4, t.default.getSession()];
              case 1:
                if (
                  (h.sent(),
                  (u = n.detail),
                  (r = u.userInfo),
                  (a = e.__rest(u, ["userInfo"])),
                  !t.default || !n.detail || !n.detail.userInfo)
                )
                  return (
                    s.element({
                      type: o.ElementType.Tap,
                      elementId: "refuse_admin_wechat",
                      name: "拒绝微信号登录小程序",
                    }),
                    [2]
                  );
                wx.showLoading({ title: "" }), (h.label = 2);
              case 2:
                return (
                  h.trys.push([2, 8, , 9]),
                  t.default.hasUid() ? [4, t.default.updateUser(r)] : [3, 4]
                );
              case 3:
                return h.sent(), this.loginSuccess(), [3, 7];
              case 4:
                return [4, t.default.authLogin(a)];
              case 5:
                return h.sent(), [4, t.default.refreshStorage()];
              case 6:
                h.sent(), this.loginSuccess(), (h.label = 7);
              case 7:
                return wx.hideLoading(), this.setData({ hasUser: !0 }), [3, 9];
              case 8:
                throw (
                  ((u = h.sent()),
                  wx.hideLoading(),
                  console.error("更新用户信息失败", u),
                  i.default({
                    message: u.msg || "更新用户信息异常，请稍候重试",
                  }),
                  u)
                );
              case 9:
                return (
                  s.element({
                    type: o.ElementType.Tap,
                    elementId: "admin_wechat_account",
                    name: "微信号登录小程序",
                  }),
                  [2]
                );
            }
          });
        });
      },
      bindPhone: function (e) {
        var n = this;
        if (t.default.getSession() && e.detail) {
          var i = e.detail;
          return (
            wx.showLoading({ title: a.t("components.BizSubmit"), mask: !0 }),
            s.element({
              type: o.ElementType.Tap,
              elementId: "admin_wechat_phone",
              name: "手机号登录小程序",
            }),
            Promise.resolve()
              .then(function () {
                return t.default.bindPhone(i);
              })
              .then(function () {
                wx.hideLoading(),
                  wx.showToast({
                    icon: "none",
                    title: a.t("components.BizLoginSuccess"),
                  }),
                  n.hidePhonePopup(),
                  n.loginSuccess();
              })
              .catch(function (e) {
                if (
                  (wx.hideLoading(),
                  n.hidePhonePopup(),
                  console.error("绑定手机号失败", e),
                  e.code !== r.BindPhoneResCode.BIND_MOBILE_HAS_WECHAT)
                )
                  throw e;
                n.showPhoneErrPopup();
              })
          );
        }
        s.element({
          type: o.ElementType.Tap,
          elementId: "refuse_admin_phone",
          name: "拒绝手机号登录小程序",
        });
      },
      showPhonePopup: function () {
        this.triggerEvent("showPhonePopup");
      },
      hidePhonePopup: function () {
        this.triggerEvent("hidePhonePopup");
      },
      showPhoneErrPopup: function () {
        this.triggerEvent("showPhoneErrPopup");
      },
      loginSuccess: function () {
        this.triggerEvent("loginsuccess");
      },
      updatePhoneSuccess: function () {
        this.triggerEvent("updatephonesuccess");
      },
      updateUserSuccess: function () {
        this.triggerEvent("updateusersuccess");
      },
      updateAuthState: function () {
        return e.__awaiter(this, void 0, void 0, function () {
          var n, s;
          return e.__generator(this, function (e) {
            switch (e.label) {
              case 0:
                return [4, t.default.getSession()];
              case 1:
                return (
                  e.sent(),
                  (n = t.default.hasUser()),
                  (s = t.default.hasPhone()),
                  console.log("hasUser %s, hasPhone %s", n, s),
                  this.setData({ hasUser: n, hasPhone: s }),
                  [2]
                );
            }
          });
        });
      },
    },
  });
exports.default = u;
