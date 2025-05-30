// pages/vipMemer/index.js
import { BASE_URL, baseImageUrl} from "../../config/index";
import { RequestApi } from "../../services/api";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    levelList: [],
    imgUrl: "",
    pointsTotal: 0, //总积分
    pointsBalance: 0,
    pointsStart: 0,
    levelId: 0,
    top: 0, // 排行榜
    medalCount: 0,
    backGroundImg: "",
    BASE_URL,
    noLogin: false,
    baseImageUrl,    
  },
  turnHome: function () {
    if (!this.data.noLogin) {
      wx.switchTab({ url: "/pages/myHome/index" });
    } else {
      this.turnModal("/pages/login/login");
    }
  },
  turnModal: function (url) {
    wx.showModal({
      title: "提示",
      content: "当前账号未登录, 请先登录！",
      success(res) {
        if (res.confirm) {
          wx.navigateTo({ url });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },

  turnTop: function () {
    if (!this.data.noLogin) {
      wx.navigateTo({ url: "/pages/pointrank/index" });
    } else {
      this.turnModal("/pages/login/login");
    }
  },
  turnPoint: function () {
    if (!this.data.noLogin) {
      wx.navigateTo({ url: "/pages/pointUse/index" });
    } else {
      this.turnModal("/pages/login/login");
    }
  },
  /* 跳转到徽章的页面 */
  turnBadge: function () {
    if (this.data.medalCount) {
      if (!this.data.noLogin) {
        wx.switchTab({ url: "/pages/myHome/index" });
      } else {
        this.turnModal("/pages/login/login");
      }
    }
  },
  turnMyBadge: function () {
    if (!this.data.noLogin) {
      if (this.data.medalCount) {
        this.seeDetails("/myBadge");
      }
    } else {
      this.turnModal("/pages/login/login");
    }
  },
  seeDetails: function (url) {
    if (!this.data.noLogin) {
      this.turnWebView(url);
    } else {
      this.turnModal("/pages/login/login");
    }
  },
  catchtouchmove: function () {
    return false;
  },
  swiperChange(e) {
    this.setData({
      current: e.detail.current,
      backGroundImg:
        BASE_URL + this.data.levelList[e.detail.current].background,
      pointsStart: this.data.levelList[e.detail.current].pointsStart,
      levelId: this.data.levelList[e.detail.current].keyId,
    });
  },

  swiperPre() {
    this.setData({
      current: this.data.current - 1,
      backGroundImg:
        BASE_URL + this.data.levelList[this.data.current - 1].background,
      pointsStart: this.data.levelList[this.data.current - 1].pointsStart,
      levelId: this.data.levelList[this.data.current - 1].keyId,
    });
  },
  swiperNext() {
    this.setData({
      current: this.data.current + 1,
      backGroundImg:
        BASE_URL + this.data.levelList[this.data.current + 1].background,
      pointsStart: this.data.levelList[this.data.current + 1].pointsStart,
      levelId: this.data.levelList[this.data.current + 1].keyId,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */

  getSwiperList: async function () {
    let res = await RequestApi.getAllLevel();
    if (res && res.code == "200" && res.data.length) {
      this.setData(
        {
          levelList: res.data,
        },
        () => {
          if (this.data.levelId == 0) {
            this.setData({
              current: 0,
              backGroundImg: BASE_URL + this.data.levelList[0].background,
              pointsStart: this.data.levelList[0].pointsStart,
            });
            return;
          }
          this.data.levelList.forEach((item, index) => {
            if (item.keyId == this.data.levelId) {
              this.setData({
                current: index,
                backGroundImg: BASE_URL + this.data.levelList[index].background,
                pointsStart: this.data.levelList[index].pointsStart,
              });
            }
          });
        }
      );
    }
  },
  onLoad(options) {
    this.getGrade();
  },

  turnWebView: function (url) {
    wx.navigateTo({
      url: "/pages/webView/index",
      success: (res) => {
        // 跳转成功后，触发事件'delivery', 并可携带数据（即第一个参数是事件名，第二个参数是数据包）
        res.eventChannel.emit("webViewData", {
          url,
          levelId: this.data.levelId,
        });
      },
    });
  },

  turnBadgePage: function (e) {
    // this.seeDetails("/badge");
    this.turnWebView("/badge");
  },
  turnGiftPage: function (e) {
    // this.seeDetails("/gift");
    this.turnWebView("/gift");
  },

  async getGrade() {
    let config = {
      isNoTurn: true,
    };
    try {
      let res = await RequestApi.getGrade({}, config);
      if (res && res.code == "200") {
        this.setData({});
        this.setData(
          {
            pointsTotal: res.data.pointsTotal,
            pointsBalance: res.data.pointsBalance,
            levelInfo: res.data.levelInfo,
            levelId: res.data.levelId ? res.data.levelId : 0,
            top: res.data.top,
            medalCount: res.data.medalCount,
            noLogin: false,
            // pointsStart: res.data.pointsStart
          },
          () => {
            this.getSwiperList();
          }
        );
      } else {
        console.log('cessss',111);
        wx.showToast({
          title: response.data.msg,
          duration: 2000,
          icon: "none",
          mask: false,
        });
      }
    } catch (error) {
      console.log('error',error);
      if (error == 401) {
        // this.isNoTurn = true;
        this.setData({ noLogin: true });
        this.getSwiperList();
      }
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
