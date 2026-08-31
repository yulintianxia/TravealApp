import { BASE_URL } from "../../config/index.js";

Page({
  data: {
    orderId: "",
    score: 0,
    content: "",
    imageFiles: [],
    goodsId: "",
  },

  onLoad(options) {
    console.log('options',options);
    this.setData({ orderId: options.orderId || "",goodsId: options.goodsId || "" });
  },

  onScoreChange(e) {
    this.setData({ score: Number(e.detail.value) || 0 });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onImageAdd(e) {
    const files = e.detail.files || [];
    const pendingFiles = files.map((file) => ({
      name: file.name || `review-${Date.now()}`,
      type: "image",
      url: file.url,
    }));
    this.setData({ imageFiles: this.data.imageFiles.concat(pendingFiles).slice(0, 3) });
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
      orderId:this.data.orderId,
      content: this.data.content.trim(),
      pictures: this.data.imageFiles.map((file) => file.url),
    };
    let res = await RequestApi.reviewAdd(payload);
    if(res && res.code =='200'){
       wx.showToast({ title: "评价已提交", icon: "success" });
      setTimeout(() => wx.navigateBack({ delta: 1 }), 800);
    } 
  },
});
