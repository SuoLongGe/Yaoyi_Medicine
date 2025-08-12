Page({
    data: {
      fadeIn: false,
      swiperList: [
        {id: 1, imgUrl: "/images/herb1.png" },
        {id: 2, imgUrl: "/images/herb2.png" },
        {id: 3, imgUrl: "/images/herb3.png" },
        {id: 4, imgUrl: "/images/herb4.png" },
        {id: 5, imgUrl: "/images/herb5.png" }
      ],
  
      externalRemedies: [
        {
          id: 1,
          name: "药方：瑶医推蛋疗法 颈腰椎方",
          prescription: "行气活血，化瘀止痛",
          brief: "证型：气滞血瘀型",
          syndrome: "气滞血瘀型",
          treatment: "方药：九龙钻15克、鸟不站15克、徐长卿15克、北刘寄奴15克、千年健15克、入山虎15克、血竭10克、杜仲15克。",
          method: "鸡蛋与饮片一同煎煮，开锅后鸡蛋去壳再小火煮15分钟，蛋白与银器布包后行推蛋疗法。",
          restriction: "无",
          attention: "无",
          handle: "无"
        },
        {
          id: 2,
          name: "药方：瑶医风寒感冒方",
          prescription: "疏散表邪",
          brief: "证型：外感风寒",
          syndrome: "外感风寒",
          treatment: "方药：葱头10克、薄荷9克、紫苏叶15克、一枝黄花15克。",
          method: "泡脚",
          restriction: "无",
          attention: "无",
          handle: "无"
        },
        {
          id: 3,
          name: "药方：瑶医带下病方",
          prescription: "清热利湿",
          brief: "证型：湿热",
          syndrome: "湿热",
          treatment: "方药:海金沙8克、车前草8克、白通15克、白芍12克、泽泻6克、白术12克、小藤通15克、青干名木15克、虎杖8克",
          method: "外洗",
          restriction: "无",
          attention: "无",
          handle: "无"
        },
        {
          id: 4,
          name: "药方：瑶医颈椎病外敷方",
          prescription: "通络祛痰",
          brief: "证型：病久生痰，痰瘀留着关节",
          syndrome: "病久生痰，痰瘀留着关节",
          treatment: "方药：独活15克、羌活10克、海风藤10克、千年健10克、牛膝10克、壮骨风10克、桂枝10克、威灵仙10克、芥子10克、土鳖虫10克、地黄20克、骨碎补10克、当归15克、甘草5克。",
          method: "研末外敷患处",
          restriction: "无",
          attention: "无",
          handle: "无"
        },
        {
          id: 5,
          name: "药方：瑶医外洗驱寒止痛汤",
          prescription: "祛风除湿",
          brief: "证型：寒湿型",
          syndrome: "寒湿型",
          treatment: "方药：透骨草20克、艾叶20克、鸡血藤30克、海桐皮15克、制川乌10克、羌活10克、桂枝10克、红花10克、威灵仙30克。",
          method: "外洗",
          restriction: "无",
          attention: "无",
          handle: "无"
        },
      ],
  
      activeCategory: 0,
      sections: ["外用", "内服"],
      activeSection: 0,
  
      isLoggedIn: false,  // 新增字段，用于判断用户登录状态
      openid: '',         // 新增字段，存储 openid
    },
  
    onLoad() {
      setTimeout(() => {
        this.setData({ fadeIn: true });
      }, 500);
      this.getSwiperList();
      this.checkLoginStatus();  // 检查登录状态
    },
  
    // 检查登录状态
    checkLoginStatus() {
      const openid = wx.getStorageSync('openid');  // 从缓存中获取 openid
      if (openid) {
          console.log('openid get:',openid);
        this.setData({
          isLoggedIn: true,
          openid: openid,
        });
      } else {
          console.log('not logged in');
        this.setData({
          isLoggedIn: false,
          openid: '',
        });
      }
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
  
    // 点击底部导航栏的处理函数
    onTabClick: function (e) {
      const page = e.currentTarget.dataset.page;  // 获取点击的页面名称
      switch (page) {
        case 'index':
          // 已经在首页，不需要跳转
          break;
        case 'user':
          wx.navigateTo({
            url: '/pages/user/user'
          });
          break;
        case 'news':
          wx.navigateTo({
            url: '/pages/news/news'
          });
          break;
        case 'search':
          wx.navigateTo({
            url: '/pages/search/search'
          });
          break;
        default:
          break;
      }
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
        url: '/pages/technique/technique'
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
    goToHerbDetail: function (e) {
      const herbId = e.target.dataset.herbId;
      wx.navigateTo({
        url: `/pages/preDetail/preDetail?id=${herbId}` 
      });
    },
    goToDetail(event) {
      const id = event.currentTarget.dataset.id;
      const remedy = this.data.externalRemedies.find(item => item.id === id);
  
      wx.navigateTo({
        url: `/pages/external_detail/external_detail?id=${remedy.id}&name=${encodeURIComponent(remedy.name)}&brief=${encodeURIComponent(remedy.brief)}&syndrome=${encodeURIComponent(remedy.syndrome)}&treatment=${encodeURIComponent(remedy.prescription)}&prescription=${encodeURIComponent(remedy.treatment)}&method=${encodeURIComponent(remedy.method)}`
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
  