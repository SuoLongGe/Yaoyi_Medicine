Page({
  data: {
    fadeIn: false,
    swiperList: [
      {id: 1, imgUrl: "/images/1.png" },
      {id: 2, imgUrl: "/images/2.png" }
    ],

    herbList: [
      { id: 1, name: "草药 1", img: "/images/herb1.png" },
      { id: 2, name: "草药 2", img: "/images/herb2.png" },
      { id: 3, name: "草药 3", img: "/images/herb3.png" },
      { id: 4, name: "草药 4", img: "/images/herb4.png" },
      { id: 5, name: "草药 5", img: "/images/herb5.png" },
    ], 

    activeCategory: 0,
    sections: ["外用", "内服"],
    activeSection: 0,

  },
  onLoad() {
    setTimeout(() => {
      this.setData({ fadeIn: true });
    }, 500);
    this.getSwiperList();
    this.getNewsList();
  },
  getSwiperList() {
    wx.request({
      url: '',
      method: 'GET',
      success: (res) => {
        this.setData({ swiperList: res.data });
      }
    });
  },

  //跳转到搜索页面
  goToSearch(e) {
    const page = e.currentTarget.dataset.page;
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  //跳转到内服药物页面
  goToInternal(e) {
    const page = e.currentTarget.dataset.page;
    wx.navigateTo({
      url: '/pages/internal/internal'
    });
  },

    //跳转到外用药物页面
    goToExternal(e) {
      const page = e.currentTarget.dataset.page;
      wx.navigateTo({
        url: '/pages/external/external'
      });
    },

    //跳转到药方详情界面
    goToHerbDetail(event) {
      const herbId = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/preDetail/preDetail?id=${herbId}`
      });
    },

  //跳转到新闻详情界面
  goToDetail(event) {
    const newsItem = event.currentTarget.dataset.news;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${newsItem.id}&title=${newsItem.title}&content=${newsItem.content}`
    });
  },

  // 调用API实现新闻资讯
  // getNewsList() {
  //   wx.request({
  //     url: "https://apis.tianapi.com/wxhottopic/index",
  //     method: "GET",
  //     data: {
  //       key: "79ffbf69c96419b74638b7d916a0e323", 
  //     },
  //     success: (res) => {
  //       console.log("API 返回数据:", res.data);
  //       if (res.data.code === 200) {
  //         let topNews = res.data.result.list.slice(0, 5); // 只取前5条新闻
  //         this.setData({ newsList: topNews });
  //         wx.showToast({
  //           title: "获取新闻成功" ,
  //           icon: "none"
  //         });
  //       } else {
  //         wx.showToast({
  //           title: "获取新闻失败：" + res.data.msg,
  //           icon: "none"
  //         });
  //       }
  //     },
  //     fail: (err) => {
  //       wx.showToast({
  //         title: "请求失败，请检查网络",
  //         icon: "none"
  //       });
  //       console.error("新闻请求失败：", err);
  //     }
  //   });
  // },
  
  changeCategory(e) {
    this.setData({ activeCategory: e.currentTarget.dataset.index });
  },
  changeSection(e) {
    this.setData({ activeSection: e.currentTarget.dataset.index });
  },
  navigateToUser() {
    wx.switchTab({
      url: '/pages/user/user'
    });
  }
});