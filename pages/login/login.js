// pages/login/login.js
import { RequestApi } from "../../services/api.js";
import { BASE_URL } from "../../config/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholderStyleColor: "color:#B1B2B2",
    phoneLength: 11,
    codeLength: 100,
    codeNum: "",
    isSubmit: false,
    username: "",
    password: "",
    type: "LOGIN",
    // type:'REGISTER',
    nickName: "", //用户名，
    oldPassword: "",
    newPassword: "",
    isSend:false,
    phoneNumber:'',
    times:60,
    avatar: '../../images/home/default.png'
  },
  // 发送code
  bindCode(){
      if(this.data.phoneNumber.length<11){
        wx.showToast({
          title: '授权失败，请重新操作',
          icon: 'none'
        });
        return;
      }

  },
  /* 获取电话号码 */
  sendCode(){
    
     if(this.data.phoneNumber.length !=11){
      wx.showToast({
        title: '请填写正确的电话号码',
        icon: 'none'
      });
      return 
     }
     if(this.data.times !=60){
       return 
     }
     this.setData({
      isSend:true
     })
     let interval1 = setInterval(()=>{
      console.log('times',this.data.times);
      this.setData({
        times: this.data.times -1
      })
      if(this.data.times==0) {
        clearInterval(interval1);
        this.setData({
          isSend:false,
          times:60
         })
      }
    },980)



  },
  /* 电话号码 */
  onPhoneInput(e){
    this.setData({
      phoneNumber: e.detail.value,
    });
  },
  bindPhone: function (e) {
    this.setData({
      username: e.detail.value,
    });
  },
  async oneClicklogin(e) {
    const { encryptedData, iv, errMsg } = e.detail;
    // 1. 授权失败处理
    if (errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({
        title: '授权失败，请重新操作',
        icon: 'none'
      });
      return;
    }

    try {
      // 1. 显示加载提示
      wx.showLoading({
        title: "登录中...",
        mask: true,
      });
      // 2. 获取微信登录凭证code
      const loginRes = await wx.login({
        timeout: 5000, // 超时时间5秒
      });
      console.log("loginRes", loginRes);
      if (loginRes.code) {
        let res = await RequestApi.oneLogin({ code: loginRes.code });
        // 4. 处理后端返回结果
        if (res.statusCode === 200 && res.data.code === 0) {
          // 登录成功，存储自定义登录态（如token）
          wx.setStorageSync("token", res.token);
          console.log("res", res.token);
          // wx.navigateTo({
          //   // url: '/pages/index/index'
          //   // url: "/pages/vipMemer/index",
          //   url:'/pages/myHome/index',
          // });

           wx.switchTab({ url: "/pages/myHome/index" });


        } else {
          wx.showToast({
            title: res.data.msg || "登录失败",
            icon: "none",
          });
        }
      } else {
        throw new Error("获取code失败：" + loginRes.errMsg);
      }
    } catch (error) {
      console.error("登录异常：", error);
      wx.showToast({
        title: "登录出错，请重试",
        icon: "none",
      });
    } finally {
      // 关闭加载提示
      wx.hideLoading();
    }
  },
  bingNickName: function (e) {
    this.setData({
      nickName: e.detail.value,
    });
  },
  bindPassword: function (e) {
    this.setData({
      password: e.detail.value,
    });
  },
  submitPwd: async function () {
    setTimeout(async () => {
      let params = {
        oldPassword: this.data.oldPassword,
        newPassword: this.data.newPassword,
      };
      let res = await RequestApi.changePwd(params);
      if (res && res.data) {
        wx.navigateTo({ url: "/pages/login/login" });
      }
    }, 500);
  },
  login: function () {
    setTimeout(async () => {
      let params = {
        username: this.data.username,
        password: this.data.password,
      };
      let res = await RequestApi.login(params);

      if (res && res.token) {
        wx.setStorageSync("token", res.token);
        console.log("res", res.token);
        // wx.navigateTo({
        //   // url: '/pages/index/index'
        //   url:'/pages/myHome/index',
        // });

        wx.switchTab({ url: "/pages/myHome/index" });
      }
    }, 500);
  },
  changePassword: function () {
    this.setData({
      type: "CHANGEPWD",
      oldPassword: "",
      newPassword: "",
    });
  },
  bindOld: function (e) {
    this.setData({
      oldPassword: e.detail.value,
    });
  },
  bindNew: function (e) {
    this.setData({
      newPassword: e.detail.value,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let type = options?.type;
    if (type) {
      this.changePassword();
      wx.setNavigationBarTitle({ title: '修改密码' });
      const user = wx.getStorageSync('user');
      if (user) {
        let avatar = user.avatar ? BASE_URL + user.avatar : '../../images/home/default.png';
        this.setData({
          avatar: avatar,
          nickName: user.nickName || ''
        });
      }
    }
  },
  /* 注册 */
  register() {
    this.setData({
      type: "REGISTER",
      username: "",
      password: "",
      nickName: "",
    });
  },
  async registerBtn() {
    setTimeout(async () => {
      let params = {
        username: this.data.username,
        password: this.data.password,
        nickName: this.data.nickName,
      };
      let res = await RequestApi.register(params);
      console.log("res", res);

      if (res && res.code == 200) {
        wx.showToast({
          title: "注册成功",
          icon: "success",
          duration: 1000,
        });
        wx.navigateTo({
          // url: '/pages/index/index'
          url: "/pages/login/login",
        });
      }
    }, 500);
  },
  checkLogin() {
    this.setData({
      type: "LOGIN",
      username: "",
      password: "",
    });
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
