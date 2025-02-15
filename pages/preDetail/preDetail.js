// pages/preDetail/preDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    herbId: null,
    herbInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id } = options;
    this.setData({ herbId: id });

    // 数据
    const herbData = {
      1: { 
        name: "人参", 
        description: "人参是一种名贵的中草药，具有补气养生、增强免疫力的功效。常用于气虚体弱、疲劳过度等症状。",
        img: "/images/herb1.png"
      },
      2: { 
        name: "黄芪", 
        description: "黄芪具有益气固表、托毒排脓的作用。长期服用可增强免疫力，提高身体抵抗力。",
        img: "/images/astragalus.jpg"
      },
      3: { 
        name: "当归", 
        description: "当归常用于补血活血，调经止痛。尤其适用于女性身体调理，被誉为‘妇科圣药’。",
        img: "/images/angelica.jpg"
      }
    };

    this.setData({ herbInfo: herbData[id] || {} });
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