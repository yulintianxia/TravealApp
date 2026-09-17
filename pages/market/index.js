import { BASE_URL, baseImageUrl } from "../../config/index";
import { RequestApi } from "../../services/api";

Page({
  data: {
    activeTab: "comprehensive",
    activeTab2:'',
    pageNum: 1,
    pageSize: 10,
    sortState: {
      comprehensive: false,
      newest: false,
      price: false,
      sales: false,
      reviews:false,
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
      // {
      //   label: "评价",
      //   value: "rating",
      // },
    ],
    tabs2:[],
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
    currentBannerIndex: 0,
    allProducts: [],
  },

  onLoad() {
  },

  onShow() {
    this.setData({
      activeTab: "comprehensive",
      activeTab2: "",
      pageNum: 1,
      sortState: {
        comprehensive: false,
        newest: false,
        price: false,
        sales: false,
        rating: false,
      },
      tabs2: [],
      categories: [],
      activeCategory: "",
      activeReviewFilter: "全部",
      products: [],
      reviews: [],
      total: 0,
      loading: false,
      noMore: false,
      bannerList: [],
      currentBannerIndex: 0,
      allProducts: [],
    }, () => {
      this.getBannerList();
      this.getProducts(true);
      this.getCategoryList();
    });
  },

   async getBannerList(){
    
      const res = await RequestApi.carouselList();  
      if (res && res.code == "200") {
        this.setData({
          bannerList: res.data || [],
        });
      }
   },

  onBannerChange(e) {
    this.setData({ currentBannerIndex: e.detail.current });
  },

  handleBannerTap(e) {
    const { url } = e.currentTarget.dataset;
    if (/^https?:\/\//i.test(url)) {
      wx.navigateTo({
        url: "/subpackages/account/pages/webView/index",
        success: (res) => res.eventChannel.emit("webViewData", { url,
          httpUrl:true,
         }),
      });
      return;
    }
    wx.navigateTo({ url });
  },

  async getProducts(reset = true) {
    if (this.data.loading) return;

    const pageNum = reset ? 1 : this.data.pageNum;
    this.setData({ loading: true });

    try {
      console.log(this.data.activeTab2,this.data.activeCategory);
      const params = {
        // category: this.data.activeTab2 || this.data.activeCategory,
        category1: this.data.activeCategory,
        category2:  this.data.activeTab2,
        orderBy: this.data.activeTab,
        // name:this.data.name,
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

  onTabChange2(e){
    const { id } = e.currentTarget.dataset;
    let activeTab2 = this.data.activeTab2 === id ? "" : id;
    this.setData({ activeTab2 });
    this.getProducts();
  },

  onReviewFilterChange(e) {
    const { filter } = e.currentTarget.dataset;
    this.setData({ activeReviewFilter: filter });
  },

  onCategoryChange(e) {
    const { category } = e.currentTarget.dataset;
    const nextCategory = this.data.activeCategory === category ? "" : category;
    console.log(category,'categorycategory',this.data.categories);
    let tabs2 =[];
    let activeTab2 ='';
    if(nextCategory){
       tabs2 = this.data.categories.filter((item) => item.keyId ==category)?.[0].children || [];
    } 
   
    
    console.log(tabs2);

    this.setData({
      activeCategory: nextCategory,
      pageNum: 1,
      noMore: false,
      products: [],
      tabs2,
      activeTab2
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
      url: `/subpackages/mall/pages/productDetail/index?keyId=${productId}`,
    });
  },

  goCart() {
    wx.navigateTo({ url: "/subpackages/mall/pages/cart/index" });
  },

  onShareAppMessage() {
    return {
      title: "积分商城，精选好物等你来兑换",
      path: "/pages/market/index",
    };
  },
});
