import { BASE_URL } from "../../../../config/index.js";
import { RequestApi } from "../../../../services/api.js";
Page({
  data: {
    orderId: "",
    score: 0,
    content: "",
    imageFiles: [],
    goodsId: "",
    isAnonymous: "0",
  },

  onLoad(options) {
    this.setData({
      orderId: options.orderId || "",
      goodsId: options.goodsId || "",
    });
  },
  onChange(event) {
    const { value } = event.detail;
    console.log(value);
    this.setData({ isAnonymous: value });
  },
  onScoreChange(e) {
    this.setData({ score: Number(e.detail.value) || 0 });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  handleAdd(e) {
    const { files } = e.detail;
    let fileOrderPhoto = [];
    this.onUpload(files, fileOrderPhoto);
  },
  handleRemove(e) {
    const { index } = e.detail;
    const { imageFiles } = this.data;
    imageFiles.splice(index, 1);
    this.setData({ imageFiles });
  },

  onUpload: function (file, fileOrderPhoto) {
    wx.uploadFile({
      url: BASE_URL + "/common/uploadImage",
      filePath: file[0].url,
      name: "file",
      formData: { file: file[0] },
      header: {
        "Content-type": "multipart/form-data",
        authorization: wx.getStorageSync("token")
          ? `Bearer ${wx.getStorageSync("token")}`
          : "",
      },
      success: (res) => {
        let resData = JSON.parse(res.data);
        fileOrderPhoto.push({
          name: resData.fileName,
          type: "image",
          url: BASE_URL + resData.url,
        });
        this.setData({
          imageFiles: this.data.imageFiles.concat(fileOrderPhoto),
        });
        console.log("imageFiles", this.data.imageFiles);
      },
    });
  },
  onImageRemove(e) {
    const index = e.detail.index;
    const imageFiles = this.data.imageFiles.slice();
    imageFiles.splice(index, 1);
    this.setData({ imageFiles });
  },

  async submitReview() {
    if (!this.data.score) {
      wx.showToast({ title: "请选择评分", icon: "none" });
      return;
    }

    if (!this.data.content.trim()) {
      wx.showToast({ title: "请填写评价信息", icon: "none" });
      return;
    }

    const payload = {
      goodsId: this.data.goodsId,
      rating: this.data.score,
      orderId: this.data.orderId,
      content: this.data.content.trim(),
      pictures: JSON.stringify(this.data.imageFiles.map((file) => file.url)),
      // isAnonymous: this.data.
      isAnonymous: '0',
    };
    console.log("payload", payload);
    // return 
    let res = await RequestApi.reviewAdd(payload);
    if (res && res.code == "200") {
      wx.showToast({ title: "评价已提交", icon: "success" });
      setTimeout(() => {
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];

        if (prevPage && typeof prevPage.getOrderList === "function") {
          prevPage.getOrderList();
        }

        wx.navigateBack({ delta: 1 });
      }, 500);
    }
  },
});
