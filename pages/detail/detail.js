// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: {} // 用于存储新闻详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const newsId = options.id; // 获取传递的新闻ID

    // 模拟从服务器获取新闻数据（你可以替换为真实的API请求）
    const newsData = this.getNewsById(newsId); // 根据新闻ID获取数据
    this.setData({
      news: newsData
    });
  },

  getNewsById: function(id) {
    const newsList = [
      { id: 1, title: "2025年科技大会即将召开", imageUrl: "/images/herb1.png", content: [
          { type: "text", value: "瑶医药是中医药的重要组成部分，是中华民族的宝贵财富，至今仍然是瑶族聚居区各族群众防病治病、强身健体的重要手段。发展瑶医药事业，对于弘扬我国民族医学文化，让更多医疗健康产品更好更公平地惠及我国各族群众，夯实铸牢中华民族共同体意识的社会基础，促进民族地区经济和社会发展具有不可替代的作用。"},
          { type: "image", value: "/images/herb1.png" },
          { type: "text", value: "此次大会将涉及人工智能、5G通信等领域……" }
        ]
      },
      { id: 2, title: "AI技术突破：新模型超越人类水平", imageUrl: "/images/herb1.png", content: [
          { type: "text", value: "最新的人工智能模型突破了人类专家水平……" },
          { type: "image", value: "/images/herb2.png" },
          { type: "text", value: "在多个领域展现卓越能力，推动科技的进步……" }
        ]
      },
      { id: 3, title: "中国航天最新进展，探测器成功登陆火星", imageUrl: "/images/herb1.png", content: [
          { type: "text", value: "中国探测器“火星一号”成功登陆火星……" },
          { type: "image", value: "/images/herb3.png" },
          { type: "text", value: "开启新一轮的探测任务，推动航天技术的进一步发展……" }
        ]
      },
      { id: 4, title: "经济增长超预期，市场信心回暖", imageUrl: "/images/herb1.png", content: [
          { type: "text", value: "最新经济数据显示，中国GDP增长超出预期……" },
          { type: "image", value: "/images/herb4.png" },
          { type: "text", value: "投资市场表现亮眼，为未来经济带来希望……" }
        ]
      },
      { id: 5, title: "新能源车销量创历史新高", imageUrl: "/images/herb1.png", content: [
          { type: "text", value: "2025年，全球新能源车销量突破1000万辆……" },
          { type: "image", value: "/images/herb5.png" },
          { type: "text", value: "同比增长30%，成为全球汽车市场的重要趋势……" }
        ]
      }
    ];
    

    return newsList.find(news => news.id == id); // 返回匹配ID的新闻数据
  },

  // 返回上一级页面
  goBack() {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})