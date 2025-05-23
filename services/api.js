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
    return this.post("/system/user/profile", data, config);
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
    return this.get(`/system/order/getOrderList`, data, config);
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


}

const RequestApi = new ApiManager();

export { RequestApi };
