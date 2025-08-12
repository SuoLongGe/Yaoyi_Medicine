// pages/search/search.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
      userInput: "",      // 用户输入
      chatHistory: [],    // 聊天记录
      loading: false      // 是否显示加载提示
    },
  
    // 监听输入框变化
    onInputChange(event) {
      this.setData({ userInput: event.detail.value });
    },
  
    // 发送消息
    sendMessage() {
      let userMessage = this.data.userInput.trim();
      if (!userMessage) return; // 防止发送空消息
  
      // 更新聊天记录、清空输入框、显示加载提示
      let newChatHistory = [...this.data.chatHistory, { role: "user", content: userMessage }];
      this.setData({ chatHistory: newChatHistory, userInput: "", loading: true });
  
      wx.cloud.callFunction({
        name: "callDeepSeek",
        data: { userMessage },
        success: res => {
          this.setData({ loading: false }); // 关闭加载提示
          console.log("云函数返回:", res.result);
  
          if (res.result && res.result.reply) {
            let aiReply = res.result.reply;
            this.setData({
              chatHistory: [...this.data.chatHistory, { role: "ai", content: aiReply }]
            });
          } else {
            this.showError("AI 没有返回结果");
          }
        },
        fail: err => {
          console.error("调用失败：", err);
          this.setData({ loading: false });
          this.showError("请求失败，请检查网络");
        }
      });
    },
  
    // 显示错误信息
    showError(msg) {
      wx.showToast({
        title: msg,
        icon: "none",
        duration: 2000
      });
    },
  
    // 点击底部导航栏的处理函数
    onTabClick: function (e) {
      const page = e.currentTarget.dataset.page;  // 获取点击的页面名称
      switch (page) {
        case 'index':
          wx.navigateTo({
            url: '/pages/index/index'
          });
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
          // 已经在搜索页面，不需要跳转
          break;
        default:
          break;
      }
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 页面加载时的操作
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      // 调用云函数检查用户是否已登录
      wx.cloud.callFunction({
        name: 'getOpenid',
        success: res => {
          // 判断返回结果中 userInfo 和 openId 是否存在
          if (!res.result || !res.result.userInfo || !res.result.userInfo.openId) {
            // 用户未登录，显示弹窗让用户选择登录或取消
            wx.showModal({
              title: "提示",
              content: "请先登录",
              cancelText: "取消",
              confirmText: "去登录",
              success: modalRes => {
                if (modalRes.confirm) {
                  // 用户点击"去登录"，跳转到登录页面
                  wx.redirectTo({
                    url: '/pages/user/user'  // 确保此路径与实际登录页面路径一致
                  });
                } else if (modalRes.cancel) {
                  // 用户点击"取消"，跳转到首页
                  wx.redirectTo({
                    url: '/pages/index/index'
                  });
                }
              }
            });
          } else {
            // 用户已登录，输出 openid 到控制台
            console.log("用户已登录, openid:", res.result.userInfo.openId);
          }
        },
        fail: err => {
          console.error("获取 Openid 失败", err);
          wx.showToast({
            title: "获取用户信息失败，请重试",
            icon: "none"
          });
        }
      });
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
      // 页面初次渲染完成后的操作
    },
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
      // 页面隐藏时的操作
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
      // 页面卸载时的操作
    },
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
      // 下拉刷新操作
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
      // 上拉触底操作
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
      // 用户点击右上角分享时触发
    }
  });
  