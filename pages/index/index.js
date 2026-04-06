Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 0,
    scrollLeft: 0,
    cardList: [
      {
        id: 0,
        bg: "../../images/home/v1-bg-new.png",
        levelName: "白泽会员",
        level: 1,
        quote: "“知瑞·洞彻万类，福泽自宁。”——白泽",
        deerImg: "../../images/home/logo.png",
        needPoints: 200,
        points: 3000,
        rank: 986,
        medal: 36,
      },
      // 可扩展更多卡片
    ],
    currentLevel: 0,
    progress: 20,
    levelIcons: [
      { icon: "../../images/home/1.png" },
      { icon: "../../images/home/2.png" },
      { icon: "../../images/home/3.png" },
      { icon: "../../images/home/4.png" },
      { icon: "../../images/home/5.png" },
      { icon: "../../images/home/6.png" },
    ],
    iconAnimStyle: "",
    rights: [
      { icon: "../../images/home/vergrade.png", title: "勋章" },
      { icon: "../../images/home/gifts.png", title: "商品" },
    ],
  },

  onLoad() {
    this.setNavBarHeight();
  },

  setNavBarHeight() {
    const sysInfo = wx.getSystemInfoSync();
    const menuBtn = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = sysInfo.statusBarHeight;
    const navBarHeight = (menuBtn.top - statusBarHeight) * 2 + menuBtn.height;
    this.setData({ statusBarHeight, navBarHeight });
  },

  onCardScroll(e) {
    // 计算当前卡片索引
    const scrollLeft = e.detail.scrollLeft;
    const cardWidth = 700; // rpx
    const index = Math.round(scrollLeft / cardWidth);
    if (index !== this.data.currentLevel) {
      this.setData({ currentLevel: index, iconAnimStyle: "transform:scale(2);transition:transform 0.2s;" });
      setTimeout(() => {
        this.setData({ iconAnimStyle: "transform:scale(1);transition:transform 0.5s;" });
      }, 200);
    }
  },
});