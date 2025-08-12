Page({
    data: {
      id: '',  // 当前药方的 ID
      name: '',  // 药方的名称
      brief: '',  // 药方的简介
      syndrome: '',  // 证型
      treatment: '',  // 治法
      prescription: '',  // 方药
      method: '',  // 用法
      isLoggedIn: false,  // 用户登录状态
      openid: '',  // 用户的 openid
      isFavorite: false,  // 收藏状态
    },
  
    onLoad(options) {
      // 设置当前药方的详细信息
      this.setData({
        id: options.id,
        name: decodeURIComponent(options.name),
        brief: decodeURIComponent(options.brief),
        syndrome: decodeURIComponent(options.syndrome),
        treatment: decodeURIComponent(options.treatment),
        prescription: decodeURIComponent(options.prescription),
        method: decodeURIComponent(options.method),
      });
  
      this.checkLoginStatus();  // 检查用户是否登录
      this.checkFavorite();      // 检查是否已收藏
    },
  
    // 检查登录状态
    checkLoginStatus() {
      const openid = wx.getStorageSync('openid');  // 获取 openid
      if (openid) {
          console.log('openid:',openid);
        this.setData({
          isLoggedIn: true,
          openid: openid,
        });
      } else {
          console.log('fail to login');
        this.setData({
          isLoggedIn: false,
          openid: '',
        });
      }
    },
  
    // 检查当前药方是否已经被收藏
    checkFavorite() {
      const openid = this.data.openid;
  
      // 完整的 pageUrl，包括所有传递的参数
      const pageUrl = `/pages/external_detail/external_detail?id=${this.data.id}&name=${encodeURIComponent(this.data.name)}&brief=${encodeURIComponent(this.data.brief)}&syndrome=${encodeURIComponent(this.data.syndrome)}&treatment=${encodeURIComponent(this.data.treatment)}&prescription=${encodeURIComponent(this.data.prescription)}&method=${encodeURIComponent(this.data.method)}`;
  
      if (!openid) return;
  
      const db = wx.cloud.database();
      const favoritesCollection = db.collection('favorites');
  
      // 根据 _openid 和 pageUrl 查询收藏记录
      favoritesCollection.where({
        _openid: openid,
        pageUrl: pageUrl,
      }).get({
        success: (res) => {
          if (res.data.length > 0) {
            this.setData({ isFavorite: true });  // 如果已经收藏，设置为已收藏
          } else {
            this.setData({ isFavorite: false });  // 如果没有收藏，设置为未收藏
          }
        },
        fail: (err) => {
          console.error('查询收藏失败:', err);
        }
      });
    },
  
    // 收藏或取消收藏
    toggleFavorite() {
      const openid = this.data.openid;
  
      // 完整的 pageUrl，包括所有传递的参数
      const pageUrl = `/pages/external_detail/external_detail?id=${this.data.id}&name=${encodeURIComponent(this.data.name)}&brief=${encodeURIComponent(this.data.brief)}&syndrome=${encodeURIComponent(this.data.syndrome)}&treatment=${encodeURIComponent(this.data.treatment)}&prescription=${encodeURIComponent(this.data.prescription)}&method=${encodeURIComponent(this.data.method)}`;
  
      // 如果用户未登录，弹出提示框并跳转到登录页面
      if (!openid) {
        wx.showModal({
          title: '提示',
          content: '请先登录',
          confirmText: '去登录',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              // 用户点击“去登录”
              wx.navigateTo({
                url: '/pages/user/user'
              });
            }
          }
        });
        return;
      }
  
      // 获取当前药方的收藏信息
      const favoriteItem = {
        timestamp: new Date().getTime(),
        title: this.data.name,
        content: this.data.brief,
        pageUrl: pageUrl
      };
  
      // 将收藏项保存到云数据库
      const db = wx.cloud.database();
      const favoritesCollection = db.collection('favorites');
  
      // 检查该用户是否已经收藏过该药方
      favoritesCollection.where({
        _openid: openid,
        pageUrl: pageUrl
      }).get({
        success: (res) => {
          if (res.data.length === 0) {
            // 没有收藏过，执行收藏操作
            favoritesCollection.add({
              data: favoriteItem,
              success: () => {
                wx.showToast({
                  title: '收藏成功',
                  icon: 'success',
                });
                this.setData({ isFavorite: true });
              }
            });
          } else {
            // 已收藏，执行取消收藏操作
            favoritesCollection.doc(res.data[0]._id).remove({
              success: () => {
                wx.showToast({
                  title: '取消收藏',
                  icon: 'none',
                });
                this.setData({ isFavorite: false });
              }
            });
          }
        },
        fail: (err) => {
          console.error('查询收藏失败:', err);
        }
      });
    }
  });
