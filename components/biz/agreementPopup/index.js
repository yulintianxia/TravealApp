Object.defineProperty(exports, "__esModule", { value: !0 });
var e = require("tslib"),
  t = require("../../../core/base/baseComponent"),
  n = require("../../../core/decorator/index"),
  r = require("@miniprogram-i18n/core/index.js"),
  a = e.__importDefault(require("../../../common/session/index")),
  i = require("../../../common/mall-tracking/index"),
  o = require("../../../common/mall-tracking/types"),
  s = require("../../../services/agreement/index"),
  c = require("../../../utils/base"),
  p = require("../../../config/constants"),
  u = e.__importDefault(require("../../../core/base/helpers/toast")),
  g = e.__importDefault(require("../../../common/navigator")),
  m = require("../../../common/envConfig"),
  l = (function (t) {
    function l() {
      var e = (null !== t && t.apply(this, arguments)) || this;
      return (
        (e.data = {
          showPrivacyPop: !1,
          showMemberRulePop: !1,
          popupTitle: "",
          popupConten: "",
          externalId: "",
          showAlternativeScheme: !1,
          agreeImg: e.staticBaseUrl + "/checkoutPage/",
          agreeImg2: e.staticBaseUrl + "/membership/",
          privacyVip: !1,
          privacyPersonal: !1,
          chartPopupTitle: "",
          chartPopupContent: "",
          chartExternalId: "",
          hasPrivacyPolicy: !1,
          hasUserServiceAgreement: !1,
          hasSDKLink: !1,
          hasShareInformation: !1,
          agreementNameList: {},
          wxPrivacyName: "",
          wxPrivacyContne: "",
          wxPrivacyTitle: "",
          needAuthorization: !1,
          showWxPrivacyPop: !1,
        }),
        (e.agreementList = []),
        (e.behaviors = [r.I18n]),
        e
      );
    }
    return (
      e.__extends(l, t),
      (l.prototype.attached = function () {
        return e.__awaiter(this, void 0, void 0, function () {
          return e.__generator(this, function (e) {
            return [2];
          });
        });
      }),
      (l.prototype.show = function () {
        var t;
        return e.__awaiter(this, void 0, void 0, function () {
          var n, r, u, g, m, l, h, y, E, P, _, v, d, f;
          return e.__generator(this, function (e) {
            switch (e.label) {
              case 0:
                return e.trys.push([0, 11, , 12]), [4, a.default.getSession()];
              case 1:
                return e.sent(), [4, this.getPrivacySetting()];
              case 2:
                return (
                  e.sent(),
                  (_ = a.default.getOpenId()),
                  (n = c.getStorage("handleAgreePrivacy")),
                  (r = !1),
                  n
                    ? [
                        4,
                        s.checkNewAgreement({
                          channel: "mini_program",
                          userSign: _,
                        }),
                      ]
                    : [3, 4]
                );
              case 3:
                (g = e.sent()),
                  (r =
                    null === (t = null == g ? void 0 : g.data) || void 0 === t
                      ? void 0
                      : t.isPopUp),
                  (e.label = 4);
              case 4:
                if (
                  (((f = {})[p.AGREEMENT_TYPE_ENUM.PRIVACY_POLICY] =
                    "《隐私政策》"),
                  (f[p.AGREEMENT_TYPE_ENUM.USER_SERVICE_AGREEMENT] =
                    "《用户服务协议》"),
                  (f[p.AGREEMENT_TYPE_ENUM.SDK] = "《SDK获取个人信息条款》"),
                  (f[p.AGREEMENT_TYPE_ENUM.SHARE_INFORMATION] =
                    "《与第三方共享信息条款》"),
                  (u = f),
                  n && !r)
                )
                  return [3, 9];
                e.label = 5;
              case 5:
                return (
                  e.trys.push([5, 7, , 8]),
                  [
                    4,
                    s.queryByAgreementType(
                      { agreementType: s.AgreementTypeEnum.systemPopup },
                      n ? null : 500
                    ),
                  ]
                );
              case 6:
                return (
                  (g = e.sent()).code === p.RESPONSE_CODE.SUCCESS &&
                    ((E = g.data),
                    (m = E.title),
                    (l = E.content),
                    (h = E.externalId),
                    (P = E.agreementList),
                    (_ = void 0 === P ? [] : P),
                    l
                      ? ((this.agreementList = _),
                        (y = {}),
                        _.forEach(function (e) {
                          y[e.agreementType] = "《" + e.title + "》";
                        }),
                        (f = !!y[p.AGREEMENT_TYPE_ENUM.PRIVACY_POLICY]),
                        (E = !!y[p.AGREEMENT_TYPE_ENUM.USER_SERVICE_AGREEMENT]),
                        (P = !!y[p.AGREEMENT_TYPE_ENUM.SDK]),
                        (_ = !!y[p.AGREEMENT_TYPE_ENUM.SHARE_INFORMATION]),
                        this.setData({
                          popupTitle: m,
                          popupConten: l,
                          externalId: h,
                          showPrivacyPop: !0,
                          hasPrivacyPolicy: f,
                          hasUserServiceAgreement: E,
                          hasSDKLink: P,
                          hasShareInformation: _,
                          privacyVip: !f && !E,
                          privacyPersonal: !P && !_,
                          agreementNameList: y,
                        }))
                      : (console.log("系统弹窗没有内容，使用兜底方案"),
                        this.setData({
                          showPrivacyPop: !0,
                          showAlternativeScheme: !0,
                          hasPrivacyPolicy: !0,
                          hasUserServiceAgreement: !0,
                          hasSDKLink: !0,
                          hasShareInformation: !0,
                          agreementNameList: u,
                        })),
                    getApp().globalData.events.emit("app:agreementShow")),
                  [3, 8]
                );
              case 7:
                return (
                  (v = e.sent()),
                  console.log("接口请求超过500毫秒，弹出兜底方案", v),
                  this.setData({
                    showPrivacyPop: !0,
                    showAlternativeScheme: !0,
                    hasPrivacyPolicy: !0,
                    hasUserServiceAgreement: !0,
                    hasSDKLink: !0,
                    hasShareInformation: !0,
                    agreementNameList: u,
                  }),
                  getApp().globalData.events.emit("app:agreementShow"),
                  [3, 8]
                );
              case 8:
                return (
                  (d = this.agreementList.map(function (e) {
                    return e.title;
                  })),
                  (v = this.agreementList.map(function (e) {
                    return e.agreementId;
                  })),
                  i.element({
                    elementId: "privacy_agreement_popup",
                    type: o.ElementType.Browse,
                    pageTitle: c.getPageTitle() || "山姆会员商店",
                    pageType: c.getCurrentPageType(),
                    pageId: "default",
                    businessId: 0 < v.length ? v.join(",") : "default",
                    businessName: 0 < d.length ? d.join(",") : "default",
                    businessType: "隐私协议弹窗",
                    eventName: "sam_mini_home_privacy_agreement_popup_browse",
                  }),
                  [3, 10]
                );
              case 9:
                this.getNewMemberRule(), (e.label = 10);
              case 10:
                return [3, 12];
              case 11:
                return (
                  (d = e.sent()),
                  this.agreementPopupDone(),
                  console.error(d),
                  [3, 12]
                );
              case 12:
                return [2];
            }
          });
        });
      }),
      (l.prototype.toWxPrivacy = function () {
        wx.openPrivacyContract &&
          g.default.gotoPage("/h5", {
            src: "https://m-sams.walmartmobile.cn/common/help-center/142",
          });
      }),
      (l.prototype.agreePrivacyPolicy = function () {
        return e.__awaiter(this, void 0, void 0, function () {
          var t,
            n,
            r,
            g,
            m,
            l,
            h,
            y,
            E = this;
          return e.__generator(this, function (e) {
            switch (e.label) {
              case 0:
                return (
                  (y = this.data),
                  (t = y.privacyVip),
                  (n = y.privacyPersonal),
                  (r = y.hasPrivacyPolicy),
                  (g = y.hasUserServiceAgreement),
                  (m = y.hasSDKLink),
                  (l = y.hasShareInformation),
                  (h = this.agreementList),
                  t && n
                    ? (((y = {}).privacy_clause = t ? "已勾选" : "未勾选"),
                      (y.information_terms = n ? "已勾选" : "未勾选"),
                      (y = y),
                      !t || r || g || delete y.privacy_clause,
                      !n || m || l || delete y.information_terms,
                      (m = this.agreementList.map(function (e) {
                        return e.title;
                      })),
                      (l = this.agreementList.map(function (e) {
                        return e.agreementId;
                      })),
                      i.element({
                        elementId: "privacy_agreement",
                        type: o.ElementType.Tap,
                        pageTitle: c.getPageTitle() || "山姆会员商店",
                        pageType: c.getCurrentPageType(),
                        pageId: "default",
                        businessType: "隐私协议弹窗",
                        businessId: 0 < l.length ? l.join(",") : "default",
                        businessName: 0 < m.length ? m.join(",") : "default",
                        eventName: "sam_mini_home_privacy_agreement_click",
                        eventValue: y,
                      }),
                      (y = a.default.getOpenId()),
                      (h = h.map(function (e) {
                        return e.externalId;
                      })),
                      (h = {
                        channel: "mini_program",
                        userSign: y,
                        externalIdList: h,
                      }),
                      [4, s.saveAgreeLogin(h)])
                    : (u.default({ message: "请阅读并同意相关条款及协议" }),
                      [2])
                );
              case 1:
                return (
                  e.sent().code === p.RESPONSE_CODE.SUCCESS &&
                    (c.setStorage("handleAgreePrivacy", !0),
                    this.setData({ showPrivacyPop: !1 }, function () {
                      E.getNewMemberRule();
                    })),
                  [2]
                );
            }
          });
        });
      }),
      (l.prototype.getNewMemberRule = function () {
        return e.__awaiter(this, void 0, void 0, function () {
          var t, n, r, a;
          return e.__generator(this, function (e) {
            switch (e.label) {
              case 0:
                return [
                  4,
                  s.checkAgree({
                    agreementType: String(s.AgreementTypeEnum.membershipPop),
                  }),
                ];
              case 1:
                return (
                  (r = e.sent()),
                  (a = r.code),
                  (t = r.data),
                  a !== p.RESPONSE_CODE.SUCCESS || !1 !== t
                    ? [3, 3]
                    : [
                        4,
                        s.queryByAgreementType({
                          agreementType: s.AgreementTypeEnum.membershipPop,
                        }),
                      ]
                );
              case 2:
                return (
                  (r = e.sent()).code === p.RESPONSE_CODE.SUCCESS
                    ? ((a = r.data),
                      (t = a.title),
                      (r = a.content),
                      (a = a.agreementList),
                      t && r
                        ? ((n = {}),
                          a.forEach(function (e) {
                            n[e.agreementType] = "《" + e.title + "》";
                          }),
                          (this.agreementList = a),
                          this.setData({
                            showMemberRulePop: !0,
                            chartPopupTitle: t,
                            chartPopupContent: r,
                            agreementNameList: n,
                          }),
                          (r = a.map(function (e) {
                            return e.title;
                          })),
                          (a = a.map(function (e) {
                            return e.agreementId;
                          })),
                          i.element({
                            elementId: "update_privacy_agreement_popup",
                            type: o.ElementType.Browse,
                            pageTitle: c.getPageTitle() || "山姆会员商店",
                            pageType: c.getCurrentPageType(),
                            pageId: "default",
                            businessId: 0 < a.length ? a.join(",") : "default",
                            businessName:
                              0 < r.length ? r.join(",") : "default",
                            businessType: "更新提醒协议弹窗",
                            eventName:
                              "sam_mini_home_update_privacy_agreement_popup_browse",
                          }))
                        : this.checkWxPrivacy())
                    : this.checkWxPrivacy(),
                  [3, 4]
                );
              case 3:
                this.checkWxPrivacy(), (e.label = 4);
              case 4:
                return [2];
            }
          });
        });
      }),
      (l.prototype.clickMemberKnownBtn = function () {
        return e.__awaiter(this, void 0, void 0, function () {
          var t,
            n,
            r = this;
          return e.__generator(this, function (e) {
            switch (e.label) {
              case 0:
                return (
                  (t = this.agreementList.map(function (e) {
                    return e.title;
                  })),
                  (n = this.agreementList.map(function (e) {
                    return e.agreementId;
                  })),
                  i.element({
                    elementId: "i_know",
                    type: o.ElementType.Tap,
                    pageTitle: c.getPageTitle() || "山姆会员商店",
                    pageType: c.getCurrentPageType(),
                    pageId: "default",
                    businessType: "更新提醒协议弹窗",
                    businessId: 0 < n.length ? n.join(",") : "default",
                    businessName: 0 < t.length ? t.join(",") : "default",
                    eventName: "sam_mini_home_i_know_tap",
                  }),
                  [
                    4,
                    s.consentAgree({
                      agreementType: String(s.AgreementTypeEnum.membershipPop),
                    }),
                  ]
                );
              case 1:
                return (
                  e.sent().code === p.RESPONSE_CODE.SUCCESS
                    ? this.setData({ showMemberRulePop: !1 }, function () {
                        r.agreementPopupDone();
                      })
                    : this.agreementPopupDone(),
                  [2]
                );
            }
          });
        });
      }),
      (l.prototype.agreementPopupDone = function () {
        setTimeout(function () {
          getApp().globalData.events.emit("app:agreementPopupDone"),
            (getApp().globalData[p.AGREE_PRIVACY_POPUP_ALREADY_SHOWN] = !0);
        }, 200);
      }),
      (l.prototype.togglePrivacyVipTerms = function () {
        this.setData({ privacyVip: !this.data.privacyVip });
      }),
      (l.prototype.togglePrivacyPersonalTerms = function () {
        this.setData({ privacyPersonal: !this.data.privacyPersonal });
      }),
      (l.prototype.toPrivacyPolicy = function () {
        var e = this.getLinkByType(p.AGREEMENT_TYPE_ENUM.PRIVACY_POLICY);
        g.default.gotoPage("/h5", { src: e });
      }),
      (l.prototype.toSDKLink = function () {
        var e = this.getLinkByType(p.AGREEMENT_TYPE_ENUM.SDK);
        g.default.gotoPage("/h5", { src: e });
      }),
      (l.prototype.toMemberRules = function () {
        var e = this.getLinkByType(p.AGREEMENT_TYPE_ENUM.MEMBERSHIP_CHARTER);
        g.default.gotoPage("/h5", { src: e });
      }),
      (l.prototype.toUserServiceAgreement = function () {
        var e = this.getLinkByType(
          p.AGREEMENT_TYPE_ENUM.USER_SERVICE_AGREEMENT
        );
        g.default.gotoPage("/h5", { src: e });
      }),
      (l.prototype.toShareInformation = function () {
        var e = this.getLinkByType(p.AGREEMENT_TYPE_ENUM.SHARE_INFORMATION);
        g.default.gotoPage("/h5", { src: e });
      }),
      (l.prototype.agreementLink = function (e) {
        (e = e.detail.href),
          g.default.gotoPage("/h5", { src: encodeURIComponent(e) });
      }),
      (l.prototype.getLinkByType = function (e) {
        var t = this.agreementList,
          n = c.getSystemLanguage(),
          r =
            m.getEnvConfig().h5Host +
            "/common/terms-of-agreement?agreementType=" +
            e +
            "&language=" +
            n;
        return (
          t.forEach(function (t) {
            t.agreementType === e && (r = t.url);
          }),
          encodeURIComponent(r)
        );
      }),
      (l.prototype.checkWxPrivacy = function () {
        return e.__awaiter(this, void 0, void 0, function () {
          var t;
          return e.__generator(this, function (e) {
            switch (e.label) {
              case 0:
                return e.trys.push([0, 2, , 3]), [4, this.getPrivacySetting()];
              case 1:
                return (
                  void 0 !== (t = e.sent().needAuthorization) && t
                    ? this.setData({ showWxPrivacyPop: !0 })
                    : this.agreementPopupDone(),
                  [3, 3]
                );
              case 2:
                return e.sent(), this.agreementPopupDone(), [3, 3];
              case 3:
                return [2];
            }
          });
        });
      }),
      (l.prototype.agreeWxPrivacy = function () {
        this.setData({ showWxPrivacyPop: !1 }), this.agreementPopupDone();
      }),
      (l.prototype.handleVisitor = function () {
        g.default.gotoPage("/pages/visitor/index");
      }),
      (l.prototype.getPrivacySetting = function () {
        var t = this;
        return new Promise(function (n, r) {
          wx.getPrivacySetting
            ? wx.getPrivacySetting({
                success: function (r) {
                  return e.__awaiter(t, void 0, void 0, function () {
                    var t, a, i, o;
                    return e.__generator(this, function (e) {
                      switch (e.label) {
                        case 0:
                          if (
                            (console.log("当前用户隐私情况", r),
                            (t = r.privacyContractName),
                            !(a = r.needAuthorization))
                          )
                            return [3, 5];
                          e.label = 1;
                        case 1:
                          return (
                            e.trys.push([1, 3, , 4]),
                            [
                              4,
                              s.queryByAgreementType({
                                agreementType: s.AgreementTypeEnum.wxPrivacy,
                              }),
                            ]
                          );
                        case 2:
                          return (
                            (i = e.sent()).code === p.RESPONSE_CODE.SUCCESS &&
                              ((o = i.data),
                              (i = o.title),
                              (o = o.content),
                              this.setData(
                                {
                                  wxPrivacyName: t,
                                  wxPrivacyContne:
                                    null == o
                                      ? void 0
                                      : o.replaceAll("{{协议名称}}", t),
                                  wxPrivacyTitle: i,
                                  needAuthorization: a,
                                },
                                function () {
                                  return n({ needAuthorization: a });
                                }
                              )),
                            [3, 4]
                          );
                        case 3:
                          return (
                            e.sent(),
                            this.setData(
                              {
                                wxPrivacyName: t,
                                wxPrivacyContne:
                                  null === p.BASE_PRIVACY_TEXT ||
                                  void 0 === p.BASE_PRIVACY_TEXT
                                    ? void 0
                                    : p.BASE_PRIVACY_TEXT.replaceAll(
                                        "{{协议名称}}",
                                        t
                                      ),
                                wxPrivacyTitle: p.BASE_PRIVACY_TITLE,
                                needAuthorization: a,
                              },
                              function () {
                                return n({ needAuthorization: a });
                              }
                            ),
                            [3, 4]
                          );
                        case 4:
                          return [3, 6];
                        case 5:
                          n({ needAuthorization: a }), (e.label = 6);
                        case 6:
                          return [2];
                      }
                    });
                  });
                },
                fail: function () {
                  console.log("查询隐私失败"), r();
                },
              })
            : n();
        });
      }),
      e.__decorate([n.wxComponent()], l)
    );
  })(t.BaseComponent);
exports.default = l;
