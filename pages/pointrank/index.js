import { RequestApi } from "../../services/api.js";
import { BASE_URL, H5Url } from "../../config/index";

const PODIUM_FIXED_TOP = 25;

Page({
  data: {
    BASE_URL,
    H5Url,
    defaultPerson: "../../images/home/default.png",
    topFirstCrown: "https://zhenglian.vip/dotm/zl_images/rank1.png",
    topSecondCrown: "https://zhenglian.vip/dotm/zl_images/rank2.png",
    topThirdCrown: "https://zhenglian.vip/dotm/zl_images/rank3.png",

    // topFirstCrown: "../../images/one.png",
    // topSecondCrown: "../../images/two.png",
    // topThirdCrown: "../../images/three.png",

    statusBarHeight: 0,
    navBarHeight: 0,
    dataList: [],
    topFirst: {},
    topSecond: {},
    topThird: {},
    topFirstStars: [],
    topSecondStars: [],
    topThirdStars: [],
    topFirstParticles: [],
    topSecondParticles: [],
    topThirdParticles: [],
    isPodiumFixed: false,
    podiumFixThreshold: 0,
    podiumHolderHeight: 0,
    trankHolderHeight: 0,
    podiumFixedTop: PODIUM_FIXED_TOP,
    myRankInfo: {
      top: "--",
      nickName: "--",
      pointsBalance: 0,
      avatar: "",
    },
    myTop: "",
  },

  onLoad() {
    // this.setNavBarHeight();
    this.initTopEffects();
    this.getList();
  },

  onReady() {
    this.measurePodium();
  },

  onPullDownRefresh() {
    this.getList().finally(() => wx.stopPullDownRefresh());
  },

  // setNavBarHeight() {
  //   const sysInfo = wx.getSystemInfoSync();
  //   const menuBtn = wx.getMenuButtonBoundingClientRect();
  //   const statusBarHeight = sysInfo.statusBarHeight || 0;
  //   const navBarHeight = (menuBtn.top - statusBarHeight) * 2 + menuBtn.height;
  //   this.setData({ statusBarHeight, navBarHeight });
  // },

  onMainScroll(e) {
    const scrollTop = (e && e.detail && e.detail.scrollTop) || 0;
    const { podiumFixThreshold, isPodiumFixed } = this.data;
    const shouldFix = scrollTop >= podiumFixThreshold;
    if (shouldFix !== isPodiumFixed) {
      this.setData({ isPodiumFixed: shouldFix });
    }
  },

  measurePodium() {
    wx.nextTick(() => {
      const query = wx.createSelectorQuery().in(this);
      query.select(".main-scroll").boundingClientRect();
      query.select(".podium-wrap").boundingClientRect();
      query.select(".podium").boundingClientRect();
      query.select(".trank-my").boundingClientRect();
      query.exec((res) => {
        const scrollRect = res && res[0];
        const wrapRect = res && res[1];
        const podiumRect = res && res[2];
        const trankRect = res && res[3];
        if (!scrollRect || !wrapRect || !podiumRect) {
          return;
        }
        const threshold = wrapRect.top - scrollRect.top;
        this.setData({
          podiumFixThreshold: Math.max(0, threshold - PODIUM_FIXED_TOP),
          podiumHolderHeight: Math.ceil(podiumRect.height),
          trankHolderHeight: Math.ceil((trankRect && trankRect.height) || 0),
        });
      });
    });
  },

  rand(min, max) {
    return Math.random() * (max - min) + min;
  },

  buildStars(count, options = {}) {
    const {
      topMin = 4,
      topMax = 72,
      leftMin = 8,
      leftMax = 92,
      sizeMin = 5,
      sizeMax = 12,
      delayMax = 2.4,
      durationMin = 1.8,
      durationMax = 3.1,
    } = options;

    return Array.from({ length: count }).map(() => {
      const left = this.rand(leftMin, leftMax).toFixed(2);
      const top = this.rand(topMin, topMax).toFixed(2);
      const size = this.rand(sizeMin, sizeMax).toFixed(2);
      const delay = this.rand(0, delayMax).toFixed(2);
      const duration = this.rand(durationMin, durationMax).toFixed(2);
      const opacity = this.rand(0.35, 1).toFixed(2);
      return {
        style: `left:${left}%;top:${top}%;width:${size}rpx;height:${size}rpx;animation-delay:${delay}s;animation-duration:${duration}s;opacity:${opacity};`,
      };
    });
  },

  buildParticles(count, options = {}) {
    const {
      bottomMin = 16,
      bottomMax = 90,
      leftMin = 12,
      leftMax = 88,
      sizeMin = 3,
      sizeMax = 8,
      delayMax = 3.2,
      durationMin = 2.6,
      durationMax = 4.6,
    } = options;

    return Array.from({ length: count }).map(() => {
      const left = this.rand(leftMin, leftMax).toFixed(2);
      const bottom = this.rand(bottomMin, bottomMax).toFixed(2);
      const size = this.rand(sizeMin, sizeMax).toFixed(2);
      const delay = this.rand(0, delayMax).toFixed(2);
      const duration = this.rand(durationMin, durationMax).toFixed(2);
      const opacity = this.rand(0.2, 0.9).toFixed(2);
      return {
        style: `left:${left}%;bottom:${bottom}%;width:${size}rpx;height:${size}rpx;animation-delay:${delay}s;animation-duration:${duration}s;opacity:${opacity};`,
      };
    });
  },

  initTopEffects() {
    this.setData({
      topFirstStars: this.buildStars(16, {
        sizeMin: 6,
        sizeMax: 13,
        topMax: 76,
      }),
      topSecondStars: this.buildStars(11, {
        sizeMin: 5,
        sizeMax: 11,
        topMax: 70,
      }),
      topThirdStars: this.buildStars(11, {
        sizeMin: 5,
        sizeMax: 11,
        topMax: 70,
      }),
      topFirstParticles: this.buildParticles(14, {
        sizeMin: 4,
        sizeMax: 10,
        durationMin: 2.2,
        durationMax: 4.2,
      }),
      topSecondParticles: this.buildParticles(9, {
        sizeMin: 3,
        sizeMax: 8,
      }),
      topThirdParticles: this.buildParticles(9, {
        sizeMin: 3,
        sizeMax: 8,
      }),
    });
  },

  async getList() {
    try {
      const res = await RequestApi.getPointsTop({ top: 50 });
      if (res && res.code == "200") {
        const list = (res && res.data) || [];
        const user = wx.getStorageSync("user") || {};
        const currentUserId = user.userId ? String(user.userId) : "";
        const dataList = list.slice(3).map((item) => ({
          ...item,
          isCurrentUser:
            !!currentUserId && String(item.userId) === String(currentUserId),
        }));

        const currentUserIndex = currentUserId
          ? list.findIndex((item) => String(item.userId) === currentUserId)
          : -1;

        // const myRankInfo = currentUserIndex > -1
        //   ? {
        //       ...list[currentUserIndex],
        //       rankNo: currentUserIndex + 1,
        //     }
        //   : {
        //       rankNo: "--",
        //       nickName: user.nickName || user.nickname || "--",
        //       pointsBalance: 0,
        //       avatar: user.avatar || user.headImg || "",
        //     };
        console.log(res?.userPoints.top, "totptttt");
        const myTop = res?.userPoints.top;

        let myRankInfo = {
          rankNo: Number(myTop),
          // rankNo: 1,
          nickName: user.nickName || user.nickname || "--",
          pointsBalance: user.pointsBalance || 0,
          avatar: user.avatar || user.headImg || defaultPerson,
        };

        this.setData(
          {
            topFirst: list[0] || {},
            topSecond: list[1] || {},
            topThird: list[2] || {},
            dataList,
            myRankInfo,
            myTop,
          },
          () => {
            this.measurePodium();
          },
        );
      }
    } catch (err) {
      console.error("getPointsTop error:", err);
    }
  },
});
