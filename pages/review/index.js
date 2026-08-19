import { RequestApi } from "../../services/api.js";

Page({
  data: {
    keyId: "",
    activeFilter: "all",
    filters: [
      { label: "全部", value: "all", count: 121 },
      { label: "有图", value: "hasImage", count: 9 },
    ],
    reviews: [],
    loading: false,
    noMore: false,
    pageNum: 1,
    pageSize: 10,
    fallbackReviews: [
      {
        id: 1,
        user: "正莲虎哥",
        avatar: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80",
        content: "东西很棒，质感很好，一次非常不错的购物体验！",
        extra: "已兑换：透气网鹿皮手套*2",
        date: "发表于7天前",
        images: [
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80",
        ],
      },
      {
        id: 2,
        user: "乐阳堂主",
        avatar: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80",
        content: "老顾客，一直在正莲买的，东西还是一如既往地好！品质没的说~",
        extra: "已兑换：精梳棉手套文玩手套劳保手套男女通用款",
        date: "发表于7天前",
        images: [
          "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=300&q=80",
          "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80",
        ],
      },
      {
        id: 3,
        user: "潇潇雨歌",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
        content: "挺好的，性价比高，没有异味，包装也很精致。",
        extra: "已兑换：盘珠专用大师级鹿皮绒手套纯棉棉手套双",
        date: "发表于7天前",
        images: [],
      },
    ],
  },

  onLoad(options) {
    const keyId = options.keyId || "";
    this.setData({ keyId, reviews: [], noMore: false });
    this.loadReviews(true);
  },

  async loadReviews(reset = true) {
    if (this.data.loading) return;

    const pageNum = reset ? 1 : this.data.pageNum;
    this.setData({ loading: true });

    try {
      const params = {
        goodsId: this.data.keyId,
        pageNum,
        pageSize: this.data.pageSize,
      };

      const res = await RequestApi.reviewList(params);
      const rows = Array.isArray(res?.rows)
        ? res.rows
        : Array.isArray(res?.data)
          ? res.data
          : [];
      const sourceRows = rows.length ? rows : reset ? this.data.fallbackReviews : [];
      const filteredRows = this.data.activeFilter === "hasImage"
        ? sourceRows.filter((item) => item && Array.isArray(item.images) && item.images.length)
        : sourceRows;
      const merged = reset ? filteredRows : this.data.reviews.concat(filteredRows);

      this.setData({
        reviews: merged,
        pageNum,
        noMore: sourceRows.length < this.data.pageSize,
      });
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
    this.setData({ activeFilter: value, pageNum: 1, reviews: [], noMore: false }, () => {
      this.loadReviews(true);
    });
  },

  onReachBottom() {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ pageNum: Number(this.data.pageNum) + 1 }, () => {
      this.loadReviews(false);
    });
  },
});
