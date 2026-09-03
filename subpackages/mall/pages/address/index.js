// pages/my/my-add-address/index.js
import { RequestApi } from "../../../../services/api.js";
let app = getApp();
Page({
  /**
   * 控件当前显示的数据
   * provinces:所有省份
   * citys 选择省对应的所有市,
   * areas 选择市对应的所有区
   * consigneeRegion：点击确定时选择的省市县结果
   * animationAddressMenu：动画
   * addressMenuIsShow：是否可见
   */
  /**
   * 页面的初始数据
   */
  data: {
    // animationAddressMenu: {},
    // value: [0, 0, 0],
    // provinces: [],
    // citys: [],
    // areas: [],
    // consigneeName: "",
    // phone: "",
    // consigneeRegion: "",
    // detailedAddress: "",
    // labelList: ["家", "公司", "学校"],            //标签
    // labelDefault: 0,              // 标签默认,
    labelList: ["家", "公司", "学校", "暂无"],
      statusBarHeight: 0,
     navBarHeight: 0,
    addressMenuIsShow: false,
    provinces: "",
    citys: "",
    county: "",
    town: "",
    detailedAddress: "", // 详细地址
    cascadeAddrss: "", // 级联地址
    consigneeName: "", // 收货人姓名
    consigneePhone: "", //收货人电话
    label: "", // 标签
    labelDefault: 3,
    isDefault: 0,
    custome: [1, 0],
    keyId: "",
  },
  consigneeNameInput: function (e) {
    this.setData({
      consigneeName: e.detail.value,
    });
  },
  phoneInput: function (e) {
    this.setData({
      consigneePhone: e.detail.value,
    });
  },
  consigneeRegionInput: function (e) {
    this.setData({
      cascadeAddrss: e.detail.value,
    });
  },

  detailedAddressInput: function (e) {
    this.setData({
      detailedAddress: e.detail.value,
    });
  },
  chooseLabelSelect: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      labelDefault: index,
    });
  },
  handleChange: function (e) {
    console.log("e", e);
    this.setData({
      isDefault: e.detail.value,
    });
    console.log(this.data.isDefault);
  },
  submit: async function () {
    let consigneeName = this.data.consigneeName;
    console.log(consigneeName);
    let consigneePhone = this.data.consigneePhone;
    // let consigneeRegion = this.data.consigneeRegion;
    let detailedAddress = this.data.detailedAddress;
    let isDefault = this.data.isDefault;
    let labelDefault = this.data.labelDefault;
    if (consigneeName == "") {
      wx.showToast({
        title: "请输入姓名",
        icon: "none",
      });
      return false;
    } else if (consigneePhone == "") {
      wx.showToast({
        title: "请输入手机号码",
        icon: "none",
      });
      return false;
    } else if (detailedAddress == "") {
      wx.showToast({
        title: "请输入详细地址",
        icon: "none",
      });
      return false;
    } else {
      let res;
      let addressInfo = {
        consigneeName,
        consigneePhone,
        detailedAddress,
        label: labelDefault,
        isDefault,
      };
      if (this.data.keyId) {
        addressInfo = {
          ...addressInfo,
          keyId: this.data.keyId,
        };
        res = await RequestApi.editAddress(addressInfo);
      } else {
        res = await RequestApi.address(addressInfo);
      }

      if (res && res.code == 200) {
        wx.navigateTo({ url: "/subpackages/mall/pages/addressList/index" });
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 新增：计算导航栏高度
  const sysInfo = wx.getSystemInfoSync();
  let menuBtn = null;
  try {
    menuBtn = wx.getMenuButtonBoundingClientRect();
  } catch (error) {
    menuBtn = null;
  }
  const statusBarHeight = sysInfo.statusBarHeight || 0;
  const navBarHeight = menuBtn
    ? (menuBtn.top - statusBarHeight) * 2 + menuBtn.height
    : 44;
  this.setData({ statusBarHeight, navBarHeight });
    this.setData({
      keyId: "",
    });
    const eventChannel = this.getOpenerEventChannel();
    // 监听'delivery'事件，并获取数据包
    if (eventChannel) {
      eventChannel.on("delivery", (data) => {
        let {
          consigneeName,
          consigneePhone,
          detailedAddress,
          label,
          isDefault,
          keyId,
        } = data.editData;

        this.setData({
          consigneeName,
          consigneePhone,
          detailedAddress,
          labelDefault: Number(label),
          isDefault: Number(isDefault),
          keyId,
        });
      });
    }
  },
  // 点击所在地区弹出选择框
  select: function (e) {
    // 如果已经显示，不在执行显示动画
    // if (this.data.addressMenuIsShow) {
    //   return false;
    // } else {
    //   // 执行显示动画
    //   // this.startAddressAnimation(true);
    //    this.setData({
    //     addressMenuIsShow: t
    //    })
    // }
    this.setData({
      addressMenuIsShow: true,
    });
    console.log("data", this.data.addressMenuIsShow);
  },
  // // 执行动画
  // startAddressAnimation: function (isShow) {
  //   if (isShow) {
  //     // vh是用来表示尺寸的单位，高度全屏是100vh
  //     this.animation.translateY(0 + "vh").step();
  //   } else {
  //     this.animation.translateY(40 + "vh").step();
  //   }
  //   this.setData({
  //     animationAddressMenu: this.animation.export(),
  //     addressMenuIsShow: isShow,
  //   });
  // },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false);
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    let that = this;
    let city = that.data.city;
    let value = that.data.value;
    this.startAddressAnimation(false);
    // 将选择的城市信息显示到输入框
    let consigneeRegion =
      that.data.provinces[value[0]].name +
      "-" +
      that.data.citys[value[1]].name +
      "-" +
      that.data.areas[value[2]].name;
    that.setData({
      consigneeRegion: consigneeRegion,
    });
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    let value = e.detail.value;
    let provinces = this.data.provinces;
    let citys = this.data.citys;
    let areas = this.data.areas;
    let provinceNum = value[0];
    let cityNum = value[1];
    let countyNum = value[2];
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
      let id = provinces[provinceNum].id;
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      });
    } else if (this.data.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      let id = citys[cityNum].id;
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      });
    } else {
      // 滑动选择了区
      this.setData({
        value: [provinceNum, cityNum, countyNum],
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: "linear",
    });
    this.animation = animation;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
