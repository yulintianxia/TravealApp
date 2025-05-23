import {
  ctripImg,
  PIC_COMMON_PATH
} from '../config/index';


export const userConfig = {
  relateOrderListDataFromLayer: {
    entryUrl: "/pages/myctrip/list/list",
    id: "relateOrderSearch",
    traceId: "c_click_myctrip_wx_pop",
    needLogin: !1,
  },
  relateOrderListDataFromColumn: {
    entryUrl: "/pages/myctrip/list/list",
    id: "relateOrderSearch",
    traceId: "c_click_myctrip_wx_order",
    needLogin: !1,
  },
  mobileSearchListData: {
    entryUrl: "/pages/myctrip/list/mobilesearchlist/mobilesearchlist",
    id: "c_click_list_mobile",
    metricId: "手机查单入口",
  },
  avatar: {
    defaultImgUrl: "",
    entryUrl: "".concat(ctripImg, "webapp/h5myinfo/myinfo?isHideHeader=true"),
    id: "c_click_myctrip_avatar",
    metricId: "头像",
  },
  vipLevel: {
    title: "普通会员",
    entryUrl: "".concat(ctripImg, "webapp/member/growup?isHideNavBar=YES"),
    id: "c_click_member_center",
    metricId: "会员",
    isShow: !0,
  },
  toVerify: {
    title: "去实名",
    entryUrl:
      "/pages/wallet/setrealname/index?pageSource=ctripwechatmini_ctriphome",
    id: "c_click_user_verify",
    isShow: !0,
    metricId: "去实名",
  },
  userVerify: {
    title: "已认证",
    entryUrl:
      "/pages/wallet/setrealname/index?pageSource=ctripwechatmini_ctriphome",
    id: "c_click_user_verify",
    isShow: !0,
    metricId: "已认证",
  },
  favorite: {
    title: "我的收藏",
    entryUrl: "".concat(ctripImg, "webapp/favorite/index"),
    id: "c_click_favorite",
    isShow: !0,
    metricId: "我的收藏",
  },
  point: {
    title: "积分",
    entryUrl: "/pages/market/signIn/index?activityid=wechat_signin_activity",
    id: "c_click_myctrip_coins",
    isShow: !0,
    metricId: "积分",
  },
  coupon: {
    title: "优惠券",
    entryUrl: "/pages/market/promocode/index/index",
    id: "c_click_coupon",
    isShow: !0,
    metricId: "优惠券",
  },
  setting: {
    title: "设置",
    entryUrl: "/cwx/component/messageRecommend/index",
    id: "c_click_myctrip_setup",
    needLogin: !1,
    metricId: "设置",
  },
  signIn: {
    title: "签到",
    entryUrl: "/pages/market/signIn/index?activityid=wechat_signin_activity",
    id: "c_click_sign_in",
    needLogin: !0,
    metricId: "签到",
  },
  userHome: {
    title: "个人主页",
    entryUrl: "".concat(
      ctripImg,
      "webapp/you/tripshoot/user/home?seo=0&isHideHeader=true&isHideNavBar=YES&isMini=2"
    ),
    id: "c_click_myctrip_shequ",
    needLogin: !0,
    metricId: "个人主页",
  },
  orders: [
    {
      title: "全部订单",
      // iconUrl: "".concat(PIC_COMMON_PATH, "0zc16120008iiysyt68E1.png"),
      iconUrl: "../../images/home/allOrder.png",
      entryUrl: "../list/list",
      newEntryUrl: "../taro/list/list",
      id: "all",
      metricId: "全部订单",
    },
    {
      title: "待发货",
      iconUrl: "../../images/home/sendOrder.png",
      entryUrl: "../list/list",
      newEntryUrl: '../taro/list/list?data={"id":"unPaid"}',
      id: "unpaid",
      metricId: "待发货",
    },
    {
      title: "待收货",
      iconUrl: "../../images/home/waitOrder.png",
      entryUrl: "../list/list",
      newEntryUrl: '../taro/list/list?data={"id":"unTravel"}',
      id: "untravel",
      metricId: "待收货",
    },
    {
      title: "已完成",
      iconUrl: "../../images/home/finish.png",
      entryUrl: "../list/list",
      newEntryUrl: '../taro/list/list?data={"id":"unReview"}',
      id: "unreview",
      metricId: "已完成",
    },
  ],
  activityCenter: [],
  activityCenterMore: {},
  activityCenterTitle: "",
  tools: [
    {
      title: "我的钱包",
      iconUrl:
        "https://pic.c-ctrip.com/platform/h5/mini_programe/paywallet.png",
      entryUrl:
        "https://secure.ctrip.com/webapp/paywallet/wechatminimywallet?sceneid=wechatmini_myctrip",
      id: "c_click_myctrip_paywallet",
      needLogin: !0,
      metricId: "我的钱包",
    },

    {
      title: "旅行足迹",
      iconUrl: "".concat(PIC_COMMON_PATH, "0zc611200088kbdsz32DC.png"),
      entryUrl: "".concat(
        ctripImg,
        "webapp/mytravels/travelsforactivity?source=myctrip"
      ),
      id: "c_click_wxmp_my_travels",
      needLogin: !0,
      metricId: "旅行足迹",
    },
    {
      title: "关注公众号",
      iconUrl: "https://pic.c-ctrip.com/platform/h5/mini_programe/mp.png",
      entryUrl: "https://mp.weixin.qq.com/s/xIxkRbYIEB8cMmFZmoReYA",
      id: "c_click_mp",
      needLogin: !1,
      metricId: "关注公众号",
    },
    {
      title: "咨询客服",
      iconUrl: "https://images4.c-ctrip.com/target/zc0b1f000001gnd876DCA.png",
      entryUrl: "https://m.ctrip.com/webapp/servicechatv3/callcenter",
      id: "c_click_servicechat",
      needLogin: !0,
      metricId: "咨询客服",
    },
  ],
  businessLicense: {
    title: "营业执照",
    entryUrl: "".concat(
      ctripImg,
      "webapp/mytravels/travelsforactivity?source=myctrip"
    ),
    id: "c_click_business_license",
    metricId: "营业执照",
    isShow: !0,
  },
};
