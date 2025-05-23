// pages/vip/vip.js
import { commonBaseUrl } from "../../config/index";
import { BASE_URL } from "../../config/index";
import { RequestApi } from "../../services/api";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showTab: true,
    showBgWhite: false,
    hideBlackIcon: false,
    settingIconStyle:
      "--width:28px;--height:28px;--icon-left:245px;--icon-top:26px",
    // settingIconV2:'commonBaseUrl" + "/becomeMember/setting-icon-with-border.png"
    settingIconV2: commonBaseUrl + "/becomeMember/setting-icon-with-border.png",
    settingIcon: commonBaseUrl + "/becomeMember/setting-icon.png",
    memberType: ["primary"][0], // 数组
    showEnterpriseName: false,
    staticBaseUrl: commonBaseUrl + "/becomeMember",
    navBarheight: "40rpx",
    current: 0,
    isBenefitExpanded: false,
    benefitMinLength: 8,
    dotCurrent: 0,
    currentIcon: commonBaseUrl + "/decoration/swiper-icon.png",
    defaultIcon: commonBaseUrl + "/decoration/swiper-icon-black.png",
    goodsListMinLength: 4,
    levelList: [],
    bgUrl: "",
    BASE_URL,
    NavList: [],
    goodsListMinLength: 2,
    // vipData:null,
    vipData: null,
    vipTitle: "正莲VIP会员卡",
    levelId: "",
    defaultPerson: "../../images/home/default.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.myhomeData();
  },
  myhomeData() {
    const eventChannel = this.getOpenerEventChannel();
    // 监听'delivery'事件，并获取数据包
    if (eventChannel) {
      eventChannel.on("vipData", (data) => {
        console.log("data", data.vipData);
        this.setData(
          {
            vipData: data.vipData,
          },
          () => {
            this.getCardAll();
          }
        );
      });
    }
  },

  async getCardAll() {
    let res = await RequestApi.getAllLevel();
    if (res && res.code == "200" && res.data.length) {
      this.setData(
        {
          levelList: res.data,
        },
        () => {
          this.getNav(res.data);
        }
      );
    }
  },
  getNav(res) {
    let NavList = [];
    console.log("this.data.levelList", this.data.levelList);
    this.data.levelList.forEach((item, index) => {
      NavList.push({
        name: item.name,
        keyId: item.keyId,
        list: [
          {
            title: "徽章",
            subTitle: "会员徽章",
            icon: "../../images/home/grade.png",
            url: "/badge",
          },
          {
            title: "礼品",
            subTitle: "会员礼品",
            icon: "../../images/home/gift.png",
            url: "/gift",
          },
        ],
      });

      console.log("tem.keyId", item.keyId, this.data.vipData.levelId);

      if (item.keyId == this.data.vipData.levelId) {
        this.setData({
          current: index,
          bgUrl: `url(${BASE_URL}${res[index].background})`,
        });
      }
    });
    this.setData(
      {
        NavList,
      },
      () => {
        this.setChildData();
      }
    );
  },
  onPageScroll: function (e) {
    if ((e = 40 && e.scrollTop != this.data.showBgWhite)) {
      this.setData({ showBgWhite: e });
    }
  },
  swiperChange: function (e) {
    this.setData(
      {
        current: e.detail.current,
      },
      () => {
        this.setData({
          bgUrl: `url(${BASE_URL}${
            this.data.levelList[this.data.current].background
          })`,
        });
      }
    );
  },
  setChildData(current = 0) {
    this.data.NavList.forEach((item, index) => {
      let Child = this.selectComponent(".rightList" + index);
      console.log("item", item);
      Child.getData(this.data.NavList, item.name, item.list, item.keyId);
    });
  },
  gotoSettingRules: function (e) {},
  adChange: function (e) {
    this.setData({ dotCurrent: e.detail.current });
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
