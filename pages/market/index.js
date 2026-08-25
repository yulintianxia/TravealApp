import { BASE_URL, baseImageUrl } from "../../config/index";
import { RequestApi } from "../../services/api";

Page({
  data: {
    activeTab: "comprehensive",
    pageNum: 1,
    pageSize: 10,
    sortState: {
      comprehensive: true,
      newest: true,
      price: true,
      sales: true,
      reviews:true,
    },
    tabs: [
       {
        label: "综合",
        value: "comprehensive",
      },
      {
        label: "最新",
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
    bannerList:[],
    allProducts: [],
  },

  onLoad() {
    // this.updateProductsByTab("最新");
    this.getBannerList();
    this.getProducts();
    this.getCategoryList();
  },

   async getBannerList(){
    
      const res = await RequestApi.carouselList();  
      if (res && res.code == "200") {
        this.setData({
          bannerList: res.data || [],
        });
      }
   },
  async getProducts(reset = true) {
    if (this.data.loading) return;

    const pageNum = reset ? 1 : this.data.pageNum;
    this.setData({ loading: true });

    try {
      const params = {
        category: this.data.activeCategory,
        orderBy: this.data.activeTab,
        pageNum,
        pageSize: this.data.pageSize,
        isAsc: this.data.sortState[this.data.activeTab],
      };

      console.log(params);
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
    this.setData({
      activeTab: tab,
      pageNum: 1,
      noMore: false,
      products: [],
    }, () => {
      this.getProducts(true);
    });
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    const sortState = this.data.sortState || {};

    if (tab === this.data.activeTab) {
      const nextOrder = sortState[tab] ? false : true;
      this.setData({
        sortState: {
          ...sortState,
          [tab]: nextOrder,
        },
      });
    } else {
      this.setData({
        activeTab: tab,
        sortState: {
          ...sortState,
          [tab]: sortState[tab] || true,
        },
      });
    }

    this.updateProductsByTab(tab);
  },

  onReviewFilterChange(e) {
    const { filter } = e.currentTarget.dataset;
    this.setData({ activeReviewFilter: filter });
  },

  onCategoryChange(e) {
    const { category } = e.currentTarget.dataset;
    const nextCategory = this.data.activeCategory === category ? "" : category;

    this.setData({
      activeCategory: nextCategory,
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
