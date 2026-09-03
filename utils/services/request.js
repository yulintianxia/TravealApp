import { BASE_URL } from "../config/index";

class httpClient {
  prefixUrl = "";

  constructor(prefixUrl = "") {
    this.prefixUrl = prefixUrl;
  }

  interceptors = {
    // 请求拦截器
    request: (params) => {
      if (params.showLoading) {
        // TODO: 封装loading
        wx.showLoading({
          title: "加载中...",
          mask: true,
        });
      }
      // 处理请求数据，如添加Header信息等，
      const config = {
        ...params,
        url: BASE_URL + this.prefixUrl + params.url,
        header: {
          ...params.header,
          "Content-type": "application/json",
          //TODO: 后端需要的字段
          authorization: wx.getStorageSync("token")
            ? `Bearer ${wx.getStorageSync("token")}`
            : "",
        },
        timeout: 60000, // 超时时长，小程序默认是 1 分钟
      };

      if (config.method === "PUT") {
        config.url +=
          "?" +
          Object.keys(config.data)
            .map(
              (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                  config.data[key]
                )}`
            )
            .join("&");
      } else if (config.method === "DELETE") {
        config.url = config.url + `/${config.data}`;
      }
      return config;
    },
    // 响应拦截器
    response: (response) => {
      if (response.config.showLoading) {
        wx.hideLoading();
      }
      console.log("response", response);
      //TODO: 错误信息处理

      if (response.data.code && response.data.code === 401) {
        if (response.config.isNoTurn) {
          console.log('esponse.config.isNoTurn)', response.data.code);
          return Promise.reject(response.data.code);
        } else {
          wx.showToast({
            title: "登录过期,请重新登录",
            duration: 2000,
            icon: "none",
            mask: false,
          });
          wx.redirectTo({
            url: "/subpackages/account/pages/newLogin/index",
          });
        }
      } else if (
        response.data.code &&
        (response.data.code === 0 || response.data.code === 200)
      ) {
        console.log("response.data", response.data.code);
        return Promise.resolve(response.data);
      } else {
        wx.showToast({
          title: response.data.msg,
          duration: 2000,
          icon: "none",
          mask: false,
        });
        return Promise.reject(response);
      }
    },
  };

  request(config) {
    config = this.interceptors.request(config);

    // 网络请求
    return new Promise((resolve, reject) => {
      wx.request({
        ...config,
        success: (res) => {
          const mergeRes = Object.assign({}, res, { config });
          resolve(this.interceptors.response(mergeRes));
        },
        fail: (err) => {
          const mergeErr = Object.assign({}, err, { config });
          reject(this.interceptors.response(mergeErr));
        },
      });
    });
  }

  get(url, data = {}, config = {}, loading = true) {
    return this.request(
      Object.assign({ url, data, method: "GET", showLoading: loading }, config)
    );
  }

  post(url, data = {}, config = {}, loading = true) {
    return this.request(
      Object.assign({ url, data, method: "POST", showLoading: loading }, config)
    );
  }

  put(url, data = {}, config = {}, loading = true) {
    return this.request(
      Object.assign({ url, data, method: "PUT", showLoading: loading }, config)
    );
  }

  delete(url, data = {}, config = {}, loading = true) {
    return this.request(
      Object.assign(
        { url, data, method: "DELETE", showLoading: loading },
        config
      )
    );
  }
}

export { httpClient };
