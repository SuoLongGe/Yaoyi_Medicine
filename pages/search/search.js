// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    herbList: [
      { id: 1, name: "草药 1", img: "/images/herb1.png" },
      { id: 2, name: "草药 2", img: "/images/herb2.png" },
      { id: 3, name: "草药 3", img: "/images/herb3.png" },
      { id: 4, name: "草药 4", img: "/images/herb4.png" },
      { id: 5, name: "草药 5", img: "/images/herb5.png" },
    ],
    filteredHerbList: [],  // 存储过滤后的结果
  },

  onSearchInput(e) {
    const searchValue = e.detail.value.trim().toLowerCase();  // 获取搜索内容并转为小写
    const filteredList = this.data.herbList.filter(herb => 
      herb.name.toLowerCase().includes(searchValue)  // 过滤名字包含搜索内容的草药
    );
     // 更新 filteredHerbList 显示匹配结果
     this.setData({
      filteredHerbList: filteredList
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      filteredHerbList: this.data.herbList  // 默认显示所有草药
    });
  },

    //跳转到药方详情界面
    goToHerbDetail(event) {
      const herbId = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/preDetail/preDetail?id=${herbId}`
      });
    },

  //返回上一级界面
  goBack() {
    wx.navigateBack({
      delta: 1 // 返回上一级
    });
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