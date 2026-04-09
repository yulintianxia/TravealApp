// pages/addressList/index.js
import { RequestApi } from "../../services/api.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressList: [], // 这是地址列表接口
    pageNum: 1,
    pageSize: 10,
    labelList: ["家", "公司", "学校"],
    statusBarHeight: 0,
    navBarHeight: 44,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setNavBarHeight();
  },

  setNavBarHeight() {
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

    this.setData({
      statusBarHeight,
      navBarHeight,
    });
  },

  /* 跳转到编辑地址的页面 */
  editAddress(e) {
    wx.navigateTo({
      url: "/pages/address/index",
      success: (res) => {
        // 跳转成功后，触发事件'delivery', 并可携带数据（即第一个参数是事件名，第二个参数是数据包）
        res.eventChannel.emit("delivery", {
          editData: e.currentTarget.dataset.item,
        });
      },
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  deleteAddress(e){
    let KeyId = e.currentTarget.dataset.id;
    console.log('KeyId', KeyId);
    let that= this;
    wx.showModal({
      title: '删除',
      content: '您确定要删除这条地址?',
      async success(res) {
        if (res.confirm) {
           let res = await RequestApi.deleteAddress(KeyId);
           if (res && res.code == 200) {
            wx.showToast({
              title: "删除成功",
              icon: "none",
            });
            that.getAddressList();
           }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getAddressList();
  },
  async getAddressList() {
    let params = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
    };
    let res = await RequestApi.addressList(params);
    if (res && res.data) {
      this.setData({
        addressList: res.data,
      });
    }
  },
  submit() {
    wx.navigateTo({ url: "/pages/address/index" });
  },

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
