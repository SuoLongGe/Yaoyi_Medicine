// pages/news/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: [
      { id: 1, title: "2025年科技大会即将召开", content: "2025年全球科技大会将在北京召开，预计有2000+科技企业参展……" },
      { id: 2, title: "AI技术突破：新模型超越人类水平", content: "最新的人工智能模型突破了人类专家水平，在多个领域展现卓越能力……" },
      { id: 3, title: "中国航天最新进展，探测器成功登陆火星", content: "中国探测器“火星一号”成功登陆火星，开启新一轮探测任务……" },
      { id: 4, title: "经济增长超预期，市场信心回暖", content: "最新经济数据显示，中国GDP增长超出预期，投资市场表现亮眼……" },
      { id: 5, title: "新能源车销量创历史新高", content: "2025年，全球新能源车销量突破1000万辆，同比增长30%……" },
      // 本项是测试项，在项目结束后请删除，保留也可，不过不要让人看见
      { id: 6, title: "中医药介绍", content: "豌豆笑传ccb。" }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

    //跳转到新闻详情界面
    goToDetail(event) {
      const newsItem = event.currentTarget.dataset.news;
      if (newsItem.id === 6) {
        // 如果点击的是“中医药介绍”，跳转到 medicine 页面，这部分之后可以删掉
        wx.navigateTo({
          url: '/pages/medicine/medicine'
        });
      } else {
        // 否则跳转到新闻详情页面
        wx.navigateTo({
          url: `/pages/detail/detail?id=${newsItem.id}&title=${newsItem.title}&content=${newsItem.content}`
        });
      }
    },
  // goToDetail(event) {
  //   const newsItem = event.currentTarget.dataset.news;
  //   wx.navigateTo({
  //     url: `/pages/detail/detail?id=${newsItem.id}&title=${newsItem.title}&content=${newsItem.content}`
  //   });
  // },
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