import { httpClient } from "./request";

class ApiManager extends httpClient {
  constructor() {
    super();
  }

  login(data) {
    return this.post("/login", data);
  }

  getInfo(data, config) {
    return this.get("/getInfo", data, config);
  }

  changePwd(data, config) {
    return this.put("/system/user/profile/updatePwd", data, config);
  }

  // 修改头像
  getAvatar(data, config) {
    return this.post("/system/user/profile/avatar", data, config);
  }

  // 修改其他信息
  profile(data, config) {
    return this.put("/system/user/profile", data, config);
  }
  // 注册
  register(data, config) {
    return this.post("/register", data, config);
  }
  // 获取当前用户的积分信息
  getGrade(data, config) {
    return this.get("/system/points/getPointsInfo", data, config);
  }
  // 获取用户的地址列表
  addressList(data, config) {
    return this.get("/system/address/getAddressInfo", data, config);
  }
  // 新增用户地址
  address(data, config) {
    return this.post("/system/address/addAddressInfo", data, config);
  }

  // 修改收货地址
  editAddress(data, config) {
    return this.put("/system/address/editAddressInfo", data, config);
  }

  //删除收货地址
  deleteAddress(data, config) {
    return this.delete("/system/address/deleteAddressInfo", data, config);
  }

  // 会员等级列表
  getAllLevel(data, config) {
    return this.get(`/system/level/getAllLevel`, data, config);
  }
  //获取勋章信息
  getInfoByLevel(data, config) {
    return this.get(`/system/medal/getInfoByLevel`, data, config);
  }

  // 获取积分情况
  getPointsUse(data, config) {
    return this.get(`/system/points/getPointsDetailInfo`, data, config);
  }

  // 获取排名情况
  getPointsTop(data, config) {
    return this.get(`/system/points/getPointsTop`, data, config);
  }

  // 获取订单列表
  getOrder(data, config) {
    return this.get(`/mall/api/order/list`, data, config);
  }

  /* 确认收货 */
  checkOrder(data, config) {
    return this.get(`/system/order/confirmReceipt`, data, config);
  }

  /* 支付 */
  payOrder(data, config) {
    return this.get(`/system/points/buy`, data, config);
  }
  // 通用图片上传接口
  uploadFile(data, config) {
    return this.post("/common/uploadImage", data, config);
  }

  // 获取购买平台字典
  getPlatformList(data, config) {
    return this.get(
      "/system/dict/data/type/purchasePlatformList",
      data,
      config
    );
  }
  // 积分申请
  addApply(data, config) {
    return this.post("/system/apply/addApply", data, config);
  }
  // 撤销积分申请
  cancelApply(data, config) {
    return this.post(`/system/apply/cancelApply/${data}`);
  }
  // 积分申请列表
  getApplyList(data, config) {
    return this.get("/system/apply/getApplyList", data, config);
  }

  // 积分申请修改
  applyUpdate(data, config) {
    return this.put("/system/apply/update", data, config);
  }


  //通过code获取手机号并登录
  loginByWeiXinCode(data, config) {
    return this.get("/loginByWeiXinCode", data, config);
  }

  //获取升级消息
  isLevelMsg(data, config) {
    return this.get("/system/level/isLevelMsg", data, config);
  }

  //签到
  doCheckin(data, config) {
    return this.get("/system/checkin/doCheckin", data, config);
  }


    //签到
  checkinList(data, config) {
    return this.get("/system/checkin/checkinList", data, config);
  }

  // 查询上架商品列表
  goodsList(data, config) {
    return this.get("/mall/api/goods/list", data, config);
  }

  // 查询商品详情
  goodsDetail(data, config) {
    return this.get(`/mall/api/goods/${data.keyId}`, data, config);
  }

  // 查询标签列表
  tagList(data, config) {
    return this.get(`/mall/api/tag/list`, data, config);
  }

  // 获取商品分类列表（从字典表查询）
  categoryList(data, config) {
    return this.get(`/mall/api/category/list`, data, config);
  }

  // 查询商品评价列表
  reviewList(data, config) {
    return this.get(`/mall/api/review/list`, data, config);
  }

  // 查询商品评价统计
  statistics(data, config) {
    return this.get(`/mall/api/review/statistics`, data, config);
  }

  // 查询购物车列表
  cartList(data, config) {
    return this.get(`/mall/api/cart/list`, data, config);
  }

  // 添加商品到购物车
  cartAdd(data, config) {
    return this.post(`/mall/api/cart/add`, data, config);
  }

  // 更新购物车商品数量
  cartUpdate(data, config) {
    return this.post(`/mall/api/cart/update`, data, config);
  }

  // 删除购物车商品
  cartDelete(data, config) {
    return this.post(`/mall/api/cart/delete`, data, config);
  }

  // 创建订单（结算）
  createOrder(data, config) {
    return this.post(`/mall/api/order/create`, data, config);
  }

  //获取当前用户的订单列表，支持按状态筛选
   getOrderList(data, config) {
    return this.post(`/mall/api/order/list`, data, config);
  }
  
  //查询订单详情
   getOrderDetail(data, config) {
    return this.get(`/mall/api/order/${data.keyId}/${data.goodsId}`, data, config);
  }

   //取消订单
   cancelOrder(data, config) {
    return this.post(`/mall/api/order/cancel`, data, config);
  }
  
  //确认收货（只有待收货状态可以确认）
   receiveOrder(data, config) {
    return this.post(`/mall/api/order/receive`, data, config);
  }
  

  //小程序的轮播图代码
   carouselList(data, config) {
    return this.get(`/mall/api/carousel/list`, data, config);
  }

    //查询购物车不同商品数量
   cartCount(data, config) {
    return this.get(`/mall/api/cart/count`, data, config);
  }
  

    //商品评价
   reviewAdd(data, config) {
    return this.post(`/mall/api/review/add`, data, config);
  }
  

}

const RequestApi = new ApiManager();

export { RequestApi };
