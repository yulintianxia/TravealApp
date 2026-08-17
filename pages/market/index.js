import { BASE_URL, baseImageUrl } from "../../config/index";
import { RequestApi } from "../../services/api";

Page({
  data: {
    activeTab: "comprehensive",
    pageNum: 1,
    pageSize: 10,
    // tabs: ["最新", "价格", "销量", "评价"],
    tabs: [
      {
        label: "综合",
        value: "comprehensive",
      },
      {
        label: "上新",
        value: "newest",
      },
      {
        label: "价格",
        value: "price",
      },
      {
        label: "销量",
        value: "sales",
      },
      {
        label: "评价",
        value: "reviews",
      },
    ],
    // categories: ["全部", "服饰配件", "生活用品", "菩提", "潮流女包"],
    categories: [],
    activeCategory: "",
    activeReviewFilter: "全部",
    products: [],
    reviews: [],
    total: 0,
    loading: false,
    noMore: false,
    reviewFilters: ["全部", "有图1", "挺好的121", "不媚好0", "追评0"],
    bannerImage:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
    allProducts: [
      {
        id: 1,
        name: "包芯棉线1.8mm可绕烧树脂磨文玩手串编织线",
        price: 2800,
        tag: "新手福利",
        hot: "热销中",
        image:
          "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
        category: "all",
      },
      {
        id: 2,
        name: "精梳棉手套文玩手套劳保手套男女通用款",
        price: 4800,
        tag: "新手福利",
        hot: "热销中",
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
        category: "生活用品",
      },
      {
        id: 3,
        name: "文玩穿珠线手感好耐磨不掉色",
        price: 2480,
        tag: "新手福利",
        hot: "热销中",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
        category: "菩提",
      },
      {
        id: 4,
        name: "精梳棉手套文玩手套劳保手套男女通用款",
        price: 4800,
        tag: "新手福利",
        hot: "热销中",
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
        category: "服饰配件",
      },
    ],
  },

  onLoad() {
    // this.updateProductsByTab("最新");
    this.setData({
      reviews: [
        {
          id: 1,
          user: "正莲虎哥",
          avatar:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80",
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
          avatar:
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80",
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
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
          content: "挺好的，性价比高，没有异味，包装也很精致。",
          extra: "已兑换：盘珠专用大师级鹿皮绒手套纯棉棉手套双",
          date: "发表于7天前",
          images: [],
        },
      ],
    });

    this.getProducts();
    this.getCategoryList();
  },

  async getProducts(reset = true) {
    if (this.data.loading) return;

    const pageNum = reset ? 1 : this.data.pageNum;
    this.setData({ loading: true });

    try {
      const params = {
        category: this.data.activeCategory,
        orderBy: "",
        pageNum,
        pageSize: this.data.pageSize,
      };
      const res = await RequestApi.goodsList(params);
      const rows = (res && res.rows) || [];
      const total = (res && res.total) || 0;
      const merged = reset ? rows : this.data.products.concat(rows);

      this.setData({
        products: merged,
        total,
        pageNum,
        noMore: merged.length >= total || rows.length < this.data.pageSize,
      });
    } catch (error) {
      console.error("getProducts error:", error);
      if (reset) {
        this.setData({ products: [], total: 0, noMore: true });
      }
    } finally {
      this.setData({ loading: false });
    }
  },

  async getCategoryList() {
    let res = await RequestApi.categoryList();
    if (res && res.code == "200" && res.data.length) {
      this.setData({
        categories: res.data,
      });
    }
  },

  updateProductsByTab(tab) {
    const all = this.data.allProducts || [];
    const filtered = all.filter((item) => {
      if (this.data.activeCategory === "all") return true;
      return item.category === this.data.activeCategory;
    });

    this.setData({
      activeTab: tab,
      products: filtered,
    });
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;

    console.log("tab", tab);
    this.updateProductsByTab(tab);
  },

  onReviewFilterChange(e) {
    const { filter } = e.currentTarget.dataset;
    this.setData({ activeReviewFilter: filter });
  },

  onCategoryChange(e) {
    const { category } = e.currentTarget.dataset;

    this.setData({
      activeCategory: category,
      pageNum: 1,
      noMore: false,
      products: [],
    }, () => {
      this.getProducts(true);
    });
  },

  onReachBottom() {
    if (this.data.loading || this.data.noMore) return;

    this.setData({
      pageNum: this.data.pageNum + 1,
    }, () => {
      this.getProducts(false);
    });
  },

  goToDetail(e) {
    const productId = e.currentTarget.dataset.id || e.currentTarget.dataset.keyId;
    if (!productId) return;
    wx.navigateTo({
      url: `/pages/productDetail/index?keyId=${productId}`,
    });
  },
});
