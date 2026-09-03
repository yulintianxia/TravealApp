import { BASE_URL } from "../../../../config/index.js";
import { RequestApi } from "../../../../services/api.js";

Page({
  data: {
    keyId: "",
    activeFilter: "all",
    filters: [
      { label: "全部", value: "all", count: 0 },
      { label: "有图", value: "hasImage", count: 0 },
    ],
    reviews: [],
    loading: false,
    noMore: false,
    pageNum: 1,
    pageSize: 10,
    fallbackReviews: [],
    BASE_URL,
  },

  onLoad(options) {
    const keyId = options.keyId || "";
    this.setData({ keyId, reviews: [], noMore: false });
    this.loadReviews(true);
    this.getCount();
  },
  async getCount() {
      let params ={
        goodsId:this.data.keyId,
      }
      let res = await RequestApi.statistics(params);
      if(res && res.code =='200'){
        this.setData({
          filters: [
            { label: "全部", value: "all", count: res.data.total },
            { label: "有图", value: "hasImage", count: res.data.withPicCount },
          ],
        });
      }
  },

  formatDate(value) {
    if (!value) return "";
    if (typeof value === "number") {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }
    }

    const matched = String(value).match(/(\d{4})[-/]?(\d{1,2})[-/]?(\d{1,2})/);
    if (!matched) return String(value);
    return `${matched[1]}-${String(matched[2]).padStart(2, "0")}-${String(matched[3]).padStart(2, "0")}`;
  },

  async loadReviews(reset = true) {
    if (this.data.loading) return;

    const pageNum = reset ? 1 : this.data.pageNum;
    this.setData({ loading: true });

    console.log("activeFilteractiveFilter", this.data.activeFilter);

    try {
      const params = {
        goodsId: this.data.keyId,
        pageNum,
        pageSize: this.data.pageSize,
        hasImage: this.data.activeFilter === "hasImage" ? true : "",
      };

      const res = await RequestApi.reviewList(params);
      if (res && res.code == "200") {
        const rows = res?.rows;
        this.setData({
          reviews: rows,
          pageNum,
          noMore: this.data.pageSize * this.data.pageNum < res.total,
        });
      }
    } catch (error) {
      console.error("loadReviews error:", error);
      if (reset) {
        this.setData({ reviews: [], noMore: true });
      }
    } finally {
      this.setData({ loading: false });
    }
  },

  onFilterChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData(
      { activeFilter: value, pageNum: 1, reviews: [], noMore: false },
      () => {
        this.loadReviews(true);
      },
    );
  },

  onReachBottom() {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ pageNum: Number(this.data.pageNum) + 1 }, () => {
      this.loadReviews(false);
    });
  },
});
